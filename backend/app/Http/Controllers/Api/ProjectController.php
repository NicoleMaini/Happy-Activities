<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Project;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreprojectsRequest;
use App\Http\Requests\UpdateprojectsRequest;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $user = Auth::user();
        $user = User::find(2);

        $projects = Project::where(function ($query) use ($user) {
            $query->whereIn('id', function ($subQuery) use ($user) {
                $subQuery
                    ->select('project_id')
                    ->from('project_user')
                    ->where('user_id', $user->id)
                    ->where(function ($query) {
                        $query->where('team', 'collaborator')->orWhere('team', 'team-lead');
                    });
            });
        })
            ->orWhere(function ($query) use ($user) {
                $query->where('id', $user->id); // l'utente è il creatore del progetto
            })
            ->get();

        foreach ($projects as $project) {
            $project->load('users');
        }

        return ['data' => $projects];
    }

    public function store(Request $request)
    {
        if (Auth::check()) {
            abort(401);
        }

        $validatedData = $request->validate([
            'cover_image' => 'nullable|string',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'type' => 'required|in:work, study, event, free-time',
            'progress' => 'required|in:active, delete',
        ]);

        // Creazione del nuovo prodotto
        $newPoject = new Project();
        $newPoject->fill($validatedData);
        $newPoject->user_id = $request->user()->id; // Se l'autenticazione è richiesta
        $newPoject->save();

        // controllare se funziona
        // Se il tipo di progetto è 'work' o 'study', assegna il ruolo 'team-lead' all'utente attuale
        if ($newProject->type === 'work' || $newProject->type === 'study') {
            $newProject->users()->attach($request->user()->id, ['team' => 'team-lead']);
        }

        // Restituisci i dati del nuovo prodotto creato in formato JSON
        return response()->json(['message' => 'Project created successfully', 'product' => $newPoject], 201);
    }

    public function show($id)
    {
        $user = Auth::user();

        // Verifica se l'utente loggato è il creatore del progetto o un collaboratore
        $projects = Project::where(function ($query) use ($user) {
            $query->whereIn('id', function ($subQuery) use ($user) {
                $subQuery
                    ->select('project_id')
                    ->from('project_user')
                    ->where('user_id', $user->id)
                    ->where(function ($query) {
                        $query->where('team', 'collaborator')->orWhere('team', 'team-lead');
                    });
            });
        })
            ->orWhere(function ($query) use ($user) {
                $query->where('id', $user->id); // l'utente è il creatore del progetto
            })
            ->with('tasks', 'tasks.microtasks')
            ->find($id);

        if (!$project) {
            return response(['message' => 'Not found'], 404);
        }
        return ['data' => $project];
    }

    public function update(Request $request, $id)
    {
        if (!Auth::check()) {
            abort(401);
        }

        $project = Project::findOrFail($id);

        if ($project->user_id !== Auth::user()->id) {
            abort(403, 'Unauthorized');
        }

        $validator = Validator::make($request->all(), [
            'cover_image' => 'nullable|string',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'type' => 'required|in:work, study, event, free-time',
            'progress' => 'required|in:active, delete',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $project->update([
            'cover_image' => $request->cover_image,
            'name' => $request->name,
            'description' => $request->description,
            'type' => $request->type,
            'progress' => $request->progress,
        ]);

        // Restituisci una risposta JSON con il prodotto aggiornato
        return response()->json(['message' => 'Project updated successfully', 'project' => $project], 200);
    }

    public function delete($id)
    {
        if (!Auth::check()) {
            abort(401);
        }

        $project = Project::findOrFail($id);

        //da controllarne il funzionamento e nel caso funzioni inserire anche sopra in update
        $userId = Auth::id();

        // Esegui la query per verificare se l'utente è autorizzato a eliminare il progetto
        $project = Project::where('id', $project->id)
            ->whereIn('type', ['work', 'study']) // Verifica se il tipo di progetto è work o study
            ->whereHas('users', function ($query) use ($userId) {
                $query
                    ->where('user_id', $userId) // Verifica se l'utente corrente è associato al progetto
                    ->where('team', 'team-lead'); // Verifica se l'utente ha il ruolo di team-lead
            })
            ->first();

        // Se il progetto non esiste o l'utente non è autorizzato, restituisci un errore
        if (!$project) {
            abort(403, 'Unauthorized');
        }

        $newValue = 'delete';

        $product->update(['progress' => $newValue]);

        // Restituisci una risposta JSON con il prodotto aggiornato
        return response()->json(['message' => 'Column updated successfully', 'project' => $project], 200);
    }

    public function restore($id)
    {
        if (!Auth::check()) {
            abort(401);
        }

        $project = Project::findOrFail($id);

        $userId = Auth::id();

        $project = Project::where('id', $project->id)
            ->whereIn('type', ['work', 'study'])
            ->whereHas('users', function ($query) use ($userId) {
                $query->where('user_id', $userId)->where('team', 'team-lead');
            })
            ->first();

        if (!$project) {
            abort(403, 'Unauthorized');
        }

        $newValue = 'active';
        $product->update(['progress' => $newValue]);

        return response()->json(['message' => 'Column updated successfully', 'project' => $project], 200);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        if (Auth::user()->id !== $product->user_id) {
            abort(401);
        }
        $product->delete();

        return response()->json(['message' => 'Project delete with success'], 200);
    }
}

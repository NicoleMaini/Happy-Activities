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
        try {
            // $user = Auth::user();
            $user = User::find(2);

            if ($user === null) {
                throw new \Exception("L'utente selezionato non esiste", 404);
            }

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

            if ($projects->isEmpty()) {
                throw new \Exception("Non ci sono progetti disponibili per $user->name", 404);
            }

            return ['data' => $projects];
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }

    public function store(Request $request)
    {
        try {
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
            return response()->json(['message' => 'Project created successfully', 'project' => $newPoject], 201);
        } catch (\Exception $e) {
            // Gestisci l'eccezione e restituisci un messaggio di errore appropriato con codice di stato 500 (Internal Server Error)
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = Auth::user();
            // $user = User::find(2);

            // Verifica se l'utente loggato è il creatore del progetto o un collaboratore
            $project = Project::where(function ($query) use ($user) {
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
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
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
            ->whereIn('type', ['work', 'study'])
            ->whereHas('users', function ($query) use ($userId) {
                $query->where('user_id', $userId)->where('team', 'team-lead');
            })
            ->orWhere(function ($subQuery) use ($userId) {
                $subQuery->whereIn('type', ['event', 'free-time'])->where('user_id', $userId); // Supponendo che user_id sia l'ID del creatore del progetto
            })
            ->first();

        // Se il progetto non esiste o l'utente non è autorizzato, restituisci un errore
        if (!$project) {
            abort(403, 'Unauthorized');
        }

        $newValue = 'delete';

        $product->update(['progress' => $newValue]);

        // Restituisci una risposta JSON con il prodotto aggiornato
        return response()->json(['message' => 'Delete updated successfully', 'project' => $project], 200);
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
            ->orWhere(function ($subQuery) use ($userId) {
                $subQuery->whereIn('type', ['event', 'free-time'])->where('user_id', $userId);
            })
            ->first();

        if (!$project) {
            abort(403, 'Unauthorized');
        }

        $newValue = 'active';
        $product->update(['progress' => $newValue]);

        return response()->json(['message' => 'Restore updated successfully', 'project' => $project], 200);
    }

    public function destroy($id)
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
            ->orWhere(function ($subQuery) use ($userId) {
                $subQuery->whereIn('type', ['event', 'free-time'])->where('user_id', $userId); // Supponendo che user_id sia l'ID del creatore del progetto
            })
            ->first();

        if (!$project) {
            abort(403, 'Unauthorized');
        }

        $project->delete();

        return response()->json(['message' => 'Project delete with success'], 200);
    }
}

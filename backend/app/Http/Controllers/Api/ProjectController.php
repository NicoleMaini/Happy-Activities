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
    protected function checkAutentication()
    {
        if (!Auth::check()) {
            abort(401);
        }
    }

    protected function checkAuthorization()
    {
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
        })->orWhere(function ($query) use ($user) {
            $query->where('id', $user->id); // l'utente è il creatore del progetto
        });

        return $projects;
    }

    public function index()
    {
        try {
            // $this->checkAuthentication();

            $query = $this->checkAuthorization();
            $projects = $query->get();

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
            $this->checkAuthentication();

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

            $newProject->users()->attach($request->user()->id, ['team' => 'team-lead']);

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
            // $this->checkAuthentication();
            $query = $this->checkAuthorization();
            $project = $query->with('tasks', 'tasks.microtasks')->find($id);

            if (!$project) {
                return response(['message' => 'Not found'], 404);
            }

            return response()->json(['status' => 'success', 'data' => $project]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $this->checkAuthentication();

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
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }

    protected function moveProjectAuthorization($id)
    {
        //da controllarne il funzionamento
        $userId = Auth::id();
        $project = Project::findOrFail($id);

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

        return $project;
    }

    public function delete($id)
    {
        try {
            $this->checkAuthentication();

            $project = $this->moveProjectAuthorization($id);

            $newValue = 'delete';
            $project->update(['progress' => $newValue]);

            // Restituisci una risposta JSON con il prodotto aggiornato
            return response()->json(['message' => 'Delete updated successfully', 'project' => $project], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }

    public function restore($id)
    {
        try {
            $this->checkAuthentication();

            $project = $this->moveProjectAuthorization($id);

            $newValue = 'active';
            $project->update(['progress' => $newValue]);

            return response()->json(['message' => 'Restore updated successfully', 'project' => $project], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {
            $this->checkAuthentication();

            $project = $this->moveProjectAuthorization($id);
            $project->delete();

            return response()->json(['message' => 'Project delete with success'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }
}

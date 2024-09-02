<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\StoreprojectsRequest;
use App\Http\Requests\UpdateprojectsRequest;

class ProjectController extends Controller
{
    protected function checkAuthorization()
    {
        $user = Auth::user();

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
            $user = Auth::user();

            $query = $this->checkAuthorization();
            $projects = $query->get();

            foreach ($projects as $project) {
                $project->load('users');
            }

            if ($projects->isEmpty()) {
                throw new \Exception("Non ci sono progetti disponibili per $user->name", 404);
            }

            return response()->json(['status' => 'success', 'data' => $projects]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'name' => 'required|string',
                'description' => 'nullable|string',
                'type' => 'required|in:work, study, event, free-time',
                'progress' => 'required|in:active, delete',
            ]);
            if ($request->hasFile('cover_image')) {
                $imagePath = $request->file('cover_image')->store('projects', 'public');
                $validatedData['cover_image'] = $imagePath;
            }

            $newProject = new Project();

            // Assegna i dati validati all'istanza del modello
            $newProject->name = $validatedData['name'];
            $newProject->description = $validatedData['description'];
            $newProject->type = $validatedData['type'];
            $newProject->progress = $validatedData['progress'];

            if ($request->hasFile('cover_image')) {
                // Salva l'immagine nel filesystem
                $imagePath = $request->file('cover_image')->store('projects', 'public');
                $newProject->cover_image = $imagePath;
            }

            // Salva il progetto nel database
            $newProject->save();

            $newProject->users()->attach($request->user()->id, ['team' => 'team-lead']);

            return response()->json(['message' => 'Project created successfully', 'project' => $newProject], 201);
        } catch (\Exception $e) {
            // Gestisci l'eccezione e restituisci un messaggio di errore appropriato con codice di stato 500 (Internal Server Error)
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $query = $this->checkAuthorization();
            $project = $query->with('tasks', 'tasks.microtasks')->get()->find($id);

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
            $userId = Auth::id();
            $project = Project::findOrFail($id);

            // Verifica se l'utente è associato al progetto tramite la tabella ponte
            $isAuthorized = $project->users()->where('user_id', $userId)->exists();

            if (!$isAuthorized) {
                abort(403, 'Unauthorized');
            }

            $validator = $request->validate([
                'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'name' => 'required|string',
                'description' => 'nullable|string',
                'type' => 'required|in:work, study, event, free-time',
                'progress' => 'required|in:active, delete',
            ]);

            if ($request->hasFile('cover_image')) {
                $imagePath = $request->file('cover_image')->store('projects', 'public');
                $validator['cover_image'] = $imagePath;
            }

            if ($request->hasFile('cover_image')) {
                // Salva l'immagine nel filesystem
                $imagePath = $request->file('cover_image')->store('projects', 'public');
                $project->cover_image = $imagePath;
            }

            $project->save([
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
        $userId = Auth::id();
        $projectSearch = Project::findOrFail($id);

        $project = Project::where('id', $projectSearch->id)
            ->whereIn('type', ['work', 'study'])
            ->whereHas('users', function ($query) use ($userId) {
                $query->where('user_id', $userId)->where('team', 'team-lead');
            })
            ->orWhere(function ($subQuery) use ($userId) {
                $subQuery->whereIn('type', ['event', 'free-time'])->whereHas('users', function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                });
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
            $project = $this->moveProjectAuthorization($id);

            $newValue = 'delete';
            $project->update(['progress' => $newValue]);
            return response()->json(['message' => 'Delete updated successfully', 'project' => $project]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function restore($id)
    {
        try {
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
            $project = $this->moveProjectAuthorization($id);

            $project->tasks()->delete();
            $project->users()->detach();
            $project->delete();

            return response()->json(['message' => 'Project delete with success']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }
}

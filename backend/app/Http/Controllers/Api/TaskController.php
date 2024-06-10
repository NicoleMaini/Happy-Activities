<?php

namespace App\Http\Controllers\Api;

use App\Models\Task;
use App\Models\User;
use App\Models\tasks;
use App\Models\Project;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoretasksRequest;
use App\Http\Requests\UpdatetasksRequest;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // $user = Auth::user();

            // if (Auth::check()) {
            //     abort(401, 'Non autenticato');
            // }

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
                    // Trova i progetti in cui l'utente è coinvolto
                    $query->whereHas('users', function ($subQuery) use ($user) {
                        $subQuery->where('user_id', $user->id);
                    });
                })
                ->pluck('id'); // Ottieni solo gli ID dei progetti

            // Recupera i task associati ai progetti ottenuti
            $tasks = Task::with('project', 'microtasks')->whereIn('project_id', $projects)->get();

            if ($tasks->isEmpty()) {
                throw new \Exception("Non ci sono task disponibili per $user->name", 404);
            }

            return response()->json(['status' => 'success', 'data' => $tasks]);
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

            $user = User::find(2);

            // Verifica se l'utente è il creatore o un collaboratore del progetto
            $isAuthorized = Project::where('id', $request->project_id)
                ->whereHas('users', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->exists();

            if (!$isAuthorized) {
                abort(403, 'Unauthorized');
            }

            $validatedData = $request->validate([
                'image1' => 'nullable|string',
                'image2' => 'nullable|string',
                'image3' => 'nullable|string',
                'image4' => 'nullable|string',
                'title' => 'required|string',
                'description' => 'nullable|string',
                'assigned' => 'nullable|string',
                'progress' => 'required|in:to do, completed, delete',
                'appointment' => 'nullable|date',
            ]);

            // Creazione del nuovo prodotto
            $newTask = new Task();
            $newTask->fill($validatedData);
            $newTask->project_id = $request->project_id; // ID del progetto corrente da controllare e inserire con un hidden value
            $newTask->save();

            // Restituisci i dati del nuovo prodotto creato in formato JSON
            return response()->json(['message' => 'Task created successfully', 'task' => $newTask], 201);
        } catch (\Exception $e) {
            // Gestisci l'eccezione e restituisci un messaggio di errore appropriato con codice di stato 500 (Internal Server Error)
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // aggiungere una query per cercare i task a seconda delle persone a cui sono stati assegnati
    public function show($id)
    {
        try {
            $user = User::find(2);

            // if (Auth::check()) {
            //     abort(401, 'Non autenticato');
            // }

            // Recupera il task
            $task = Task::with([
                'project' => function ($query) {
                    $query->select('id', 'cover_image', 'name');
                },
                'microtasks',
            ])->find($id);

            // Verifica se il task è stato trovato
            if (!$task) {
                throw new \Exception('Il task non è stato trovato.', 404);
            }

            // Verifica se l'utente è autorizzato a accedere al task
            $isAuthorized = Project::where('id', $task->project_id)
                ->whereHas('users', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->exists();

            if (!$isAuthorized) {
                abort(403, 'Non autorizzato');
            }

            return response()->json(['status' => 'success', 'data' => $task]);
        } catch (\Exception $e) {
            // Gestisci l'eccezione e restituisci un messaggio di errore appropriato
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            if (Auth::check()) {
                abort(401);
            }

            // $user = Auth::user();
            $user = User::find(2);
            $task = Task::findOrFail($id);

            // Verifica se l'utente è collegato al progetto
            $isAuthorized = Project::where('id', $task->project_id)
                ->whereHas('users', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->exists();

            if (!$isAuthorized) {
                abort(403, 'Unauthorized');
            }

            $validator = Validator::make($request->all(), [
                'image1' => 'nullable|string',
                'image2' => 'nullable|string',
                'image3' => 'nullable|string',
                'image4' => 'nullable|string',
                'title' => 'required|string',
                'description' => 'nullable|string',
                'assigned' => 'nullable|string',
                'progress' => 'required|in:to do, completed, delete',
                'appointment' => 'nullable|date',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            $task->update([
                'image1' => $request->image1,
                'image2' => $request->image2,
                'image3' => $request->image3,
                'image4' => $request->image4,
                'title' => $request->title,
                'description' => $request->description,
                'assigned' => $request->assigned,
                'progress' => $request->progress,
                'appointment' => $request->appointment, // da vedere come viene mandato il dato
            ]);

            // Restituisci una risposta JSON con il prodotto aggiornato
            return response()->json(['message' => 'Task updated successfully', 'task' => $task], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }

    public function completed($id)
    {
        try {
            if (Auth::check()) {
                abort(401);
            }

            // $user = Auth::user();
            $user = User::find(2);
            $task = Task::findOrFail($id);

            // Verifica se l'utente è collegato al progetto
            $isAuthorized = Project::where('id', $task->project_id)
                ->whereHas('users', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->exists();

            if (!$isAuthorized) {
                abort(403, 'Unauthorized');
            }

            $newValue = 'completed';
            $task->update(['progress' => $newValue]);

            // Restituisci una risposta JSON con il prodotto aggiornato
            return response()->json(['message' => 'Task updated successfully', 'task' => $task], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }

    public function delete($id)
    {
        try {
            if (Auth::check()) {
                abort(401);
            }

            // $user = Auth::user();
            $user = User::find(2);
            $task = Task::findOrFail($id);

            // Verifica se l'utente è collegato al progetto
            $isAuthorized = Project::where('id', $task->project_id)
                ->whereHas('users', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->exists();

            if (!$isAuthorized) {
                abort(403, 'Unauthorized');
            }

            $newValue = 'delete';
            $task->update(['progress' => $newValue]);

            // Restituisci una risposta JSON con il prodotto aggiornato
            return response()->json(['message' => 'Task updated successfully', 'task' => $task], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }

    public function restore($id)
    {
        try {
            if (Auth::check()) {
                abort(401);
            }

            // $user = Auth::user();
            $user = User::find(2);
            $task = Task::findOrFail($id);

            // Verifica se l'utente è collegato al progetto
            $isAuthorized = Project::where('id', $task->project_id)
                ->whereHas('users', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->exists();

            if (!$isAuthorized) {
                abort(403, 'Unauthorized');
            }

            $newValue = 'to do';
            $task->update(['progress' => $newValue]);

            // Restituisci una risposta JSON con il prodotto aggiornato
            return response()->json(['message' => 'Task updated successfully', 'task' => $task], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {
            if (Auth::check()) {
                abort(401);
            }

            // $user = Auth::user();
            $user = User::find(2);
            $task = Task::findOrFail($id);

            // Verifica se l'utente è collegato al progetto
            $isAuthorized = Project::where('id', $task->project_id)
                ->whereHas('users', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->exists();

            if (!$isAuthorized) {
                abort(403, 'Unauthorized');
            }

            $task->delete();

            // Restituisci una risposta JSON con il prodotto aggiornato
            return response()->json(['message' => 'Task destroy successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }
}

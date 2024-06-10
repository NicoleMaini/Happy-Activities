<?php

namespace App\Http\Controllers\Api;

use App\Models\Task;
use App\Models\User;
use App\Models\Project;
use App\Models\Microtask;
use App\Models\microtasks;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoremicrotasksRequest;
use App\Http\Requests\UpdatemicrotasksRequest;

class MicrotaskController extends Controller
{
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
            $tasks = Task::where('project_id', $projects)->get();

            if ($tasks->isEmpty()) {
                throw new \Exception("Non ci sono task disponibili per $user->name", 404);
            }

            $microtasks = Microtask::with([
                'task' => function ($query) {
                    $query->select('id', 'title', 'project_id');
                },
                'task.project' => function ($query) {
                    $query->select('id', 'name');
                },
            ])
                ->whereIn('task_id', $tasks->pluck('id'))
                ->get();

            if ($microtasks->isEmpty()) {
                throw new \Exception("Non ci sono microtask disponibili per $user->name", 404);
            }

            return [
                'status' => 'success',
                'data' => $microtasks,
            ];
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }

    public function store(Request $request)
    {
        // + task_id
        try {
            if (Auth::check()) {
                abort(401);
            }

            $user = User::find(2);
            $task = Task::find($request->task_id); // task_id da inviare con un hidden input value

            // Verifica se l'utente è il creatore o un collaboratore del progetto
            $isAuthorized = Project::where('id', $task->project_id)
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
            $newTask->task_id = $request->task_id; // ID del progetto corrente da controllare e inserire con un hidden value
            $newTask->save();

            // Restituisci i dati del nuovo prodotto creato in formato JSON
            return response()->json(['message' => 'Microtask created successfully', 'task' => $newTask], 201);
        } catch (\Exception $e) {
            // Gestisci l'eccezione e restituisci un messaggio di errore appropriato con codice di stato 500 (Internal Server Error)
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
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

            $microtask = Microtask::with([
                'task' => function ($query) {
                    $query->select('id', 'title', 'project_id');
                },
                'task.project' => function ($query) {
                    $query->select('id', 'name');
                },
            ])->findOrFail($id);

            if ($microtask === null) {
                throw new \Exception("Non ci sono microtask disponibili per $user->name", 404);
            }

            $isAuthorized = Project::where('id', $microtask->task->project_id)
                ->whereHas('users', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->exists();

            if (!$isAuthorized) {
                abort(403, 'Non autorizzato');
            }

            return response()->json(['status' => 'success', 'data' => $microtask]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            // if (Auth::check()) {
            //     abort(401);
            // }

            $user = User::find(2);

            $task = Task::find($request->task_id);

            // Verifica se l'utente è il creatore o un collaboratore del progetto
            $isAuthorized = Project::where('id', $task->project_id)
                ->whereHas('users', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->exists();

            if (!$isAuthorized) {
                abort(403, 'Unauthorized');
            }

            $validator = Validator::make($request->all(), [
                'title' => 'required|string',
                'description' => 'nullable|string',
                'assigned' => 'nullable|string',
                'progress' => 'required|in:to do, completed, delete',
                'appointment' => 'nullable|date',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            $microtask->update([
                'title' => $request->title,
                'description' => $request->description,
                'assigned' => $request->assigned,
                'progress' => $request->progress,
                'appointment' => $request->appointment, // da vedere come viene mandato il dato
            ]);

            // Restituisci i dati del nuovo prodotto creato in formato JSON
            return response()->json(['message' => 'Task created successfully', 'task' => $newTask], 201);
        } catch (\Exception $e) {
            // Gestisci l'eccezione e restituisci un messaggio di errore appropriato con codice di stato 500 (Internal Server Error)
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function completed($id)
    {
        try {
            if (Auth::check()) {
                abort(401);
            }

            $user = User::find(2);
            $microtask = Microtask::findOrFail($id);
            $task = Task::find($microtask->task_id);

            // Verifica se l'utente è il creatore o un collaboratore del progetto
            $isAuthorized = Project::where('id', $task->project_id)
                ->whereHas('users', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->exists();

            if (!$isAuthorized) {
                abort(403, 'Unauthorized');
            }

            $newValue = 'completed';
            $microtask->update(['progress' => $newValue]);

            // Restituisci una risposta JSON con il prodotto aggiornato
            return response()->json(['message' => 'Microtask destroy successfully']);
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

            $user = User::find(2);
            $microtask = Microtask::findOrFail($id);
            $task = Task::find($microtask->task_id);

            // Verifica se l'utente è il creatore o un collaboratore del progetto
            $isAuthorized = Project::where('id', $task->project_id)
                ->whereHas('users', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->exists();

            if (!$isAuthorized) {
                abort(403, 'Unauthorized');
            }

            $newValue = 'delete';
            $microtask->update(['progress' => $newValue]);

            // Restituisci una risposta JSON con il prodotto aggiornato
            return response()->json(['message' => 'Microtask destroy successfully']);
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

            $user = User::find(2);
            $microtask = Microtask::findOrFail($id);
            $task = Task::find($microtask->task_id);

            // Verifica se l'utente è il creatore o un collaboratore del progetto
            $isAuthorized = Project::where('id', $task->project_id)
                ->whereHas('users', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->exists();

            if (!$isAuthorized) {
                abort(403, 'Unauthorized');
            }

            $newValue = 'to do';
            $microtask->update(['progress' => $newValue]);

            // Restituisci una risposta JSON con il prodotto aggiornato
            return response()->json(['message' => 'Microtask destroy successfully']);
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

            $user = User::find(2);
            $microtask = Microtask::findOrFail($id);
            $task = Task::find($microtask->task_id);

            // Verifica se l'utente è il creatore o un collaboratore del progetto
            $isAuthorized = Project::where('id', $task->project_id)
                ->whereHas('users', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->exists();

            if (!$isAuthorized) {
                abort(403, 'Unauthorized');
            }

            $microtask->delete();

            // Restituisci una risposta JSON con il prodotto aggiornato
            return response()->json(['message' => 'Microtask destroy successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }
}

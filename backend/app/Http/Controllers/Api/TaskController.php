<?php

namespace App\Http\Controllers\Api;

use App\Models\Task;
use App\Models\User;
use App\Models\tasks;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\StoretasksRequest;
use App\Http\Requests\UpdatetasksRequest;

class TaskController extends Controller
{
    protected function checkAutentication()
    {
        if (!Auth::check()) {
            abort(401);
        }
    }

    protected function checkAuthorization($project_id)
    {
        $user = Auth::user();

        // Verifica se l'utente è collegato al progetto
        $isAuthorized = Project::where('id', $project_id)
            ->whereHas('users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->exists();

        if (!$isAuthorized) {
            abort(403, 'Unauthorized');
        }
        return $user;
    }

    public function index()
    {
        try {
            $this->checkAutentication();
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
            $this->checkAutentication();

            $this->checkAuthorization($request->project_id);

            $validatedData = $request->validate([
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validazione immagini
                'title' => 'required|string',
                'description' => 'nullable|string',
                'assigned' => 'nullable|string',
                'progress' => 'required|in:to do,in progress,in review,completed,delete',
                'appointment' => 'nullable|date',
            ]);

            $imagesPaths = [];

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    // Salva ogni immagine nella cartella pubblica e ottieni il percorso
                    $path = $image->store('images', 'public');
                    $imagesPaths[] = $path; // Aggiungi il percorso all'array
                }
            }

            // Creazione del nuovo prodotto
            $newTask = new Task();
            $newTask->fill($validatedData);
            $newTask->project_id = $request->project_id; // ID del progetto corrente da controllare e inserire con un hidden value
            $newTask->images = json_encode($imagesPaths); // Salva le immagini come JSON
            $newTask->save();

            // Restituisci i dati del nuovo prodotto creato in formato JSON
            return response()->json([
                'message' => 'Task created successfully',
                'task' => $newTask,
                'images' => $imagesPaths
            ], 201);
        } catch (\Exception $e) {
            // Gestisci l'eccezione e restituisci un messaggio di errore appropriato con codice di stato 500 (Internal Server Error)
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // aggiungere una query per cercare i task a seconda delle persone a cui sono stati assegnati
    public function show($id)
    {
        try {
            $this->checkAutentication();

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

            $this->checkAuthorization($task->project_id);

            return response()->json(['status' => 'success', 'data' => $task]);
        } catch (\Exception $e) {
            // Gestisci l'eccezione e restituisci un messaggio di errore appropriato
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $this->checkAutentication();

            $task = Task::findOrFail($id);

            $this->checkAuthorization($task->project_id);

            $validator = Validator::make($request->all(), [
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validazione immagini
                'title' => 'required|string',
                'description' => 'nullable|string',
                'assigned' => 'nullable|string',
                'progress' => 'required|in:to do,in progress,in review,completed,delete',
                'appointment' => 'nullable|date',
            ]);

            // Gestisci la validazione fallita
            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            // Gestione delle immagini
            $imagesPaths = $task->images ? $task->images : []; // Recupera le immagini esistenti

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    // Salva ogni nuova immagine nella cartella pubblica e ottieni il percorso
                    $path = $image->store('images', 'public');
                    $imagesPaths[] = $path; // Aggiungi il percorso delle nuove immagini all'array
                }
            }

            // Assegna i valori aggiornati al task
            $task->title = $request->title;
            $task->description = $request->description;
            $task->assigned = $request->assigned;
            $task->progress = $request->progress;
            $task->appointment = $request->appointment;

            // Aggiorna le immagini solo se ce ne sono di nuove
            if ($request->hasFile('images')) {
                $task->images = json_encode($imagesPaths); // Salva i nuovi percorsi immagini come JSON
            }

            // Salva il task aggiornato nel database
            $task->save();

            // Restituisci una risposta JSON con il prodotto aggiornato
            return response()->json(['message' => 'Task updated successfully', 'task' => $task], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }

    public function updateStatusTask(Request $request) // ha bisogno dell'id del task e del valore della volonna 'to do', 'delite', 'in review', 'completed'
    {
        try {
            $this->checkAutentication();

            $id = $request->input('id');
            $action = $request->input('action');
            $task = Task::findOrFail($id);

            // Verifica se l'utente è collegato al progetto
            $this->checkAuthorization($task->project_id);
            $task->update(['progress' => $action]);

            // Restituisci una risposta JSON con il prodotto aggiornato
            return response()->json(['message' => 'Task updated successfully', 'task' => $task], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }

    // public function delete($id)
    // {
    //     try {
    //         $this->checkAutentication();

    //         $task = Task::findOrFail($id);

    //         $this->checkAuthorization($task->project_id);

    //         $newValue = 'delete';
    //         $task->update(['progress' => $newValue]);

    //         // Restituisci una risposta JSON con il prodotto aggiornato
    //         return response()->json(['message' => 'Task updated successfully', 'task' => $task], 200);
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => $e->getMessage()], $e->getCode());
    //     }
    // }

    // public function restore($id)
    // {
    //     try {
    //         $this->checkAutentication();

    //         $task = Task::findOrFail($id);

    //         $this->checkAuthorization($task->project_id);

    //         $newValue = 'to do';
    //         $task->update(['progress' => $newValue]);

    //         // Restituisci una risposta JSON con il prodotto aggiornato
    //         return response()->json(['message' => 'Task updated successfully', 'task' => $task], 200);
    //     } catch (\Exception $e) {
    //         return response()->json(['error' => $e->getMessage()], $e->getCode());
    //     }
    // }

    public function destroy($id)
    {
        try {
            $this->checkAutentication();

            $task = Task::findOrFail($id);

            // Verifica se l'utente è collegato al progetto
            $this->checkAuthorization($task->project_id);

            $task->delete();

            // Restituisci una risposta JSON con il prodotto aggiornato
            return response()->json(['message' => 'Task destroy successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode());
        }
    }
}

<?php

namespace App\Http\Controllers\Api;


use App\Models\User;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // recupera tutti gli utenti: serve? Bo'
    public function usersGet()
    {
        $users = User::all();
        return ['return' => 'success', 'data' => $users];
    }

    // funzione che controlla se l'utente è loggato e se il progetto esiste e li ritorna

    protected function checkAuthorization($project_id)
    {
        $user = Auth::user();

        if (!$user instanceof User) {
            return response()->json(['message' => 'Utente non autenticato'], 401);
        }

        $project = Project::find($project_id);

        // Controlla se il progetto esiste
        if (!$project) {
            return response()->json(['message' => 'Progetto non trovato'], 404);
        }

        return [
            'user' => $user,
            'project' => $project
        ];
    }

    // funzione put che cambia il valore nella tabella favorite_project da null a project_id o viceverrsa, in base al parametro che gli passiamo

    public function isFavorite(Request $request)
    {
        $project_id = $request->input('project_id');  // Usa input() per accedere ai dati
        $isFavorite = $request->input('isFavorite');

        try {
            $check = $this->checkAuthorization($project_id);

            $user = $check['user'];
            $project = $check['project'];

            if ($user) {
                if ($isFavorite) {
                    $user->favorite_project = $project_id;
                } else {
                    $user->favorite_project = null;
                }
                $user->save();

                return response()->json(['message' => 'Favorite project updated successfully', 'project' => $project, 'user' => $user]);
            } else {
                return response()->json(['message' => 'Utente non autenticato'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

// funzione per inviaare la richiesta di partecipazione a futuri collaboratori

    public function updateTeamStatus($project_id, $action)
    {
        try {
            $check = $this->checkAuthorization($project_id);

            $user = $check['user'];
            $project = $check['project'];

            // Verifica se il tipo del progetto è "together"
            if ($project->type === 'together') {
                $teamStatus = $action === 'accept' ? 'collaborator' : 'rejected';

                // Aggiorna lo stato del team nella tabella pivot
                $user->projects()->updateExistingPivot($project_id, ['team' => $teamStatus]);

                $message = $action === 'accept' ? 'Added as a collaborator to the team' : 'Collaboration rejected';
                return response()->json(['message' => $message], 200);
            } else {
                return response()->json(['message' => 'The project does not belong to the "together" type'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    // public function acept($project_id)
    // {
    //     $check = $this->checkAuthorization($project_id);

    //     $user = $check['user'];
    //     $project = $check['project'];

    //     // Verifica se il tipo del progetto è "work" o "study"
    //     if ($project->type === 'together') {
    //         // Aggiorna lo stato del team a "pending" nella tabella pivot
    //         $user->projects()->updateExistingPivot($project_id, ['team' => 'collaborator']);

    //         return response()->json(['message' => 'Aggiunto come collaboratore al team'], 200);
    //     } else {
    //         return response()->json(['message' => 'Il progetto non appartiene al tipo "together"'], 400);
    //     }
    // }

    // public function reject($project_id)
    // {
    //     // $this->checkAutentication();
    //     $check = $this->checkAuthorization($project_id);

    //     $user = $check['user'];
    //     $project = $check['project'];
    //     // Verifica se il tipo del progetto è "work" o "study"
    //     if ($project->type === 'together') {
    //         // Aggiorna lo stato del team a "pending" nella tabella pivot
    //         $user->projects()->updateExistingPivot($project_id, ['team' => 'rejected']);

    //         return response()->json(['message' => 'Collaborazione respinta'], 200);
    //     } else {
    //         return response()->json(['message' => 'Il progetto non appartiene al tipo "together"'], 400);
    //     }
    // }

    protected function checkAuthorizationForPivot($projectId, $targetUserId)
    {

        $check = $this->checkAuthorization($projectId);
        $currentUser = $check['user'];

        if (!$currentUser) {
            return response()->json(['message' => 'Utente non autenticato'], 401);
        }

        // Trova il progetto con l'ID specificato
        $project = Project::find($projectId);
        if (!$project) {
            return response()->json(['message' => 'Progetto non trovato'], 404);
        }

        // Verifica se il tipo del progetto è "work" o "study"
        if ($project->type !== 'together') {
            return response()->json(['message' => 'Il progetto non appartiene al tipo "together" o "study"'], 400);
        }

        // Verifica se l'utente attuale è un team lead per questo progetto
        $currentUserPivot = $currentUser->projects()->where('project_id', $projectId)->first();
        if (!$currentUserPivot || $currentUserPivot->pivot->team !== 'team-lead') {
            return response()->json(['message' => 'Non hai i permessi per aggiornare lo stato del team di un altro utente'], 403);
        }

        // Trova l'utente target
        $targetUser = User::find($targetUserId);
        if (!$targetUser) {
            return response()->json(['message' => 'Utente target non trovato'], 404);
        }

        // Controlla se esiste già una riga nella tabella pivot per l'utente target
        $existingPivotRow = $targetUser->projects()->where('project_id', $projectId)->exists();

        return [
            'existingPivotRow' => $existingPivotRow,
            'targetUser' => $targetUser
        ];
    }

    public function pending($projectId, $targetUserId)
    {
        // $this->checkAutentication();
        $check = $this->checkAuthorizationForPivot($projectId, $targetUserId);

        $existingPivotRow = $check['existingPivotRow'];
        $targetUser = $check['targetUser'];

        if ($existingPivotRow) {
            // Se esiste, aggiorna lo stato del team a "pending"
            $targetUser->projects()->updateExistingPivot($projectId, ['team' => 'pending']);
        } else {
            // Se non esiste, crea una nuova riga nella tabella pivot con lo stato del team a "pending"
            $targetUser->projects()->attach($projectId, ['team' => 'pending']);
        }

        return response()->json(['message' => 'Utente invitato come collaboratore'], 200);
    }

    // funzione per la presa visione del respingimento della collaborazione e per l'annullamento

    public function checkReject($projectId, $targetUserId)
    {
        // $this->checkAutentication();
        $check = $this->checkAuthorizationForPivot($projectId, $targetUserId);

        $existingPivotRow = $check['existingPivotRow'];
        $targetUser = $check['targetUser'];

        if ($existingPivotRow) {
            // Se esiste, elimina la riga della tabella pivot
            $targetUser->projects()->detach($projectId);

            return response()->json(['message' => 'Stato del team dell\'utente target cancellato'], 200);
        } else {
            return response()->json(['message' => 'La riga nella tabella pivot non esiste'], 404);
        }
    }

    public function taskForUser() {}
}

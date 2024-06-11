<?php

namespace App\Http\Controllers\Api;

use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
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

        $project = Project::find($project_id);

        // Controlla se il progetto esiste
        if (!$project) {
            return response()->json(['message' => 'Progetto non trovato'], 404);
        }

        return $project;
    }

    public function acept($project_id)
    {
        $this->checkAutentication();
        $this->checkAuthorization($project_id);
        // Verifica se il tipo del progetto è "work" o "study"
        if ($project->type === 'work' || $project->type === 'study') {
            // Aggiorna lo stato del team a "pending" nella tabella pivot
            $user->projects()->updateExistingPivot($project_id, ['team' => 'collaborator']);

            return response()->json(['message' => 'Aggiunto come collaboratore al team'], 200);
        } else {
            return response()->json(['message' => 'Il progetto non appartiene al tipo "work" o "study"'], 400);
        }
    }

    public function reject($project_id)
    {
        $this->checkAutentication();
        $this->checkAuthorization($project_id);

        // Verifica se il tipo del progetto è "work" o "study"
        if ($project->type === 'work' || $project->type === 'study') {
            // Aggiorna lo stato del team a "pending" nella tabella pivot
            $user->projects()->updateExistingPivot($project_id, ['team' => 'rejected']);

            return response()->json(['message' => 'Collaborazione respinta'], 200);
        } else {
            return response()->json(['message' => 'Il progetto non appartiene al tipo "work" o "study"'], 400);
        }
    }

    protected function checkAuthorizationForPivot($projectId, $targetUser)
    {
        $currentUser = auth()->user();
        if (!$currentUser) {
            return response()->json(['message' => 'Utente non autenticato'], 401);
        }

        // Trova il progetto con l'ID specificato
        $project = Project::find($projectId);
        if (!$project) {
            return response()->json(['message' => 'Progetto non trovato'], 404);
        }

        // Verifica se il tipo del progetto è "work" o "study"
        if ($project->type !== 'work' && $project->type !== 'study') {
            return response()->json(['message' => 'Il progetto non appartiene al tipo "work" o "study"'], 400);
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

        return $existingPivotRow;
    }

    public function pending($projectId, $targetUserId)
    {
        $this->checkAutentication();
        $this->checkAuthorizationForPivot($projectId, $targetUser);

        if ($existingPivotRow) {
            // Se esiste, aggiorna lo stato del team a "pending"
            $targetUser->projects()->updateExistingPivot($projectId, ['team' => 'pending']);
        } else {
            // Se non esiste, crea una nuova riga nella tabella pivot con lo stato del team a "pending"
            $targetUser->projects()->attach($projectId, ['team' => 'pending']);
        }

        return response()->json(['message' => 'Utente invitato come collaboratore'], 200);
    }

    public function checkReject($projectId, $targetUserId)
    {
        $this->checkAutentication();
        $this->checkAuthorizationForPivot($projectId, $targetUser);

        if ($existingPivotRow) {
            // Se esiste, elimina la riga della tabella pivot
            $targetUser->projects()->detach($projectId);

            return response()->json(['message' => 'Stato del team dell\'utente target cancellato'], 200);
        } else {
            return response()->json(['message' => 'La riga nella tabella pivot non esiste'], 404);
        }
    }

    public function taskForUser()
    {
    }
}

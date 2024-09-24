<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\MicrotaskController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::name('api.v1')
    ->prefix('v1')
    ->middleware(['auth:sanctum'])
    ->group(function () {
        Route::put('/projects/update-status', [ProjectController::class, 'updateStatusProject']);
        Route::resource('/projects', ProjectController::class);
        Route::resource('/tasks', TaskController::class);
        Route::put('/tasks/completed/{id}', [TaskController::class, 'completed']);
        Route::put('/tasks/delete/{id}', [TaskController::class, 'delete']);
        Route::put('/tasks/restore/{id}', [TaskController::class, 'restore']);
        Route::resource('/microtasks', MicrotaskController::class);
        Route::put('/microtasks/completed/{id}', [MicrotaskController::class, 'completed']);
        Route::put('/microtasks/delete/{id}', [MicrotaskController::class, 'delete']);
        Route::put('/microtasks/restore/{id}', [MicrotaskController::class, 'restore']);
        Route::get('/users', [UserController::class, 'usersGet']);
        Route::put('/user/isFavorite', [UserController::class, 'isFavorite']);
        Route::put('/user/{projectId}/acept-request', [UserController::class, 'acept']);
        Route::put('/user/{projectId}/reject-request', [UserController::class, 'reject']);
        Route::put('/user/{projectId}/pending-request/{targetUserId}', [UserController::class, 'pending']);
    });

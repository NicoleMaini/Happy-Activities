<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\MicrotaskController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::name('api.v1')
    ->prefix('v1')
    // ->middleware(['auth:sanctum'])
    ->group(function () {
        Route::resource('/projects', ProjectController::class);
        Route::put('/projects/delete/{id}', [ProjectController::class, 'delete']);
        Route::put('/projects/restore/{id}', [ProjectController::class, 'restore']);
        Route::resource('/tasks', TaskController::class);
        Route::put('/tasks/completed/{id}', [TaskController::class, 'completed']);
        Route::put('/tasks/delete/{id}', [TaskController::class, 'delete']);
        Route::put('/tasks/restore/{id}', [TaskController::class, 'restore']);
        Route::resource('/microtasks', MicrotaskController::class);
        Route::put('/microtasks/completed/{id}', [MicrotaskController::class, 'completed']);
        Route::put('/microtasks/delete/{id}', [MicrotaskController::class, 'delete']);
        Route::put('/microtasks/restore/{id}', [MicrotaskController::class, 'restore']);
    });

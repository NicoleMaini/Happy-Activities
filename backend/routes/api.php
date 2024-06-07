<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::name('api.v1')
    ->prefix('v1')
    // ->middleware(['auth:sanctum'])
    ->group(function () {
        Route::resource('/progects', ProjectController::class);
        Route::resource('/tasks', ProjectController::class);
        Route::resource('/microtasks', ProjectController::class);
    });

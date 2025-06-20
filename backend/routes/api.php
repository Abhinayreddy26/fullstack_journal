<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\JournalController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| These routes are loaded by the RouteServiceProvider within a group
| which is assigned the "api" middleware group.
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Test if user is authenticated (for debugging session)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});



Route::post('/logout', [AuthController::class, 'logout']);

// Journal routes
Route::get('/journals', [JournalController::class, 'index']);
Route::get('/journals/{id}', [JournalController::class, 'show']);
Route::post('/journals', [JournalController::class, 'store']);
Route::put('/journals/{id}', [JournalController::class, 'update']);
Route::delete('/journals/{id}', [JournalController::class, 'destroy']);
Route::get('/my-journals', [JournalController::class, 'myJournals']);
Route::get('/journals/search', [JournalController::class, 'search']);
Route::get('/journals/date/{date}', [JournalController::class, 'filterByDate']);
Route::get('/journals/{id}/summary', [JournalController::class, 'summary']);


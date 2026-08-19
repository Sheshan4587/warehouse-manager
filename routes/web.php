<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;

Route::get('/', function () {
    return Inertia::render('Dashboard/Index');
});

Route::resource('categories', CategoryController::class)
    ->only(['index', 'store', 'update', 'destroy']);
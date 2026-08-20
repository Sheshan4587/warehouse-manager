<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SupplierController;

//Dashboard route
Route::get('/', function () {
    return Inertia::render('Dashboard/Index');
});

//Category routes
Route::resource('categories', CategoryController::class)
    ->only(['index', 'store', 'update', 'destroy']);

//Supplier routes
Route::resource('suppliers', SupplierController::class)
    ->only(['index', 'store', 'update', 'destroy']);
<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShipmentController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SaleReturnController;

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

//Product routes
Route::resource('products', ProductController::class)
    ->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);

//Shipment routes
Route::resource('shipments', ShipmentController::class)
    ->only(['index', 'create', 'store', 'show', 'destroy']);

//Sale routes
Route::resource('sales', SaleController::class)
    ->only(['index', 'create', 'store', 'show', 'destroy']);

// Sale Return routes
Route::resource('returns', SaleReturnController::class)
    ->only(['index', 'create', 'store', 'show', 'destroy']);
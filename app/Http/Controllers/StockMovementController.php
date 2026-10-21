<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class StockMovementController extends Controller
{
    public function index(): Response
    {
        $movements = StockMovement::with('product')
            ->latest()
            ->get();

        $stats = [
            'total_movements' => $movements->count(),
            'stock_in'        => $movements->whereIn('type', ['shipment_in', 'return_in'])->sum('packs_delta'),
            'stock_out'       => abs($movements->whereIn('type', ['sale_out', 'return_out'])->sum('packs_delta')),
            'adjustments'     => $movements->where('type', 'adjustment')->count(),
        ];

        return Inertia::render('StockMovements/Index', [
            'movements' => $movements,
            'stats'     => $stats,
            'products'  => Product::orderBy('name')->get(['id', 'name']),
        ]);
    }
}
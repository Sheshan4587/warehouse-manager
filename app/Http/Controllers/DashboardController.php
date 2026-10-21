<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\Shipment;
use App\Models\SaleReturn;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $products = Product::all();
        $todaySales = Sale::with('items')->whereDate('sold_at', today())->get();
        $recentSales = Sale::with('items')->latest()->take(5)->get();
        $recentShipments = Shipment::with('supplier')->latest()->take(5)->get();
        $pendingReturns = SaleReturn::where('status', 'pending')->with('items')->get();

        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'total_products'       => $products->count(),
                'low_stock'            => $products->filter(fn($p) => $p->stock_packs > 0 && $p->stock_packs <= $p->low_stock_threshold)->count(),
                'out_of_stock'         => $products->filter(fn($p) => $p->stock_packs === 0)->count(),
                'today_sales'          => $todaySales->count(),
                'today_revenue'        => $todaySales->sum('total_amount'),
                'pending_returns'      => $pendingReturns->count(),
                'pending_return_items' => $pendingReturns->sum(fn($r) => $r->items->count()),
            ],
            'recent_sales'       => $recentSales,
            'recent_shipments'   => $recentShipments,
            'low_stock_products' => $products
                ->filter(fn($p) => $p->stock_packs <= $p->low_stock_threshold && $p->stock_packs > 0)
                ->values(),
        ]);
    }
}
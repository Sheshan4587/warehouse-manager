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
                'low_stock'            => $products->filter(fn($p) => $p->stock_packs > 0 && $p->stock_packs <= $p->low_stock_threshold)->count(), // Count products that are low in stock but not out of stock
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
    /**
     * The diffrence between -> and => is that -> is used to access properties and methods of an object, 
     * while => is used to define key-value pairs in an associative array. 
     * In this context, -> is used to access the count() method of the Collection object returned by the filter() method, 
     * while => is used to define the key-value pairs in the stats array that is passed to the Inertia::render() method.
     * In here key is the name of the stat and value is the value of the stat.
     */
}
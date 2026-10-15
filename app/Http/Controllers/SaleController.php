<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use App\Models\StockMovement;
use App\Http\Requests\StoreSaleRequest;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SaleController extends Controller
{
    public function index(): Response
    {
        $sales = Sale::with('items')
            ->latest()
            ->get();

        $stats = [
            'total_sales'   => $sales->count(),
            'total_revenue' => $sales->sum('total_amount'),
            'today_sales'   => $sales->filter(fn($s) => $s->sold_at->isToday())->count(),
            'today_revenue' => $sales->filter(fn($s) => $s->sold_at->isToday())->sum('total_amount'),
        ];

        return Inertia::render('Sales/Index', [
            'sales' => $sales,
            'stats' => $stats,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Sales/Create', [
            'products' => Product::orderBy('name')
                ->where('stock_packs', '>', 0)
                ->get(['id', 'name', 'selling_price', 'stock_packs', 'packs_per_bundle']),
        ]);
    }

    public function store(StoreSaleRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {

            // Calculate total amount
            $totalAmount = collect($request->items)->sum(function ($item) {
                return $item['packs_sold'] * $item['unit_price'];
            });

            // Create sale record
            $sale = Sale::create([
                'reference_number' => $request->reference_number, //$request-> is use for accessing the data from the request object, which contains the validated input data from the form submission in front-end.
                'sold_at'          => $request->sold_at, //in short, $request-> is a way to access the data that was sent from the front-end form to the back-end controller.
                'total_amount'     => $totalAmount, //total amount of the sale calculated from the items sold
                'notes'            => $request->notes,
            ]);

            // Process each item
            foreach ($request->items as $item) {
                $subtotal = $item['packs_sold'] * $item['unit_price'];

                // Create sale item
                $sale->items()->create([
                    'product_id'  => $item['product_id'],
                    'packs_sold'  => $item['packs_sold'],
                    'unit_price'  => $item['unit_price'],
                    'subtotal'    => $subtotal,
                ]);

                // Deduct from stock
                $product = Product::find($item['product_id']);
                $newStock = max(0, $product->stock_packs - $item['packs_sold']);
                $product->update(['stock_packs' => $newStock]);

                // Write stock movement
                StockMovement::create([
                    'product_id'     => $item['product_id'],
                    'type'           => 'sale_out',
                    'packs_delta'    => -$item['packs_sold'],
                    'packs_after'    => $newStock,
                    'reference_type' => 'sale',
                    'reference_id'   => $sale->id,
                    'note'           => "Sold in {$sale->reference_number}",
                ]);
            }
        });

        return redirect()
            ->route('sales.index')
            ->with('success', 'Sale recorded successfully. Stock updated.');
    }

    public function show(Sale $sale): Response
    {
        /**
         * Load the sale with its items and the associated products, then render the 'Sales/Show' view using Inertia, passing the loaded sale data to the view.
         * The 'load' method is used to eager load the 'items' relationship and the 'product' relationship of each item to avoid the N+1 query problem, ensuring efficient database queries.
         * This approach minimizes the number of database queries needed to fetch the required data, improving the performance of the application.
         */
        return Inertia::render('Sales/Show', [
            'sale' => $sale->load('items.product'),
        ]);
    }

    public function destroy(Sale $sale): RedirectResponse
    {
        $sale->delete();

        return redirect()
            ->route('sales.index')
            ->with('success', 'Sale deleted.');
    }
}
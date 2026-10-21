<?php

namespace App\Http\Controllers;

use App\Models\SaleReturn;
use App\Models\Sale;
use App\Models\Product;
use App\Models\StockMovement;
use App\Http\Requests\StoreSaleReturnRequest;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SaleReturnController extends Controller
{
    public function index(): Response
    {
        $returns = SaleReturn::with(['sale', 'items.product'])
            ->latest()
            ->get();

        $stats = [
            'total_returns'  => $returns->count(),
            'pending'        => $returns->where('status', 'pending')->count(),
            'sent_to_supplier' => $returns->where('status', 'sent_to_supplier')->count(),
            'total_items'    => $returns->sum(fn($r) => $r->items->count()),
        ];

        return Inertia::render('Returns/Index', [
            'returns' => $returns,
            'stats'   => $stats,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Returns/Create', [
            'sales' => Sale::with('items.product')
                ->latest()
                ->get(['id', 'reference_number', 'sold_at']),
        ]);
    }

    public function store(StoreSaleReturnRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {

            // Create the return record
            $return = SaleReturn::create([
                'sale_id'          => $request->sale_id,
                'reference_number' => $request->reference_number,
                'returned_at'      => $request->returned_at,
                'status'           => 'pending',
                'notes'            => $request->notes,
            ]);

            // Process each returned item
            foreach ($request->items as $item) {
                // Create return item record
                $return->items()->create([
                    'product_id'     => $item['product_id'],
                    'packs_returned' => $item['packs_returned'],
                    'reason'         => $item['reason'],
                    'sent_to_supplier' => false,
                ]);

                // Add to returned stock (separate from sellable stock)
                $product = Product::find($item['product_id']);
                $newReturnedStock = $product->stock_returned_packs + $item['packs_returned'];
                $product->update(['stock_returned_packs' => $newReturnedStock]);

                // Write stock movement
                StockMovement::create([
                    'product_id'     => $item['product_id'],
                    'type'           => 'return_in',
                    'packs_delta'    => $item['packs_returned'],
                    'packs_after'    => $product->stock_packs,
                    'reference_type' => 'return',
                    'reference_id'   => $return->id,
                    'note'           => "Customer return: {$item['reason']}",
                ]);
            }
        });

        return redirect()
            ->route('returns.index')
            ->with('success', 'Return recorded successfully.');
    }

    public function show(SaleReturn $return): Response
    {
        return Inertia::render('Returns/Show', [
            'return' => $return->load(['sale', 'items.product']),
        ]);
    }

    public function destroy(SaleReturn $return): RedirectResponse
    {
        $return->delete();

        return redirect()
            ->route('returns.index')
            ->with('success', 'Return deleted.');
    }
}
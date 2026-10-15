<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShipmentRequest;
use App\Models\Product;
use App\Models\Shipment;
use App\Models\StockMovement;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ShipmentController extends Controller
{
    // Display all shipments with their supplier and shipment item details.
    public function index(): Response
    {
        $shipments = Shipment::with(['supplier', 'items'])
            ->latest()
            ->get();

        return Inertia::render('Shipments/Index', [
            'shipments' => $shipments,
        ]);
    }

    // Display the shipment form with the suppliers and products available to select.
    public function create(): Response
    {
        // supplier get from supplier page it is used to populate the supplier dropdown in the shipment form
        // product get from product page it is used to populate the product dropdown in the shipment form
        return Inertia::render('Shipments/Create', [
            'suppliers' => Supplier::orderBy('name')->get(['id', 'name']),
            'products' => Product::orderBy('name')->get(['id', 'name', 'packs_per_bundle', 'cost_price']),
        ]);
    }

    // Validate and save a shipment, then increase stock and record each stock movement.
    public function store(StoreShipmentRequest $request): RedirectResponse
    {
        // DB::transaction ensures ALL of this succeeds or NONE of it does
        // If anything fails halfway, the database rolls back to before
        // DB::transaction uses a closure to wrap the code that should be executed as a single transaction.
        DB::transaction(function () use ($request) {

            // Calculate total cost from all items
            // collect() is a Laravel helper function that creates a collection instance from the given array. It provides a fluent, convenient wrapper for working with arrays of data.
            $totalCost = collect($request->items)->sum(function ($item) {
                return $item['packs_received'] * $item['unit_cost'];
            });

            // Create the shipment record
            $shipment = Shipment::create([
                'supplier_id' => $request->supplier_id,
                'reference_number' => $request->reference_number,
                'type' => $request->type,
                'received_at' => $request->received_at,
                'total_cost' => $totalCost,
                'notes' => $request->notes,
            ]);

            // Process each item
            foreach ($request->items as $index => $item) {
                // Create shipment item record
                // $request is a StoreShipmentRequest object that contains the validated data from the request. It is used to access the items array and other shipment details.
                // $shipment is the newly created Shipment model instance. It is used to associate the shipment items with the shipment.
                // The items() method is a relationship method defined in the Shipment model that returns a hasMany relationship to the ShipmentItem model. It allows us to create new shipment items associated with the shipment.
                // The create() method is used to create a new ShipmentItem record in the database. It takes an array of attributes that correspond to the columns in the shipment_items table.
                $shipment->items()->create([
                    'product_id' => $item['product_id'], //$item['product_id'] is the ID of the product being shipped. It is used to associate the shipment item with the correct product.
                    'bundles_received' => $item['bundles_received'],// $item['bundles_received'] is the number of bundles received for this shipment item. It is used to record the quantity of the product being shipped.
                    'packs_received' => $item['packs_received'],
                    'unit_cost' => $item['unit_cost'],
                ]);

                // Update product stock based on shipment type
                $product = Product::findOrFail($item['product_id']);

                if ($request->type === 'incoming') {
                    $newStock = $product->stock_packs + $item['packs_received'];
                    $movementType = 'shipment_in';
                    $packsDelta = $item['packs_received'];
                    $note = "Received in shipment {$shipment->reference_number}";
                } else {
                    // outgoing — return stock to the supplier from available stock
                    if ($item['packs_received'] > $product->stock_packs) {
                        throw ValidationException::withMessages([
                            "items.{$index}.packs_received" =>
                                "Cannot return {$item['packs_received']} packs of {$product->name}; only {$product->stock_packs} are in stock.",
                        ]);
                    }

                    $newStock = $product->stock_packs - $item['packs_received'];
                    $movementType = 'return_out';
                    $packsDelta = -$item['packs_received'];
                    $note = "Sent back to supplier in shipment {$shipment->reference_number}";
                }

                $product->update(['stock_packs' => $newStock]);

                StockMovement::create([
                    'product_id' => $item['product_id'],
                    'type' => $movementType,
                    'packs_delta' => $packsDelta,
                    'packs_after' => $newStock,
                    'reference_type' => 'shipment',
                    'reference_id' => $shipment->id,
                    'note' => $note,
                ]);
            }
        });

        return redirect()
            ->route('shipments.index')
            ->with('success', 'Shipment recorded successfully. Stock updated.');
    }

    // Display one shipment together with its supplier, items, and related products.
    public function show(Shipment $shipment): Response
    {
        return Inertia::render('Shipments/Show', [
            'shipment' => $shipment->load(['supplier', 'items.product']),
        ]);
    }

    // Delete a shipment and return to the shipment list with a success message.
    public function destroy(Shipment $shipment): RedirectResponse
    {
        $shipment->delete();

        return redirect()
            ->route('shipments.index')
            ->with('success', 'Shipment deleted.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::with(['category', 'supplier'])
            ->latest()
            ->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'stats' => [
                'total' => $products->count(),
                'low_stock' => $products->filter(
                    fn (Product $product): bool => $product->isLowStock()
                )->count(),
                'out_of_stock' => $products->where('stock_packs', 0)->count(),
                'total_value' => $products->sum(
                    fn (Product $product): float => $product->stock_packs * (float) $product->cost_price
                ),
            ],
        ]);
    }
    
    public function create(): Response
    {   
        // Fetch categories and suppliers for the product creation form
        return Inertia::render('Products/Create', [
            'categories' => Category::orderBy('name')->get(),
            'suppliers' => Supplier::orderBy('name')->get(),
        ]);
    }
    /**
     * The store method is for creating a new product.
     *also it uses the StoreProductRequest to validate the request data before creating the product.
     * @param StoreProductRequest $request
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        Product::create($request->validated());

        return redirect()
            ->route('products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * The edit method is for displaying the product edit form.
     * it fetches the product to be edited, along with the list of categories and suppliers for selection in the form.
     * @param Product $product
     * @return Response
     */
    public function edit(Product $product): Response
    {
        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => Category::orderBy('name')->get(),
            'suppliers' => Supplier::orderBy('name')->get(),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $product->update($request->validated());

        return redirect()
            ->route('products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()
            ->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }
}

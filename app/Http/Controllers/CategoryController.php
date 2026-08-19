<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    // index() runs when you visit /categories
    // It fetches all categories and sends them to the React page
    public function index(): Response
    {
        return Inertia::render('Categories/Index', [
            'categories' => Category::latest()->get(),
        ]);
    }

    // create() runs when you visit /categories/create
    // It just loads the form page — no data needed
    public function create(): Response
    {
        return Inertia::render('Categories/Create');
    }

    // store() runs when the create form is submitted
    // $request is already validated by StoreCategoryRequest
    // before this method even runs
    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        Category::create([
            'name'        => $request->name,
            'slug'        => Str::slug($request->name),
            'description' => $request->description,
        ]);

        return redirect()
            ->route('categories.index')
            ->with('success', 'Category created successfully.');
    }
    
    // update() runs when the edit form is submitted
    // Same as store() but updates an existing record
    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $category->update([
            'name'        => $request->name,
            'slug'        => Str::slug($request->name),
            'description' => $request->description,
        ]);

        return redirect()
            ->route('categories.index')
            ->with('success', 'Category updated successfully.');
    }

    // edit() runs when you visit /categories/{id}/edit
    // It finds the category and sends it to the edit form
    public function edit(Category $category): Response
    {
        return Inertia::render('Categories/Edit', [
            'category' => $category,
        ]);
    }

    // destroy() runs when you click delete
    // It deletes the category and redirects back to the list
    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return redirect()
            ->route('categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id'        => 'required|exists:categories,id',
            'supplier_id'        => 'required|exists:suppliers,id',
            'name'               => 'required|string|max:255',
            'sku'                => 'required|string|max:100|unique:products,sku',
            'packs_per_bundle'   => 'required|integer|min:1',
            'cost_price'         => 'required|numeric|min:0',
            'selling_price'      => 'required|numeric|min:0',
            'low_stock_threshold'=> 'required|integer|min:0',
        ];
    }
}
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * This method act as array of rules for validating the request data when creating a new sale from the front end.
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'reference_number'       => 'required|string|max:100|unique:sales,reference_number',
            'sold_at'                => 'required|date',
            'notes'                  => 'nullable|string|max:1000',
            'items'                  => 'required|array|min:1',
            'items.*.product_id'     => 'required|exists:products,id',
            'items.*.packs_sold'     => 'required|integer|min:1',
            'items.*.unit_price'     => 'required|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'items.required'                => 'At least one item is required.',
            'items.*.product_id.required'   => 'Please select a product for each row.',
            'items.*.packs_sold.min'        => 'Packs sold must be at least 1.',
        ];
    }
}
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSaleReturnRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sale_id'                => 'required|exists:sales,id',
            'reference_number'       => 'required|string|max:100|unique:returns,reference_number',
            'returned_at'            => 'required|date',
            'notes'                  => 'nullable|string|max:1000',
            'items'                  => 'required|array|min:1',
            'items.*.product_id'     => 'required|exists:products,id',
            'items.*.packs_returned' => 'required|integer|min:1',
            'items.*.reason'         => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'items.required'                    => 'At least one item is required.',
            'items.*.product_id.required'       => 'Please select a product for each row.',
            'items.*.packs_returned.min'        => 'Packs returned must be at least 1.',
            'items.*.reason.required'           => 'Please provide a reason for each returned item.',
        ];
    }
}
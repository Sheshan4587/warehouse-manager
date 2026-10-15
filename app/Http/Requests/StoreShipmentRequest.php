<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreShipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     * these rules ensure that the shipment data is valid before processing it.
     * @return array
     */
    public function rules(): array
    {
        return [
            'supplier_id'               => 'required|exists:suppliers,id',
            'reference_number'          => 'required|string|max:100|unique:shipments,reference_number',
            'type'                      => 'required|in:incoming,outgoing',
            'received_at'               => 'required|date',
            'notes'                     => 'nullable|string|max:1000',

            // items is an array — validate each item
            'items'                     => 'required|array|min:1',
            'items.*.product_id'        => 'required|exists:products,id',
            'items.*.bundles_received'  => 'required|integer|min:0',
            'items.*.packs_received'    => 'required|integer|min:1',
            'items.*.unit_cost'         => 'required|numeric|min:0',
        ];
    }

    /**
     * Custom messages for validation errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'items.required'                => 'At least one item is required.',
            'items.*.product_id.required'   => 'Please select a product for each row.',
            'items.*.packs_received.min'    => 'Packs received must be at least 1.',
        ];
    }
}
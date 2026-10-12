<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class UpdateSupplierRequest
 * this class is used to validate the request data when updating a supplier.
 * authorize method returns true to allow all users to make this request.
 * rules method returns an array of validation rules for the request data.
 * @package App\Http\Requests
 */
class UpdateSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'           => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'phone'          => 'nullable|string|max:50',
            'email'          => 'nullable|email|max:255',
            'address'        => 'nullable|string|max:1000',
        ];
    }
}
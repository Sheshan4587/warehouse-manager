<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        // We have a single user system so everyone is allowed
        return true;
    }

    

    public function rules(): array
    {
        return [
            // 'required'  → field must be present and not empty
            // 'string'    → must be text
            // 'max:255'   → no longer than 255 characters
            'name' => 'required|string|max:255',

            // 'nullable'  → field is optional
            // 'string'    → if provided, must be text
            // 'max:1000'  → no longer than 1000 characters
            'description' => 'nullable|string|max:1000',
        ];
    }

    
}
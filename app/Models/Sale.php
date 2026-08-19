<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sale extends Model
{
    protected $fillable = [
        'reference_number',
        'sold_at',
        'total_amount',
        'notes',
    ];

    protected $casts = [
        'sold_at' => 'date',
        'total_amount' => 'decimal:2',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    public function returns(): HasMany
{
    return $this->hasMany(SaleReturn::class);
}
}
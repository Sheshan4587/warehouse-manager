<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SaleReturnItem extends Model
{
    protected $table = 'return_items';

    protected $fillable = [
        'return_id',
        'product_id',
        'packs_returned',
        'reason',
        'sent_to_supplier',
    ];

    protected $casts = [
        'sent_to_supplier' => 'boolean',
    ];

    public function saleReturn(): BelongsTo
    {
        return $this->belongsTo(SaleReturn::class, 'return_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
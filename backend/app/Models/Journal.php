<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Journal extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'title',
        'content',
    ];

    /**
     * Get the user that owns the journal.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

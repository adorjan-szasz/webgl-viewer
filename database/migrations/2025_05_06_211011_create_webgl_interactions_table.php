<?php

use App\Enums\WebGLEventType;
use App\Models\WebGLInteraction;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create(WebGLInteraction::class, function (Blueprint $table) {
            $table->id();

            $table->enum('event_type', WebGLEventType::values());
            $table->json('event_data')->nullable(); // angle, zoom level, etc.

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('webgl_interactions');
    }
};

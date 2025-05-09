<?php

use App\Enums\ModelType;
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
        Schema::create('model3_d_s', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->enum('type', ModelType::values());
            $table->json('files');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('model3_d_s');
    }
};

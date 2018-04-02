<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddLastvisitToConnections extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('connections', function($table) {
			$table->timestamp('lastvisit1')->nullable();
			$table->timestamp('lastvisit2')->nullable();
			$table->boolean('read1')->nullable();
			$table->boolean('read2')->nullable();
		});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('connections', function($table) {
			$table->dropColumn('lastvisit1');
			$table->dropColumn('lastvisit2');
			$table->dropColumn('read1');
			$table->dropColumn('read2');
		});
    }
}

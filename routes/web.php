<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//$namespace = '\Unisharp\Laravelfilemanager\controllers';

Route::get('/login', [
	'uses' => 'UserController@getLoginPage',
	'as' => 'login' 
]);

Route::get('/', [
	'uses' => 'UserController@getHomePage',
	'as' => 'home' 
]);

Route::get('/reader', function () {
    return view('reader');
})->name('reader');



Route::get('/contacts', [
	'as'=> 'contacts',
	'uses' => 'MessageController@getShowConnections',
	'middleware' => 'auth'
]);
Route::get('/messages/', [
	'as'=> 'messages',
	'uses' => 'MessageController@getShowMessages',
	'middleware' => 'auth'
]);
Route::post('/message_create', [
	'as'=> 'message_create',
	'uses' => 'MessageController@postCreateMessage',
	'middleware' => 'auth'
]);
Route::get('/message_delete/{post_id}', [
	'as'=> 'message_delete',
	'uses' => 'MessageController@getDeleteMessage',
	'middleware' => 'auth'
]);
Route::get('/message_delete_all', [
	'as'=> 'message_delete_all',
	'uses' => 'MessageController@getDeleteAllMessages',
	'middleware' => 'auth'
]);
Route::post('/connection_add', [
	'as'=> 'connection_add',
	'uses' => 'MessageController@postAddConnection',
	'middleware' => 'auth'
]);
Route::post('/connection_remove', [
	'as'=> 'connection_remove',
	'uses' => 'MessageController@getDeleteConnection',
	'middleware' => 'auth'
]);
Route::post('/save_draft', [
	'as'=> 'save_draft',
	'uses' => 'MessageController@postSaveDraft',
	'middleware' => 'auth'
]);


 

Route::post('/signup', [
	'uses' => 'UserController@postSignUp',
	'as' => 'signup'
]);
Route::get('/delete_user', [
	'uses' => 'UserController@getDeleteUser',
	'as' => 'delete_user'
]);
Route::post('/signin', [
	'uses' => 'UserController@postSignIn',
	'as' => 'signin'
]);
Route::get('/logout', [
	'uses' => 'UserController@getLogout',
	'as' => 'logout'
]);

	
// unisharp --------------------------------------------------------------

Route::get('/jsonitems', [
	'uses' => 'LfmExtendController@getItems',
	//'as' => 'getItems',
	'as' => 'jsonitems',
]);

Route::any('/create_init', [
	'uses' => 'LfmExtendController@checkMissingFiles',
	'as' => 'create_init',
]);
Route::any('/delete_dir', [
	'uses' => 'LfmExtendController@deleteDir',
	'as' => 'delete_dir',
]);

Route::any('/create', [
	'uses' => 'LfmExtendController@create',
	'as' => 'create',
]);
Route::any('/update', [
	'uses' => 'LfmExtendController@update',
	'as' => 'update',
]);
Route::any('/rename', [
	'uses' => 'LfmExtendController@rename',
	'as' => 'rename',
]);
Route::any('/copyitem', [
	'uses' => 'LfmExtendController@copyItem',
	'as' => 'copyitem',
]);
Route::get('/reader', function () {
    return view('reader');
})->name('reader');



<?php
namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
class PageController extends Controller
{
	public function getTest(Request $request) 
	{	
		echo 'TEST - REQUEST';
		return ' _ TTEESSTT';
		//return view('.test');
		/*
		$email = $request['email'];
		$first_name = $request['first_name'];
		$password = bcrypt($request['password']);
		
		$user = new User();
		$user->email = $email;
		$user->first_name = $first_name;
		$user->password = $password;
		
		$user-> save();
		return redirect()->back();
		*/ 
	}
	
	public function postSignIn(Request $request)
	{
		
	}
	
}



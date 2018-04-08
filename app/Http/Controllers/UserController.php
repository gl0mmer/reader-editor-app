<?php
namespace App\Http\Controllers;

use App\User;
use App\Message;
use App\Connection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class UserController extends Controller
{
	protected $errors;
    protected $msg;
    protected $log;

	
    public function __construct()
    {
        $this->errors = [];
        $this->msg = [];
        $this->log = [];
    }

	
	// Start here
	public function getHomePage()
	{
		if (!Auth::user()){
			$this -> getLogout();
			//$msg = \Request::ip();
		}
		return view('index', $this->response() );
	}
	
	public function getLoginPage()
	{
		return redirect()->route('home') ->with(['msg'=>'empty']);
	}
	
	
	public function response() 
	{
		$id = Auth::user()->id;
		$user = User::where('id', $id);
		$unread = $user -> value('read');
		if (gettype($unread)!='integer'){ $unread=0; }
		return ['errors'  => $this->errors, 
		        'msg'     => $this->msg, 
		        'log'     => $this->log,
		        'userid'  => $id, 
		        'username'=> $user -> value('first_name'),
		        'unread'  => $unread,
		        'in_contacts'=> false, 
				'in_messages'=> false, 
		       ];
	}
	
	
	public function postSignUp() 
	{	
		$email    = request()->email;
		$username = request()->first_name;
		$password = request()->password;
		
		array_push($this->log, 'SignUp:');
		if ( User::where('first_name', $username)->exists() ){
			array_push($this->errors, 'alert_userexists');
		}else if( strlen($username)<4 || strlen($username)>20 ){
			array_push($this->errors, 'alert_username');
		}else if( strlen($password)<4 || strlen($password)>20 ){
			array_push($this->errors, 'alert_userpass');
		}else{
		
			$user = new User();
			$user->email = $email;
			$user->first_name = $username;
			$user->password = bcrypt($password);
			
			$user-> save();
			
			Auth::login($user);
			array_push($this->msg, 'alert_signup');
		}
		
		return $this->response();
	}
	
	
	public function postSignIn()
	{
		array_push($this->log, 'SignIn:');
		
		$name = request()->first_name;
		$pass = request()->password;
		
		if ( $name=='name' || strlen($name)<4 ){
			array_push($this->log, 'Wrong name');
		}else if (Auth::attempt(['first_name'=>$name, 'password'=>$pass] )){
			$name = User::where('id', Auth::user()->id)-> value('first_name');
			array_push($this->log, 'OK_'.$name);
			array_push($this->msg, 'alert_signin');
		}else{
			if (User::where('first_name', $name)->exists() ){
				array_push($this->errors, 'alert_wrongpass');
			}else{
				array_push($this->errors, 'alert_nouser');
			}
		}
		return $this->response();
	}
	
	public function getLogout()
	{
		Auth::logout();
		if (!Auth::attempt(['first_name'=>'guest', 'password'=>'guest']) ){
			array_push($this->log, 'Cannot log into Guest, try Test');
			Auth::attempt(['first_name'=>'test', 'password'=>'test']);
		}
		return $this->response();
	}
	
	public function getDeleteUser()
	{
		$username    = User::where('id', Auth::user()->id) -> value('first_name');
		if ($username=='guest'){
			array_push($this->log, 'Not allowed to delete Guest');
		}else{
			$user = User::find(Auth::user()->id);
			Auth::logout();
			$user->delete();
			array_push($this->msg, 'alert_rmcontact');
		}
		return $this->response();
	}
	
}



<?php
namespace App\Http\Controllers;

use App\User;
use App\Message;
use App\Connection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class MessageController extends Controller
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
	
	public function postCreateMessage(Request $request)
	{
		array_push($this->log, 'Send:');
		
		$id_to = request()->id_to;
		$message = request()->message;
		array_push($this->log, $message);
		array_push($this->log, $id_to);
		
		if (strlen($message)==0){ 
			array_push($this->log, 'empty');
		}else if (strlen($message)>1000){ 
			array_push($this->error, 'alert_message');
		}else if ($id_to<0){
			array_push($this->error, 'error');
		}else{
			array_push($this->log, 'Save: '.$message);
			
			$post = new Message();
			$post->message = $message;
			$post->user_id_to = $id_to;
			$post->sent = 0;
			
			if ( $request->user()->message()->save($post) ){
				$msg = 'Succeess!';
				$this->setDraft($id_to, '');
				$this->setConnectionUnread(True, $id_to);
				$this->setUserUnread($id_to);
				
			}	
		}
		return $this->getShowMessages($id_to);		
		
	}
	
	private function Draft($id_2){
		$id_1 = Auth::user()->id;
		$post = Connection::where([ ['user_id_1', $id_1 ], ['user_id_2', $id_2] ]) 
					   -> orWhere([ ['user_id_2', $id_1 ], ['user_id_1', $id_2] ]) ->first();
		
		if ($id_1 == $post->user_id_1){
			$draft = $post->draft;
		}else{
			$draft = $post->draft2;
		}
		return ($draft);
	}
	private function setDraft($id_2, $draft){
		$id_1 = Auth::user()->id;
		$post = Connection::where([ ['user_id_1', $id_1 ], ['user_id_2', $id_2] ]) 
					   -> orWhere([ ['user_id_2', $id_1 ], ['user_id_1', $id_2] ]) ->first();
		
		if ($id_1 == $post->user_id_1){
			$post->draft = $draft;
		}else{
			$post->draft2 = $draft;
		}
		$post->save();
		
	}
	
	public function postSaveDraft(){
		array_push($this->log, 'SaveDraft');
		
		$id_to = request()->id_to;
		$draft = request()->draft;
		if (strlen($draft)>1000){ 
			array_push($this->error, 'alert_message');
		}else if ($id_to<0){
			array_push($this->error, 'error');
		}else{
			array_push($this->log, 'Save: '.$draft);
			$this->setDraft($id_to, $draft);
		}
		return $this->getShowMessages($id_to);		
	}
	
	public function postAddConnection()
	{
		$name = request()->addcontact_name;
		array_push($this->log, 'AddContact:');
		array_push($this->log, $name);
		
		$user = User::where('first_name', '=', $name)->first();
		if ($user != null) {
		
			array_push($this->log, 'exists');
			$id_1 = Auth::user()->id;
			$id_2 = User::where('first_name', $name)->value('id');
			
			if (Connection::where([ ['user_id_1',$id_1], ['user_id_2',$id_2] ]) -> orWhere([ ['user_id_1',$id_2], ['user_id_2',$id_1] ]) ->exists()  ){
				array_push($this->log, 'alert_contactexists');
			}else{
				$item = new Connection();
				$item->user_id_1 = Auth::user()->id;
				$item->user_id_2 = $id_2;
				$item->draft = '';
				$item->draft2 = '';
				$item->save();
				
				array_push($this->log, 'Added');
			}
			
		}else{
			array_push($this->error, 'alert_nouser');
		}
		 
		return $this->getShowConnections();
	}
	
	public function getDeleteConnection()
	{
		array_push($this->log, 'DeleteContact:');
		$msg = 'Error';
		$id = Auth::user()->id;
		$name = request()->rmcontact_name;
		if ( User::where('first_name', $name)->exists() ){ 
			
			$id2 = User::where('first_name', $name)->value('id');
			if (Connection::where([ ['user_id_1',$id], ['user_id_2',$id2] ]) ){
				$connection = Connection::where([ ['user_id_1',$id], ['user_id_2',$id2] ]) ->first();
				if ($connection){
					$connection -> delete();
					$msg = 'Contact was removed.';
				}
			}else if( Connection::where([ ['user_id_1',$id2], ['user_id_2',$id] ]) ){
				$connection = Connection::where([ ['user_id_1',$id2], ['user_id_2',$id] ]) ->first();
				if ($connection){
					$connection -> delete();
					$msg = 'Contact was removed.';
				}
			}
			$posts = Message::where([ ['user_id', $id2 ],['user_id_to',$id] ]) -> orWhere([ ['user_id_to', $id2], ['user_id',$id] ]) -> get();
			foreach ($posts as $post){ $post->delete(); }
		
		}else{
			$msg = 'Error: contact does not exists';
		}
		
		return $this->getShowConnections();
	}
	
	public function connectionArray($user_id)
	{
		$res = array();
		$names = array();
		$unreads = array();
		$msg = '';
		
		$items_1 = Connection::where('user_id_1', $user_id)->get();
		$items_2 = Connection::where('user_id_2', $user_id)->get();
		$items = array();
		foreach ($items_1 as $item){ array_push($items,$item); }
		foreach ($items_2 as $item){ array_push($items,$item); }
		
		if (count($items_1)+count($items_2)>0){
			$i=0;
			foreach ($items as $item){
				
				if ($i<count($items_1)){ $id = $item->user_id_2; $unread = $item -> read1; }
				else                   { $id = $item->user_id_1; $unread = $item -> read2; }
				
				if (User::where('id',$id)->first()){                     // check if user exists
					$name   = User::where('id',$id)->value('first_name');
					array_push($res, $id);
					array_push($names, $name);
					$msg = $msg.', '.$id;
					
					if ($unread==FALSE){$unread=0; }
					else               {$unread=1; }
					array_push($unreads, $unread);
				}
				$i =$i+1;
			}
		}
		
		return [$res, $names, $unreads, $msg];
	}
	
	
	public function getShowConnections()
	{
		array_push($this->log, 'ShowContacts:');
		if (!Auth::user()){
			return redirect()->route('home');
		}
		$user_id = Auth::user()->id;
		list( $res, $names, $unreads, $msg ) = $this->connectionArray($user_id);
		
		$unread   = User::where('id', $user_id) -> value('read');
		if (gettype($unread)!='integer'){ $unread=0; }
		
		return [
		//return view('index', [
						'in_contacts' => true, 
						'in_messages' => false, 
						'names'       => $names, 
						'connections' => $res, 
						'create'      => 'no', 
						'username'    => User::where('id', Auth::user() ->id) -> value('first_name'),
						'unread'      => $unread, 
						'unreads'     => $unreads, 
						'errors'=>$this->errors, 'msg'=>$this->msg, 'log'=>$this->log
			//]) -> with(['msg'=>$msg]);
			];
		
	}
	
	public function getShowMessages($id_to=null){
		if ($id_to==null){	$id_to = request()->contact_id; }
		array_push($this->log, 'ShowMessages:');
		if (!Auth::user()){
			return redirect()->route('home');
		}
		$msg = '';
		$id_from = Auth::user()->id;
		$username    = User::where('id', $id_from) -> value('first_name');
		$contactname = User::where('id', $id_to)   -> value('first_name');
		
		$posts = Message::where([ ['user_id', $id_from ],['user_id_to',$id_to] ]) -> orWhere([ ['user_id_to', $id_from], ['user_id',$id_to] ]) -> get();
		
		$this->setConnectionUnread(False, $id_to);
		$unread = $this->setUserUnread($id_from);
		$draft = $this->Draft($id_to);
		return [
						'in_contacts' => false, 
						'in_messages' => true, 
						'id_to'       => $id_to, 
						'posts'       => $posts, 
						'create'      => 'no', 
						'username'    => $username, 
						'contactname' => $contactname, 
						'draft'       => $draft,
						'unread'      => $unread, 
						'unreads'     => '', 
						'errors'=>$this->errors, 'msg'=>$this->msg, 'log'=>$this->log 
			];
		return ['errors'=>$this->errors, 'msg'=>$this->msg, 'log'=>$this->log ];
		
	}
	
	public function setConnectionUnread($value, $id_to){
		$msg = 'ERROR';
		$id_from = Auth::user()->id;
		$c1 = Connection::where([ ['user_id_1', $id_from ], ['user_id_2', $id_to] ]) ->first();
		$c2 = Connection::where([ ['user_id_1', $id_to],    ['user_id_2', $id_from] ]) ->first();
		if ($value==TRUE){
			if     ( $c1 ){ $c1->read2 = True; $c1->save(); $msg=' |true_c1| '; }
			else if( $c2 ){ $c2->read1 = True; $c2->save(); $msg=' |true_c2| '; }
		}else if ($value==FALSE){
			if     ( $c1 ){ $c1->read1 = False; $c1->save(); $msg=' |false_c1| '; }
			else if( $c2 ){ $c2->read2 = False; $c2->save(); $msg=' |false_c2| '; }
		}
		return ($msg);
	
	}	
	public function setUserUnread($id){
		$unread = array_sum( $this->connectionArray($id)[2] );
		$user = User::where('id', $id) -> first();
		$user->read = $unread;
		$user->save();
		return $user->read;
	}
	
	//-- unused ----------------------------------------------------------
	public function getDeleteMessage($post_id)
	{
		$post = Message::where('id', $post_id)->first();
		$post->delete();
		$msg = 'Succeessfully deleted.';
		return redirect()->back() ->with(['msg'=>$msg]);
	}
	
	public function getDeleteAllMessages()
	{
		$msg = '';
		$user_id = Auth::user()->id;
		$posts = Message::where('user_id', $user_id)->get();
		foreach ($posts as $post){
			$post->delete();
		}
		$msg = count($posts);
		return redirect()->back()->with(['msg'=>$msg]);
	}
	

	
}



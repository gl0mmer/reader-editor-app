<?php
namespace App\Http\Controllers;

use App\User;
use App\Message;
use App\Connection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
//use vendor\laravel\framework\src\Illuminate\Http\Request;
class MessageController extends Controller
{
	
	public function postCreateMessage(Request $request)
	{
		
		$this->validate($request, [
			'message' => 'required|max:1000',
		]);
		$msg = 'There was an error';
		
		if ($request['id_to']<0){
			$msg = 'Wrong user_to id!';
		}else{
			$post = new Message();
			$post->message = $request['message'];
			$post->user_id_to = $request['id_to'];
			$post->sent = 0;
			
			if ( $request->user()->message()->save($post) ){
				$msg = 'Succeess!';
				$this->setDraft($request['id_to'], '');
			}
		}
		
		return redirect()->back() -> with(['msg'=>$msg]);
		
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
	
	public function postSaveDraft(Request $request){
		$this->validate($request, [
			'draft' => 'required|max:1000',
		]);
		$msg = 'There was an error';
		
		if ($request['id_to']<0){
			$msg = 'Wrong user_to id!';
		}else{
			$this->setDraft($request['id_to'], $request['draft']);
		}
		
		$msg = $request['draft'].' | '.$this->Draft($request['id_to']);
		return redirect()->back() ->with(['msg'=>$msg]);
		
	}
	
	public function getDeleteMessage($post_id)
	{
		$post = Message::where('id', $post_id)->first();
		//if (Auth::user() != $post->user){}
		$post->delete();
		$msg = 'Succeessfully deleted.';
		return redirect()->back();
	}
	
	public function getDeleteAllMessages()
	{
		$user_id = Auth::user()->id;
		$posts = Message::where('user_id', $user_id)->get();
		foreach ($posts as $post){
			$post->delete();
		}
		$msg = count($posts);
		return redirect()->back();
		
	}
	
	public function postAddConnection(Request $request)
	{
		$this->validate($request, [
			'addcontact_name' => 'required|min:4'
		]);
		$name = $request['addcontact_name'];
		
		$msg = 'Connection failed ';
		if ( User::where('first_name', $name)->exists() ){
		
			$id_1 = Auth::user()->id;
			$id_2 = User::where('first_name', $name)->value('id');
			
			if (Connection::where([ ['user_id_1',$id_1], ['user_id_2',$id_2] ]) -> orWhere([ ['user_id_1',$id_2], ['user_id_2',$id_1] ]) ->exists()  ){
				$msg = 'Connection exists';
			}else{
				$item = new Connection();
				$item->user_id_1 = Auth::user()->id;
				$item->user_id_2 = $id_2;
				$item->draft = '';
				$item->draft2 = '';
				$item->save();
				
				$msg = 'Successfully added: '.$name;
			}
		
		}else{
			$msg = 'Error: User does not exist';
		}
		return redirect()->back()-> with(['msg'=>$msg]);
	}
	
	public function getDeleteConnection(Request $request)
	{
		$msg = 'Error';
		$id = Auth::user()->id;
		$name = $request['rmcontact_name'];
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
			//$posts = Message::where([ ['user_id', $id2 ],['user_id_to',$id] ]) -> orWhere([ ['user_id_to', $id2], ['user_id',$id] ]) -> get();
			//foreach ($posts as $post){ $post->delete(); }
		
		}else{
			$msg = 'Error: contact does not exists';
		}
		
		return redirect()->back() ->with(['msg'=>$msg]);
	}
	
	public function getShowConnections()
	{
		if (!Auth::user()){
			return redirect()->route('home');
		}
		$res = array();
		$names = array();
		$user_id = Auth::user()->id;
		$msg = 'MSG Connections: ';
		
		$items_1 = Connection::where('user_id_1', $user_id)->get();
		$items_2 = Connection::where('user_id_2', $user_id)->get();
		if (count($items_1)+count($items_2)>0){
			foreach ($items_1 as $item){
				$id = $item->user_id_2;
				$name = User::where('id',$id)->value('first_name');
				array_push($res, $id);
				array_push($names, $name);
				$msg = $msg.', '.$id;
			}
			foreach ($items_2 as $item){
				$id = $item->user_id_1;
				$name = User::where('id',$id)->value('first_name');
				array_push($res, $id);
				array_push($names, $name);
				$msg = $msg.', '.$id;
			}
		}
		
		$username = User::where('id', $user_id) -> value('first_name');
		return view('index', [
						'in_contacts' => true, 
						'in_messages' => false, 
						'names'       => $names, 
						'connections' => $res, 
						'create'      => 'no', 
						'username'    => $username, 
			]) -> with(['msg'=>$msg]);
		
	}
	
	public function getShowMessages($id){
		if (!Auth::user()){
			return redirect()->route('home');
		}
		$msg = '';
		$id1 = Auth::user()->id;
		$username    = User::where('id', $id1) -> value('first_name');
		$contactname = User::where('id', $id) -> value('first_name');
		
		$posts = Message::where([ ['user_id', $id1 ],['user_id_to',$id] ]) -> orWhere([ ['user_id_to', $id1], ['user_id',$id] ]) -> get();
		
		$draft = $this->Draft($id);
		return view('index', [
						'in_contacts' => false, 
						'in_messages' => true, 
						'id_to'       => $id, 
						'posts'       => $posts, 
						'create'      => 'no', 
						'username'    => $username, 
						'contactname' => $contactname, 
						'draft'       => $draft 
			]) -> with(['msg'=>$msg]);
		
	}
	
		
	
}



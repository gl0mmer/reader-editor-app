<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Unisharp\Laravelfilemanager\Events\ImageIsUploading;
use Unisharp\Laravelfilemanager\Events\ImageWasUploaded;

use Unisharp\Laravelfilemanager\controllers\LfmController as LfmController;
/**
 * Class CreateController.
 */
class LfmExtendController extends LfmController
{
    protected $errors;

	
    public function __construct()
    {
        parent::__construct();
        $this->errors = [];
    }

	//-- Override ItemsController@getItems -------------------------------
	public function getItems()
    {
		$msg = 'getItems() ';    
		$homedir = parent::getFileUrl($image_name = null, $is_thumb = null);
		$path0 = parent::getRootFolderPath('user');
        $path = parent::getCurrentPath().$_GET['path']; 
        $sort_type = 'alphabetic';
		
		$directories = parent::sortFilesAndDirectories(parent::getDirectories($path), $sort_type);
        //$files = parent::sortFilesAndDirectories(parent::getFilesWithInfo($path), $sort_type);   // !!!!!
        $files = File::files($path);                                     // !!!!!
        
        $fnames_arr = array();
        foreach($files as $f){ 
			$fname = (string)$f;
			$fname = substr($fname, strrpos($fname,'/')+1);
			array_push($fnames_arr, $fname);
		}
		sort($fnames_arr);
        
        //$paths_arr = array('..');
        $types_arr = array('folder');
        $names_arr = array('..');
        foreach($directories as $f){ 
			array_push($types_arr, 'folder');
			array_push($names_arr, $f->name);
		}
        foreach($fnames_arr as $f){ 
			array_push($types_arr, 'file');
			array_push($names_arr, $f);
		}
        
           
        return [ 'html' =>$msg,
                'entries'   => $names_arr,
                'entrytype' => $types_arr,
                //'paths' => $paths_arr,
            'working_dir' => parent::getInternalPath($path),
            'path' => $path0,
            'homedir' => $homedir,
        ];
    }
    
    //-- Extend ----------------------------------------------------------
    
    
    public function checkMissingFiles()
	{
		$path = parent::getCurrentPath("");
        $new_path = $path.'/Welcome.txt';
        $msg = '';
        
        $old_path = substr($path, 0,strrpos($path,'/'));
        $old_path = $old_path.'/shares/Welcome.txt';
        $msg = $msg.$old_path;
        if (!File::copy($old_path, $new_path)) {
			$msg = $msg.' Error ';
		}
		
		//$path = parent::getCurrentPath('mail');
		//parent::createFolderByPath($path);
		//$msg = $msg.' | '.$path.' Created ';
		
		$path = parent::getCurrentPath('trash');
		if (!File::exists($path)) {
			parent::createFolderByPath($path);
			$msg = $msg.' | '.$path.' Created ';
		}
        //return $msg;  
        return redirect()->back() ->with(['msg'=>$msg]);
	} 
    
    
    public function create()
    {
		$msg = 'Create: ';
        $filename = request()->file_name;
        //$filename = request('file_name');
        $filetext = request()->file_text;
        $filename = $filename.'.txt';
        $new_file_path = parent::getCurrentPath($filename);

        // single file
        $msg = $msg.$filename.' | '.$new_file_path;
		//return $msg;
	
		if(!File::exists($new_file_path)) {
			// path does not exist

			if (!$this->proceedSingleUpload($new_file_path, $filetext)) {
				return $this->errors;
			}
			return redirect()->back() ->with(['msg'=>$msg]);
		}else{
			return redirect()->back() ->with(['msg'=>$msg]);
		}
        
		//return redirect()->back();
         
    }
    
    public function update()
    {
        $filename = request()->file_name;
        $filetext = request()->file_text;
        $new_file_path = parent::getCurrentPath($filename);

		$this->proceedSingleUpload($new_file_path, $filetext);
		//if (!$this->proceedSingleUpload($new_file_path, $filetext)) {
		//	return $this->errors;
		//}
		$msg = '';
		foreach ($this->errors as $err){
			$msg = $msg. $err;
		}
		return redirect()->back()-> with(['msg'=>$msg]);

    }
    
    public function copyItem()
    {
		$msg = 'copy';
        $dir = request()->past_dir;
        //$dir = request('past_dir');
        //$dir = $request['past_dir'];
        $filename = request()->copy_shortpath;
        //$filename = request('copy_shortpath');
        //$filename = $request['copy_shortpath'];
        
        $path = parent::getCurrentPath("");
        $old_path = $path.'/'.$filename;
        
        $msg = $msg.' MISC '.request()->copy_shortpath.'  ';
        if ( request()->copy_misc=='sync' ){
			$guest_id = User::where('first_name','guest')->first()->id;
			$msg = $msg.' ID '.$guest_id.'  ';
			$new_path = substr($path,0,strrpos($path,'/')).'/'.$guest_id.'/'.$filename;
		}else{
			$filename = $dir.substr($filename, strrpos($filename,'/'));
			$new_path = $path.'/'.$filename;
		}
        
        $path = parent::getCurrentPath("");
		
		$path = $path.'/'.request()->copy_shortpath;
		$msg = $msg.' OLD: '.$path.' - '.$new_path. ' || ';
		//return $msg;
		if (is_dir($path)){
			$ending = '';
			$i = strlen($new_path);
			$old_path = $path;
		}else{
			$i = strrpos($new_path,'.');
			$ending = substr($new_path, $i);
		}
		$k=1;
		$path_final = $new_path;
		while (File::exists($path_final)){
			$path_final = substr($new_path, 0, $i).'('.$k.')'.$ending;
			$k+=1;
		}
		$new_path = $path_final;
		//$msg = $msg.' DIR: '.$dir.' | '.$new_path.' | '.$old_path.' | '.$filename.' | ';
		//return $msg;
		if(!File::exists($new_path)) {
			if (is_dir($old_path)){
				//return $msg.' Folder';
				if (!File::copyDirectory($old_path, $new_path)) {
					$msg = $msg.' Copy Folder Error ';
				}
			}else{
				//return $msg.' Copy File';
				if (!File::copy($old_path, $new_path)) {
					$msg = $msg.' Copy File Error ';
				}
			}
		}
        //return $msg;
		return redirect()->back() ->with(['msg'=>$msg]);     
    }
    
    public function deleteDir()
    {
		$msg = 'delete';
		
		$filename = request()->deletedir_text;
		$path = parent::getCurrentPath("");
        //$old_path = $path.'/'.$filename;
        
        if ( request()->delete_misc=='sync' ){
			$guest_id = User::where('first_name','guest')->first()->id;
			$msg = $msg.' ID '.$guest_id.' || ';
			$new_path = substr($path,0,strrpos($path,'/')).'/'.$guest_id.'/'.$filename;
		}else{
			$new_path = parent::getCurrentPath($filename);
		}
        
        if (is_dir($new_path)){
			$msg = $msg.' IsDir '.$this-> rrmdir($new_path);
        }else{
			$msg = $msg.' IsFile ';
			unlink($new_path); 
		}
        //$msg = $msg.$new_path;
        return redirect()->back() ->with(['msg'=>$msg]);
	}

    private function proceedSingleUpload($new_file_path, $content)
    {
        event(new ImageIsUploading($new_file_path));
        try {
  
			File::put($new_file_path, $content);
            
            chmod($new_file_path, config('lfm.create_file_mode', 0644));
        } catch (\Exception $e) {
            array_push($this->errors, parent::error('invalid'));
            return false;
        }

        event(new ImageWasUploaded(realpath($new_file_path)));

        return true;
    }
    

    private function getNewName($filename)
    {
		$new_filename = preg_replace('/[^A-Za-z0-9\-\']/', '_', $filename);
		return $new_filename.'.txt';
    }
	
    private function rrmdir($dir) 
    {
		$msg = '';
		//$msg = 'rrmdir: '.$dir;
		
	     $objects = scandir($dir); 
	     foreach ($objects as $object) { 
	       if ($object != "." && $object != "..") {
			   //$msg = $msg.' - '.$object; 
			   if (is_dir($dir."/".$object))
					$this->rrmdir($dir."/".$object);
			   else
	                unlink($dir."/".$object); 
	       } 
	     }
	     rmdir($dir); 
	   
		return $msg;
	}

}

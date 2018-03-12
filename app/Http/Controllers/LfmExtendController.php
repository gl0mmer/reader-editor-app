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
		
		$path = parent::getCurrentPath('trash');
		if (!File::exists($path)) {
			if (!parent::createFolderByPath($path)){
				$msg = $msg.' Error ';
			}else{ 
				$msg = $msg.' | '.$path.' Created ';
			}
		}
        return redirect()->route('home') ->with(['msg'=>$msg]);
	} 
    
    
    public function create()
    {
		$msg = 'Create: ';
        $filename = request()->file_name;
        $filename = $this->getCleanName($filename).'.txt';
        $filetext = request()->file_text;
        $new_file_path = parent::getCurrentPath($filename);

        // single file
        $msg = $msg.$filename.' | '.$new_file_path;
	
		if(!File::exists($new_file_path)) {
			if (!$this->proceedSingleUpload($new_file_path, $filetext)) {
				//return $this->errors;
				$msg = $msg.' Error ';
			}
		}
        return redirect()->back() ->with(['msg'=>$msg]);
		//return redirect()->back();
         
    }
    
    public function update()
    {
        $filename = request()->file_name;
        $filetext = request()->file_text;
        $new_file_path = parent::getCurrentPath($filename);

		if (!$this->proceedSingleUpload($new_file_path, $filetext)) {
			//return $this->errors;
			$msg = $msg.' Error ';
		}
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
        $filename = request()->copy_shortpath;
        
        $path = parent::getCurrentPath("");
        $old_path = $path.'/'.$filename;
        
        if ( request()->copy_misc=='sync' ){
			$guest_id = User::where('first_name','guest')->first()->id;
			$new_path = substr($path,0,strrpos($path,'/')).'/'.$guest_id.'/'.$filename;
		}else{
			$filename = $dir.substr($filename, strrpos($filename,'/'));
			$new_path = $path.'/'.$filename;
		}
        
		$path = $path.'/'.request()->copy_shortpath;		
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
		
		if(!File::exists($new_path)) {
			if (is_dir($old_path)){
				if (!File::copyDirectory($old_path, $new_path)) {
					$msg = $msg.' Copy Folder Error ';
				}
			}else{
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
		
		$filename = request()->delete_name;
		$path = parent::getCurrentPath("");
        
        if ( request()->delete_misc=='sync' ){
			$guest_id = User::where('first_name','guest')->first()->id;
			$new_path = substr($path,0,strrpos($path,'/')).'/'.$guest_id.'/'.$filename;
		}else{
			$new_path = parent::getCurrentPath($filename);
		}
        
        if (is_dir($new_path)){
			$this-> rrmdir($new_path);
        }else{
			unlink($new_path); 
		}
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
    

    private function getCleanName($filename)
    {
		$new_filename = preg_replace('/[^A-Za-z0-9\-\']/', '', $filename);
		if ($new_filename==''){ $new_filename='0001'; }
		return $new_filename;
    }
	
    private function rrmdir($dir) 
    {
		$msg = '';
		
	     $objects = scandir($dir); 
	     foreach ($objects as $object) { 
	       if ($object != "." && $object != "..") {
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

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

class LfmExtendController extends LfmController
{
    protected $errors;
    protected $msg;
    protected $log;

	
    public function __construct()
    {
        parent::__construct();
        $this->errors = [];
        $this->msg = [];
        $this->log = [];
    }

	//-- Override ItemsController@getItems -------------------------------
	public function getItems()
    {
		array_push($this->log, 'GetItems:|'.request()->path.'|');
		$path0 = parent::getRootFolderPath('user');
		array_push($this->log, 'Path:|'.$path0);
		if (!File::exists($path0)){
			array_push($this->log, 'Path does not exist');
			if (mkdir($path0, 0755)){ 
				array_push($this->log, 'Path was created'); 
				$this->checkMissingFiles();	
			}else{ array_push($this->log, 'Error creating user dir'); }
		}
		
		$homedir = parent::getFileUrl($image_name = null, $is_thumb = null);
		$path0 = parent::getRootFolderPath('user');
        $path = parent::getCurrentPath().request()->path; 
        $sort_type = 'alphabetic';
		
		$directories = parent::sortFilesAndDirectories(parent::getDirectories($path), $sort_type);
        //$files = parent::sortFilesAndDirectories(parent::getFilesWithInfo($path), $sort_type);   // !!Error was there
        $files = File::files($path);                                     // !!!!!
        
        $fnames_arr = array();
        foreach($files as $f){ 
			$fname = (string)$f;
			$fname = substr($fname, strrpos($fname,'/')+1);
			array_push($fnames_arr, $fname);
		}
		sort($fnames_arr);
        
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
        
        return ['entries'    => $names_arr,
                'entrytype'  => $types_arr,
                'working_dir'=> parent::getInternalPath($path),
                'path'       => $path0,
                'homedir'    => $homedir,
                'errors'=>$this->errors, 'msg'=>$this->msg, 'log'=>$this->log
        ];
    }
    
    //-- Extend ----------------------------------------------------------
    
    
    public function checkMissingFiles()
	{
		array_push($this->log, 'CreateInit');
		$path = parent::getCurrentPath("");
        $new_path = $path.'/Welcome.txt';
        
        $old_path = substr($path, 0,strrpos($path,'/'));
        $old_path = $old_path.'/shares/Welcome.txt';
        
        if (!File::copy($old_path, $new_path)) {
			array_push($this->log, 'not_copied');
		}
		
		$path = parent::getCurrentPath('trash');
		if (!File::exists($path)) {
			if (!parent::createFolderByPath($path)){
				array_push($this->errors, 'Cannot create trash');	
			}
		}
		return $this->getItems();
	} 
    
    
    public function create()
    {
		$type = request()->create_type;
		array_push($this->log, 'Create '.$type.':');
		$filename = request()->file_name;
		if ($type=='file'){ $filename = $filename.'.txt'; }
		
        $filetext = request()->file_text;
        $new_file_path = parent::getCurrentPath($filename);

		if(!File::exists($new_file_path)) {
			if ($type=='folder'){
				array_push($this->log, $new_file_path);
				if (mkdir($new_file_path, 0755)){ array_push($this->msg, 'alert_newfolder'); }
				else{ array_push($this->errors, 'Cannot create folder'); }
			}else if ($type=='file'){
				if ($this->proceedSingleUpload($new_file_path, $filetext)) {
					array_push($this->msg, 'alert_newtxt');
				}else{ array_push($this->errors, 'Cannot create file'); }
			}
		}else{ array_push($this->errors, 'exists'); }
		return $this->getItems();
    }
    
    public function update()
    {
		array_push($this->log, 'Update:');
        $filename = request()->file_name;
        $filetext = request()->file_text;
        $new_file_path = parent::getCurrentPath($filename);
        $this->checkSpace($new_file_path);
		array_push($this->log, $new_file_path);
		if (!$this->proceedSingleUpload($new_file_path, $filetext)) {
			array_push($this->errors, 'ErrorUpdate');
		}
		return $this->getItems();
    }
    public function rename()
    {
		array_push($this->log, 'Rename:');
        $old_name = request()->old_name;
        $new_name = request()->new_name;
        $path = parent::getCurrentPath("").request()->subdir.'/';
        
        if (!is_dir($path.$old_name)){
			$i = strrpos($old_name,'.');
			$new_name = $new_name.substr($old_name, $i);
		}
        
        array_push($this->log, $path.$old_name);
        array_push($this->log, $path.$new_name);
        if (rename($path.$old_name, $path.$new_name)){ 
			array_push($this->msg, 'alert_wasrenamed');
		}else{ array_push($this->errors, 'Error Rename'); }
        
		return $this->getItems();
    }
    
    public function copyItem()
    {
		array_push($this->log, 'Copy:');
        $dir = request()->past_dir;
        $filename = request()->copy_shortpath;
        
        $path = parent::getCurrentPath("");
        $old_path = $path.'/'.$filename;
        if (request()->to_trash!='yes'){
			$res = $this->checkSpace($old_path);
			if ($res==false){ 
				return ['errors'=>$this->errors, 'msg'=>$this->msg, 'log'=>$this->log ];
			}
		}
        
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
				if (File::copyDirectory($old_path, $new_path)) { 
					if (request()->to_trash!='yes'){ array_push($this->msg, 'alert_waspasted'); }
				}else{  array_push($this->errors, 'Copy Folder Error'); }
				
			}else{
				if (File::copy($old_path, $new_path)) { 
					if (request()->to_trash!='yes'){ array_push($this->msg, 'alert_waspasted'); }
				}else { array_push($this->errors, 'Copy File Error'); }
			}
		}
		return $this->getItems();
    }
    
    public function deleteDir()
    {
		array_push($this->log, 'Delete:');
		
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
		array_push($this->msg, 'alert_wasdeleted'); 
		return $this->getItems();
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
	}
    
    
    public function folderSize($dir) 
    {
		$size = 0;
		$objects = scandir($dir); 
		foreach ($objects as $object) { 
			if ($object != "." && $object != "..") {
				if (is_dir($dir."/".$object)){
					$s = $this->folderSize($dir."/".$object);
					$size += $s;
				}else{
					$size += filesize($dir."/".$object);
				}
			} 
		}
		return $size;
	}
	
	public function checkSpace($path){
		$ok = true;
		$home = parent::getCurrentPath("");
        $obj = $path;
		
		$size1 = $this-> folderSize($home);
		if (is_dir($obj)){ $size2 = $this-> folderSize($obj); }
		else{ $size2 = filesize($obj); }
		
		$maxsize = 20;
        if ($size1+$size2>$maxsize*1000000){
			array_push($this->errors, 'error_nospace');
			array_push($this->log, 'Error: not enough space in user folder. Maximum size is '.$maxsize.' MB');
			$ok = false;
		}else{
			array_push($this->log, 'Size: '.$size1);
		}
		return $ok;
		
	}


}

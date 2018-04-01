console.log('--------------\n'+document.title);

//-- files variables ---------------------------------------------------------------

var files = {
	iter: 0,
	iter_prev: 0,
	zoom: 0,
	username: "",
	userpass: "",
	userremember: false,
	
	cookie_number: 6,
	cookie_suffix: "_f",
	name: "files",
	
	entries: [],
	paths: [],
	entrytype: [],
	dir: "",
	url: '',
	in_contacts: false,
	items_protected: ['..','trash'],
	php_errors: [],
	php_messages: [],
	
	get_fname: function(i){                                              //consolelog_func('brown');
		if (i===undefined) {i=this.iter;} 
		return files.entries[i];  
	},
	get_fid: function(i){                                                //consolelog_func('brown');
		if (i===undefined) {i=this.iter;} 
		return 'fileid_'+i.toString(); 
	}, 
	get_felem_pic: function(i){                                          //consolelog_func('brown');  !! Not used
		if (i===undefined) {i=this.iter;} 
		return document.getElementById(this.get_fid(i)+'_pic');
	},
	get_ftype: function(i){                                              //consolelog_func('brown');
		if (i===undefined) {i=this.iter;} 
		return files.entrytype[i];
	},
	get_enterpath: function(i){                                       
		var path = '';                                                   // for folders same as   files.dir+'/'+files.get_fname()
		if (this.entrytype[i]=='file'){
			path = this.url;
		}
		path += this.dir+'/'+this.entries[i];                            //console.log('this.dir: ',this.dir);
		return path;
	},
	get_savepath: function(i){
		if (i==0){ return ''; }
		
		var path = '';
		var dir = this.dir.substring(1);                                 //console.log('Savepath: ',dir);
		if (dir.indexOf('/')==-1){ dir = ''; }
		else{ dir = dir.substring(dir.indexOf('/')+1)+'/'; }             //console.log('Savepath: '+this.dir+' - '+dir+' - '+this.entries[i]);
		return dir+this.entries[i];
	},
	get_subdir: function(){
		var dir = this.dir.substring(1);                                 //console.log('Savepath: ',dir);
		if (dir.indexOf('/')==-1){ dir = ''; }
		else{ dir = dir.substring(dir.indexOf('/')+1)+'/'; }         //console.log('Savepath: ',dir, this.entries[i]);
		return dir;
	},
}                                                        

//-- start/update --------------------------------------------------------
function files_start(){                                                  consolelog_func('darkblue');  
	
	if (cookie_get('isset_files_')!='isset'){                            console.log('No cookie!!');                        
		cookie_set("isset_files_", "isset");
		common.cookie_save.call(files);
		common.cookie_save();
	}else { 
		common.cookie_load.call(files); 
		common.cookie_load();
	}                                                                    
	dict = reader_lang[common.langbase];                                 
	
	var inner_e = "";
	inner_e += "<div id='files_scroll' class='text_scroll' style='top:0vh;left:0vw;' align='left' > ";
	inner_e += "<div id='files_array' class='reader_text' style='top:2;left:0;visibility:hidden;height:20vh;'></div>";
	inner_e += "</div>";
	document.getElementById("content_box").innerHTML = inner_e;
	window.onbeforeunload = files_beforunload;
	window.onresize = function(){ files_resize(); };	                 
	
	if (typeof common.utter_rate != 'number'){ common.utter_rate=1; }
}

function files_update(){                                                 consolelog_func('darkblue');                                                                              
	                                                                     //console.log('In reader: '+localStorage.getItem("in_reader"))
	if (localStorage.getItem("in_reader")=='yes'){
		useFile( localStorage.getItem("reader_url") ); 
		reader_resize(); 		
	}else{		
		var path = localStorage.getItem("folder_path");                  //console.log('Folder_path:',path);    
		if ( [files.dir,"", undefined, null, 'mail'].indexOf(path)==-1 ){  
			console.log('goTo():', path);                                // Can get stuck here!!     
			goTo( path );
		}
		files_resize();                 
		
		
		var errors = files.php_errors;                                   //console.log(files.php_messages[0]);                
		if (errors.length>0){ 
			common.alert_text = '';
			for (i=0; i<errors.length; i++){ common.alert_text += errors[i]+'<br>'; }
		}else if(files.php_messages.length>0){
			if (files.php_messages[0].toLowerCase().indexOf('error')>-1){ common.alert_text = dict.alert_error; }
		}
		                                                                 //console.log('files.dir: '+files.dir+',  get_subdir(): '+files.get_subdir());
		if (common.welcome=='do' && localStorage.getItem("show_welcome")==="yes" ){ 
			common_show_notification(dict.alert_welcome, false, 1);
			localStorage.setItem("show_welcome",'no');
		}else if (common.alert_text!=''){
			common_show_notification(common.alert_text, false, 1);
			common.alert_text = '';
		} 
	}	                                                                     //console.log('Parent dir: '+getPreviousDir());
}                                                     

//-- ajax functions ------------------------------------------------------

function files_ajax_enter(path){                                         consolelog_func("orange");  
	if (path==undefined){
		var path = files.get_enterpath(files.iter);                      //console.log('EPath: '+path+' - '+localStorage.getItem("reader_url"));           
	}
	if (path==-1 && files.in_contacts ){
		files.in_contacts = false;                                       
		window.location.href=localStorage.getItem("url");
	}else if (files.get_ftype()=='file'){                                // open file
		if (files.in_contacts){                                          
			window.location.href=localStorage.getItem("url")+'messages/'+files.paths[files.iter];
		}else{
			localStorage.setItem("reader_savepath", files.get_savepath(files.iter));  
			localStorage.setItem("reader_fname", files.get_savepath(files.iter));
			useFile( path );                                             //console.log('EnterPath: '+path); console.log('SavePath: '+files.get_savepath(files.iter));
		}
	}else{                                                               // open folder
		if (files.iter==0){
			var previous_dir = getPreviousDir();                         
			if (previous_dir == '') return;
			path = previous_dir;
		}
		localStorage.setItem("folder_path", path);                       console.log('SET PATH');                      
		goTo( path );
		files.iter_prev = 0;
		files.iter = 0;
	}
	utter_stop();
}  

function files_ajax_contacts(){
	var url = files.url;
	url = url.substring(0, url.indexOf('/', url.indexOf('://')+3)+1);
	
	localStorage.setItem("folder_path", 'mail');                         //console.log('Url: '+files.get_url());
	localStorage.setItem("url", url);
	window.location.href=url+'contacts';
}

function files_ajax_create(type){
	if ( !common_ajax_permit() ){ return true; }
	
	var new_name = files.get_subdir()+common.editor_text;                console.log('New fname: '+new_name);
	
	var types = ['folder','file'];
	var alert = dict.alert_error;
	if (new_name==''){
		alert = dict.alert_nameempty;
	}else if( files_exists(common.editor_text, types[type]) ){
		alert = dict.alert_nameexists;
	}else{
		if (type == 0){
			new_name = common.editor_text;
			performLfmRequest('newfolder', {name: new_name})
			.done(refreshFoldersAndItems);                               //console.log('New folder');
			alert = dict.alert_newfolder;
		}else if (type == 1){
			$.ajax( {type: 'GET', dataType: 'text', url: 'create', cache: false, data: {file_name: new_name, file_text:''}} )
			.done( refreshFoldersAndItems('OK') );  
			alert = dict.alert_newtxt;	
		}
	}
	common_show_notification(alert,0,1);
	common.editor_text = '';
}

function files_ajax_addcontact(){
	if ( !common_ajax_permit() ){ return true; }
	
	var new_contact = document.getElementById('edit_contactname').innerHTML; 
	if (new_contact==user.name){ common_show_notification(dict.alert_namewrong,0,1); }
	else if( files.entries.indexOf(new_contact)>-1 ){ common_show_notification(dict.alert_contactexists,0,1); }
	else{
		document.getElementById('addcontact_name').value = new_contact;
		document.getElementById('addcontact_submit').click(); 
		common.alert_text = dict.alert_newcontact+new_contact;
	}
}
function files_ajax_rmcontact(id){
	if ( !common_ajax_permit() ){ return true; }
	document.getElementById('rmcontact_name').value = files.get_fname();
	document.getElementById('rmcontact_submit').click(); 
	common.alert_text = dict.alert_rmcontact;
}

function files_ajax_rename(){
	if ( !common_ajax_permit() ){ return true; }
	
	var alert = dict.alert_error;
	var item_name = files.get_fname(); 
	if ( files.items_protected.indexOf(item_name)==-1){
		
		var item_name = files.get_fname();
		var new_name = common.editor_text;
		var i = files.entries.indexOf(new_name);
		
		if (files_exists(common.editor_text, files.get_ftype()) ){
			alert = dict.alert_nameexists;
		}else{
			performLfmRequest('rename', {file: item_name, new_name: new_name})
			.done(refreshFoldersAndItems);
		    common.editor_text = '';
		    alert = dict.alert_wasrenamed;
		}
	}
	common_show_notification(alert,0,1);
}

function files_ajax_delete(sync, fname){
	if ( !common_ajax_permit() ){ return true; }
	
	var item_name = files.get_subdir()+files.get_fname();
	var i = files.iter;
	if (fname!=undefined){                                               
		item_name = fname;
		i = 'something';
	}
	
	var alert = dict.alert_error;                                     
	if ( i!=0 && files.items_protected.indexOf(item_name)==-1){
		var misc = 'empty';
		if (sync==1){ misc = 'sync';}
		$.ajax( {type: 'GET', dataType: 'text', url: 'delete_dir', cache: false, data: {delete_name: item_name, delete_misc: misc}} )
		.done( refreshFoldersAndItems('OK') );
	    alert = dict.alert_wasdeleted;
	}
	common_show_notification(alert,0,1);
}      
function files_ajax_totrash(){
	if ( !common_ajax_permit() ){ return true; }
	
	var alert = dict.alert_error;
	if ( files.get_savepath(files.iter)!='' ){
		var short_path = files.get_savepath(files.iter); 
		var fname = files.get_subdir()+files.get_fname();
		localStorage.setItem("delete_fname", fname);  
		
		$.ajax( {type: 'GET', dataType: 'text', url: 'copyitem', cache: false, data: {copy_shortpath: short_path, past_dir: "trash/"}} )
		.done( function () {
			files_ajax_delete( 0,localStorage.getItem("delete_fname"));
		} );
	}
}      
function files_ajax_upload(id){
	if ( !common_ajax_permit() ){ return true; }
	
	document.getElementById('upload-button').click();
	loadFolders(true);
	menu_back('menu_back_lvl0',1, 0);
	//location.reload();
}
function files_ajax_download(){                                          consolelog_func();
	if (files.get_ftype()=='file' && files.get_savepath(files.iter)!=''){
		var fname = files.get_fname(); 
		download(fname);
	} 
}

function files_ajax_past(sync){                                          consolelog_func();
	if ( !common_ajax_permit() ){ return true; }
	
	var alert = dict.alert_error;
	
	var misc = 'empty';
	if (sync==1){ misc = 'sync'; }
	$.ajax( {type: 'GET', dataType: 'text', url: 'copyitem', cache: false, 
		data: {copy_shortpath: localStorage.getItem("copy_shortpath"), past_dir:files.get_subdir(), copy_misc:misc}} )
	.done(refreshFoldersAndItems('OK'));
	alert = dict.alert_waspasted;
		
	common_show_notification(alert,0,1);
}    
function files_copy(){                                                   consolelog_func();
	var alert = dict.alert_error;
	if (files.get_savepath(files.iter)!='' ){
		var short_path = files.get_savepath(files.iter);
		localStorage.setItem("copy_shortpath", short_path);              //console.log('Copy short_path: '+short_path);
		alert = dict.alert_wascopied;
	}
	common_show_notification(alert, 0,1);
}

function files_ajax_createinit(){
	if ( !common_ajax_permit() ){ return true; }
	$.ajax( {type: 'GET', dataType: 'text', url: 'create_init', cache: false} )
	.done(refreshFoldersAndItems('OK'));     
}

function common_ajax_permit(){
	var permit = true;                                                   
	if (user.name=='guest'){                                             console.log('Permittion denied: '+user.name);
		permit = false;
		permit = true;
		//common_show_notification(dict.alert_guest, 0,1);
	}
	return permit;
}

//-- account functions ---------------------------------------------------
function files_signin(){                                                 consolelog_func();
    var name = document.getElementById('edit_username').innerHTML;
    var pass = document.getElementById('edit_userpass').innerHTML;
    document.getElementById('signin_username').value = name;
    document.getElementById('signin_password').value = pass;
    
    common.alert_text = dict.alert_signin+name;
    localStorage.setItem("folder_path", '');                             console.log('SignIn:',name, pass);
    document.getElementById('signin_submit').click();  
}
function files_signup(){                                                 consolelog_func();
    var name = document.getElementById('edit_username').innerHTML;
    var pass = document.getElementById('edit_userpass').innerHTML;   
    var email = document.getElementById('edit_usermail').innerHTML;   
	
	document.getElementById('signup_email').value = email;
	document.getElementById('signup_username').value = name;
    document.getElementById('signup_password').value = pass;
    common.alert_text = dict.alert_signup+name;
    document.getElementById('signup_submit').click();  
}


function files_logout(){                                                 consolelog_func();
	common.alert_text = dict.alert_logout;
	localStorage.setItem("folder_path", ''); 
    document.getElementById('logout_submit').click();
}
function files_login_remember(){                                         consolelog_func();
    files.username = document.getElementById('edit_username').innerHTML;
    files.userpass = document.getElementById('edit_userpass').innerHTML;  
    files.userremember = true;
}


//-- misc ----------------------------------------------------------------

function files_exists(fname, type){
	if (type=='file') { fname += '.txt'; }
	var i = files.entries.indexOf(fname);   
	return (i>-1 && files.entrytype[i]==type);
}

function files_edittext(id){                                             consolelog_func('darkblue');
	var text = "";                
	common.ineditor = true;                                    
	if (id=="edit_filename_box"){
		var fname = files.get_fname();                                   //console.log('Edit: '+id+' '+text+' '+files.get_ftype());
		if (files.get_ftype()!='folder'){
			text = fname.substring(0,fname.lastIndexOf('.'));
		}else{
			text = fname;
		}
	}
    editor_start('files', text, id.substring(0,id.lastIndexOf('_')) );   //console.log('Edit: '+id+' '+text+' '+files.entrytype);
}

function files_beforunload() {                                           consolelog_func();
	common.cookie_save.call(files); 
	common.cookie_save(); 
}
function files_cleancookie(){                                            consolelog_func();
	cookie_delete_all(); 
	files.iter = 0;
	files.iter_prev = 0;
	loadFolders(true);
}


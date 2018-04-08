console.log('--------------\n'+document.title);

//-- files variables ---------------------------------------------------------------

var files = {
	iter: 0,
	iter_prev: 0,
	zoom: 0,
	username: "",
	userpass: "",
	userremember: false,
	folder_path: '',                    // to remember folder after reload
	
	cookie_number: 7,
	cookie_suffix: "_f",
	name: "files",
	
	entries: [],
	paths: [],
	entrytype: [],
	unreads: [],
	unread: 0,
	dir: "",
	url: '',
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
		if (i==undefined){i=this.iter;}                                  // for folders same as   files.dir+'/'+files.get_fname()                    
		var path = '';   
		
		if (this.entrytype[i]=='file'){
			path = this.url+this.dir+'/'+this.entries[i];
		}else if (this.entries.length<1){
			path = '';
		}else{
			var dir = this.get_subdir();
			if (i==0){ 
				if (dir==''){path=dir;}
				else{ path = dir.substring(0,dir.lastIndexOf('/'));	}			
			}
			else{     
				path = dir+'/'+this.entries[i]; }                        
		}   
		return path;
	},
	get_savepath: function(i){
		if (i==0){ return ''; }
		
		var path = '';
		var dir = this.dir.substring(1);                                 
		if (dir.indexOf('/')==-1){ dir = '/'; }
		else{ dir = dir.substring(dir.indexOf('/')+1); }             
		return dir+this.entries[i];
	},
	get_subdir: function(){
		var dir = this.dir.substring(1);                                 
		if (dir.indexOf('/')==-1){ dir = ''; }
		else{ dir = dir.substring(dir.indexOf('/')+1); }                 //console.log('Subdir:',dir);
		if (dir!=''){dir = '/'+dir;}
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
	if (localStorage.getItem("in_reader")==null){ localStorage.setItem("in_reader", ""); }
	if (localStorage.getItem("in_messages")==null){ localStorage.setItem("in_messages", ""); }
	
	
	var inner_e = "";
	inner_e += "<div id='files_scroll' class='text_scroll' style='top:0vh;left:0vw;' align='left' > ";
	inner_e += "<div id='files_array' class='reader_text' style='top:2;left:0;visibility:hidden;height:20vh;'></div>";
	inner_e += "</div>";
	document.getElementById("content_box").innerHTML = inner_e;
	window.onbeforeunload = files_beforunload;
	window.onresize = function(){ files_resize(); };	                 
	

	var in_reader = localStorage.getItem("in_reader");
	var in_messages = localStorage.getItem("in_messages");               //console.log('IN: |'+in_messages+'|'+in_reader+'|'+common.in_contacts+'|');
	
	if (in_reader!=''){ 
		files_ajax_items(files.folder_path); 
		files_ajax_openfile( in_reader ); 
	}
	else if (in_messages!=''){ 
		files_ajax_contacts(); 
		files_ajax_messages( in_messages ); 
	}
	else if (common.in_contacts){ files_ajax_contacts(); }
	else { files_ajax_items(files.folder_path); }
	
	if (typeof common.utter_rate != 'number'){ common.utter_rate=1; }
}

function files_update(){                                                 consolelog_func('darkblue');                                                                              
	                                                                    
	if (localStorage.getItem("in_reader")!=''){
		reader_resize(); 		
	}else{		                                                         
		
		if (common.in_contacts==false){                                        
			if ( [files.dir,"", undefined, null].indexOf(files.folder_path)==-1 
			     && files.folder_path!=files.get_subdir() ){             // Can get stuck here!!     
				files_ajax_items(files.folder_path);                     console.log('!!!!goTo():', files.folder_path,files.get_subdir());
			}
		}
		files_fill_zoom();
		files_resize();                 
		
		
		var errors = files.php_errors;                                   //console.log(files.php_messages[0]);                
		if (errors.length>0){ 
			common.alert_text = '';
			for (i=0; i<errors.length; i++){ common.alert_text += errors[i]+'<br>'; }
		}else if(files.php_messages.length>0){
			if (files.php_messages[0].toLowerCase().indexOf('error')>-1){ common.alert_text = dict.alert_error; }
		}
		                                                                 
		if (common.welcome=='do' && localStorage.getItem("show_welcome")=="yes" ){ 
			common_show_notification(dict.alert_welcome);
			localStorage.setItem("show_welcome",'no');
			if ('speechSynthesis' in window) {
				console.log('Browser supports speech synthesis');
			}else {console.log('Browser does not support speech synthesis!'); }
			
		}else if (common.alert_text!=''){
			common_show_notification(common.alert_text);
			common.alert_text = '';
		}
		
	}	                                                                     //console.log('Parent dir: '+getPreviousDir());
}                                                     

//-- ajax functions ------------------------------------------------------

function files_ajax_enter(path){                                         consolelog_func("orange");  
	if (path==undefined){
		var path = files.get_enterpath(files.iter);                      //console.log('AjaxEnter:',path,files.iter,files.get_ftype());        
	}                                   
	                               
	if (path==-1 && common.in_contacts ){                                // exit from contacts
		common.in_contacts = false;                                  
		files.iter = 0;
		files_ajax_items();                                              
	}else if (files.get_ftype()=='file'){                                // open file
		common.cookie_save.call(files); 
		common.cookie_save(); 
			
		if (common.in_contacts){                                          
			files_ajax_messages();
		}else{
			localStorage.setItem("reader_savepath", files.get_savepath(files.iter));  
			localStorage.setItem("reader_fname", files.get_savepath(files.iter));
			files_ajax_openfile( path );                                             
		}
	}else{                                                               // open folder
		files.iter = 0; 
		files.folder_path = path;                                        console.log('SET PATH', path);
		files_ajax_items(path);                      
	}
	utter_stop();
}  

function files_ajax_messages(id){                                        consolelog_func('orange');
	if (id==undefined) { id = files.paths[files.iter]; }
	$.ajax( {type: 'GET', dataType: 'text', url: 'messages', cache: false, data: {contact_id: id}, 
		 headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') } } )
	.done(function(data){ 
		localStorage.setItem("in_messages", id); 
		//reader_start();
		files_load_messages(data); 
	});
}
function files_ajax_items(path){                                         consolelog_func('orange'); 
	if (path==undefined){
		if (files.get_ftype()=='file'){ path=files.folder_path; }
		else{ path = files.get_enterpath(); }
	}                                                                    
	$.ajax( {type: 'GET', dataType: 'text', url: 'jsonitems', cache: false, data: {path: path}} )
    .done(function (data) { files_load_items(data); });
}
function files_ajax_openfile(url) {                                      consolelog_func('orange');
  
    var type = url.substring(url.lastIndexOf('.'));                      
    if (type.replace(' ','')=='.txt'){                                   console.log('File url: '+url);
		
		$.ajax({type: "GET", url: url})
		.done(function (data){
			var text_i = data;                                           //console.log('text: '+text_i);
			document.getElementById('hidden_text').innerHTML = text_i;
			document.getElementById('created_elements').innerHTML = '';
			localStorage.setItem("in_reader", url);     
		                    	 
			reader_start();
		});   	
	}else{
		window.open(url);
	}
}

function files_load_items(data){                                         consolelog_func('darkblue');
	var response = JSON.parse(data);
	common_phpresponse(response);
	
	files.entries   = response.entries;                                
	files.entrytype = response.entrytype;                              
	files.dir       = response.working_dir;                            
	files.url       = response.homedir.substring(0,response.homedir.lastIndexOf('/'));  
	files.unread    = response.unread; 
	
	// move trash to the 1st position
	var i = files.entries.indexOf('trash');                              
	if (i>-1){
	  files.entries.splice(i, 1);
	  files.entries.splice(1,0, 'trash');                                
	}                                                                    //console.log('Items:',files.entries,i);
	files_update();
}         

function files_load_messages(data){                                      consolelog_func('darkblue');       
	var response = JSON.parse(data);                                     
	common_phpresponse(response);
	
	var messages = [];
	var msg = [];
	for (i=0; i<response.posts.length; i++){
		msg = response.posts[i];
		messages.push( [msg.id, msg.user_id, msg.created_at, msg.message] );  console.log([msg.id, msg.user_id, msg.create_at, msg.message]);
	}
	reader.draft = response.draft;                                       console.log('Draft: '+reader.draft);
	user.contact_name = response.contactname;
	user.contact_id = response.id_to;
	
	common.in_messages =true;                                            console.log('User and contact: '+user.name+' | '+user.contact_name);
	reader.messages_arr = messages;
	var text_i = messages;
	document.getElementById('hidden_text').innerHTML = text_i;
	document.getElementById('created_elements').innerHTML = '';
	localStorage.setItem("reader_fname", 'mail/'+user.contact_name); 
	localStorage.setItem("reader_fpath", '');                            
	reader_start();
}

function files_load_contacts(data){                                      consolelog_func('darkblue');
	                                                                              
	var response = JSON.parse(data);                                     console.log(response);
	var ids=response.connections, names=response.names, unreads=response.unreads;
	common_phpresponse(response);
	
	localStorage.setItem("in_reader", '');                             
	common.in_contacts = true;
	
	// sort contacts by name 
	var d={}; var r={};
	for (var i=0; i<names.length; i++){ d[names[i]]=ids[i]; }              
	for (var i=0; i<names.length; i++){ r[names[i]]=unreads[i]; }              
	names.sort(); 
	ids=[]; unreads=[];
	for (var i=0; i<names.length; i++){ ids.push(d[names[i]]); }
	for (var i=0; i<names.length; i++){ unreads.push(r[names[i]]); }
	
	files.entries = names;                                               //console.log('Entries 2: ',names, ids);                       
	files.paths = ids;                                                   //console.log('Unreads: ', unreads);    
	files.entrytype = Array(ids.length).fill('file'); 
	files.unreads = unreads;    
	files_update();     
}
	
function files_ajax_contacts(){                                          consolelog_func('orange');                                                                              
	var url = files.url;
	url = url.substring(0, url.indexOf('/', url.indexOf('://')+3)+1);
	
	files.iter = 0;
	localStorage.setItem("url", url);
	$.ajax( {type: 'GET', dataType: 'text', url: 'contacts', cache: false, data: {contact_id: files.paths[files.iter]}, 
			 headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') } } )
			.done(function(data){ files_load_contacts(data); });
}

function files_ajax_create(type){                                        consolelog_func('orange');
	if ( !common_ajax_permit() ){ return true; }
	
	var new_name = files.get_subdir()+common.editor_text;                
	var types = ['folder','file'];
	type = types[type];
	
	if (new_name==''){
		common_show_notification(dict.alert_nameempty);
	}else if( files_exists(common.editor_text, type) ){
		common_show_notification(dict.alert_nameexists);
	}else{
		$.ajax( {type: 'GET', dataType: 'text', url: 'create', cache: false, data: {file_name: new_name, file_text:'', create_type:type}} )
		.done(function(data){ files_load_items(data); });
	}
	common.editor_text = '';
}

function files_ajax_addcontact(){                                        consolelog_func('orange');
	if ( !common_ajax_permit() ){ return true; }
	
	var new_contact = document.getElementById('edit_contactname').innerHTML; 
	if (new_contact==user.name){ common_show_notification(dict.alert_namewrong); }
	else if( files.entries.indexOf(new_contact)>-1 ){ common_show_notification(dict.alert_contactexists); }
	else{
		$.ajax( {type: 'POST', dataType: 'text', url: 'connection_add', cache: false, data: {addcontact_name: new_contact}, 
			 headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') } } )
			.done(function(data){ files_load_contacts(data); });
		common.alert_text = dict.alert_newcontact+new_contact;
	}
}
function files_ajax_rmcontact(id){                                       consolelog_func('orange');
	if ( !common_ajax_permit() || files.get_fname()==undefined){ return true; }
	
	$.ajax( {type: 'POST', dataType: 'text', url: 'connection_remove', cache: false, data: {rmcontact_name: files.get_fname()}, 
			 headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') } } )
			.done(function(data){ files_load_contacts(data); });
	common.alert_text = dict.alert_rmcontact;
}
function files_ajax_rmuser(id){                                          consolelog_func('orange');
	if ( !common_ajax_permit() ){ return true; }
	
	$.ajax( {type: 'GET', dataType: 'text', url: 'delete_user', cache: false, 
			 headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') } } ) 
    .done(function (data) { 
		location.reload(); common_phpresponse(JSON.parse(data)); 
	});
}

function files_ajax_rename(){                                            consolelog_func('orange');
	if ( !common_ajax_permit() ){ return true; }
	
	var new_name = common.editor_text;
	var item_name = files.get_fname(); 
	
	if (new_name==''){
		common_show_notification(dict.alert_nameempty);
	
	}else if ( files.items_protected.indexOf(item_name)>-1 ){
		common_show_notification(dict.alert_error);
	
	}else if (files_exists(new_name, files.get_ftype()) ){
		common_show_notification(dict.alert_nameexists);
	
	}else{                                                               console.log('NEWNAME|'+new_name+'|');
		$.ajax( {type: 'GET', dataType: 'text', url: 'rename', cache: false, data: {subdir: files.get_subdir(), old_name: files.get_fname(), new_name:new_name}} )
		.done(function(data){ files_load_items(data); });
	    common.editor_text = '';
	}
}

function files_ajax_delete(sync, fname){                                 consolelog_func('orange');
	if ( !common_ajax_permit() ){ return true; }
	
	var item_name = files.get_subdir()+files.get_fname();
	var i = files.iter;
	if (fname!=undefined){                                               
		item_name = fname;
		i = 'something';
	}
	
	if ( i!=0 && files.items_protected.indexOf(item_name)==-1){
		var misc = 'empty';
		if (sync==1){ misc = 'sync';}
		$.ajax( {type: 'GET', dataType: 'text', url: 'delete_dir', cache: false, data: {delete_name: item_name, delete_misc: misc}} )
		.done(function(data){ files_load_items(data); });
	}
}      
function files_ajax_totrash(){                                           consolelog_func('orange');
	if ( !common_ajax_permit() ){ return true; }
	
	if ( files.get_savepath(files.iter)!='' ){
		var short_path = files.get_savepath(files.iter); 
		var fname = files.get_subdir()+files.get_fname();
		localStorage.setItem("delete_fname", fname);  
		
		$.ajax( {type: 'GET', dataType: 'text', url: 'copyitem', cache: false, data: {copy_shortpath: short_path, past_dir: "trash/", to_trash:'yes'}} )
		.done( function (data) {
			common_phpresponse(JSON.parse(data));
			files_ajax_delete( 0,localStorage.getItem("delete_fname"));
		} );
	}
}      
function files_ajax_upload(id){                                          consolelog_func('orange');
	if ( !common_ajax_permit() ){ return true; }	
	document.getElementById('upload-button').click();                    // copied from LFM
	menu_back('menu_back_lvl0',1, 0);
	var data = { working_dir: $('#working_dir').val(),
			   type: $('#type').val() };                                 console.log('DATA:',files.get_subdir(), data);
}
function files_ajax_download(){                                          consolelog_func('orange');
	if (files.get_ftype()=='file' && files.get_savepath(files.iter)!=''){
		var fname = files.get_fname(); 
		download(fname);
	} 
}

function files_ajax_paste(sync){                                         consolelog_func('orange');
	if ( !common_ajax_permit() ){ return true; }
		
	var misc = 'empty';
	if (sync==1){ misc = 'sync'; }
	$.ajax( {type: 'GET', dataType: 'text', url: 'copyitem', cache: false, 
		data: {copy_shortpath: localStorage.getItem("copy_shortpath"), past_dir:files.get_subdir(), copy_misc:misc, to_trash:'no'}} )
	.done(function(data){ files_load_items(data); });
}    
function files_copy(){                                                   consolelog_func('orange');
	var alert = dict.alert_error;
	if (files.get_savepath(files.iter)!='' ){
		var short_path = files.get_savepath(files.iter);
		localStorage.setItem("copy_shortpath", short_path);              
		alert = dict.alert_wascopied;
	}
	common_show_notification(alert);
}

function files_ajax_createinit(){                                        consolelog_func('orange');
	//if ( !common_ajax_permit() ){ return true; }
	$.ajax( {type: 'GET', dataType: 'text', url: 'create_init', cache: false} )
	.done(function(data){ files_load_items(data); });
}

function common_ajax_permit(){
	var permit = true;                                                   
	if (user.name=='guest'){                                             //console.log('Permittion denied: '+user.name);
		permit = false;
		permit = true;
		common_show_notification(dict.alert_guest);
	}
	return permit;
}

//-- account functions ---------------------------------------------------
function files_signin(){                                                 consolelog_func();
    var name = document.getElementById('edit_username').innerHTML;
    var pass = document.getElementById('edit_userpass').innerHTML;       
    files.folder_path = '';
    
    $.ajax( {type: 'POST', dataType: 'text', url: 'signin', cache: false, data: {first_name:name, password:pass}, 
			 headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') } } ) 
    .done(function (data) { 
		files_load_user(data);
		files_ajax_items();
	});
}
function files_signup(){                                                 consolelog_func();
    var name = document.getElementById('edit_username').innerHTML;
    var pass = document.getElementById('edit_userpass').innerHTML;   
    var email = document.getElementById('edit_usermail').innerHTML;   	
    files.folder_path = '';
    
    $.ajax( {type: 'POST', dataType: 'text', url: 'signup', cache: false, data: {first_name:name, password:pass, email:email}, 
			 headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') } } ) 
    .done(function (data) { 
		files_load_user(data);
		files_ajax_items();
	}); 
}
function files_logout(){                                                 consolelog_func();
	files.folder_path = '';
    
    $.ajax( {type: 'GET', dataType: 'text', url: 'logout', cache: false, 
		     headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') } } ) 
    .done(function (data) { 
		files_load_user(data);
		files_ajax_items();
	});
}
function files_login_remember(){                                         consolelog_func();
    files.username = document.getElementById('edit_username').innerHTML;
    files.userpass = document.getElementById('edit_userpass').innerHTML;  
    files.userremember = true;
}
function files_load_user(data){
	var response = JSON.parse(data);
	common_phpresponse(response);
	user.name = response.username;
	user.id = response.userid;
	files.unread = response.unread;
	common.in_contacts = false;
	common.in_messages = false;
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
		var fname = files.get_fname();                                                            
		if (files.get_ftype()!='folder'){
			text = fname.substring(0,fname.lastIndexOf('.'));
		}else{
			text = fname;
		}
	}
    editor_start('files', text, id.substring(0,id.lastIndexOf('_')) );   
}

function files_beforunload() {                                           consolelog_func();
	common.cookie_save.call(files); 
	common.cookie_save(); 
}
function files_cleancookie(){                                            consolelog_func();
	cookie_delete_all(); 
	files.iter = 0;
	files.iter_prev = 0;
	files_ajax_items();
}



//-- copied from lfm, used for upload only -------------------------------
function performLfmRequest(url, parameter, type) {
  var data = { working_dir: files.get_subdir(), type: 'POST' };                               

  if (parameter != null) {
    $.each(parameter, function (key, value) {
      data[key] = value;
    });
  }

  return $.ajax({
    type: 'GET',
    dataType: type || 'text',
    url: lfm_route + '/' + url,
    data: data,
    cache: false
  }).fail(function (jqXHR, textStatus, errorThrown) {
    displayErrorResponse(jqXHR);
  });
}



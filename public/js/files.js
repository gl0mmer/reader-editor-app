console.log('--------------\n'+document.title);

//-- files variables ---------------------------------------------------------------

var files = {
	iter: 0,
	iter_prev: 0,
	zoom: 0,
	username: "",
	userpass: "",
	userremember: false,
	
	cookie_number: 7,
	cookie_suffix: "_f",
	name: "files",
	
	entries: [],
	paths: [],
	entrytype: [],
	dir: "",
	zoom_arr: ['no zoom', 'add zoom'],
	home: '',
	in_contacts: false,
	contacts: [],
	messages: [],
	url: '',
	alert_guest: 'You need registration to proceed',
	items_protected: ['..','trash'],
	
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

//-- start/update/scroll -----------------------------------------------------------
function files_start(){                                                  consolelog_func('darkblue');  
	
	if (cookie_get('isset_files_')!='isset'){                            
		cookie_set("isset_files_", "isset");
		common.cookie_save.call(files);
		common.cookie_save();
	}else { 
		common.cookie_load.call(files); 
		common.cookie_load();
	}
	
	var inner_e = "";
	inner_e += "<div id='files_scroll' class='text_scroll' style='top:0vh;left:0vw;' align='left' > ";
	inner_e += "<div id='files_array' class='reader_text' style='top:2;left:0;visibility:hidden;height:20vh;'></div>";
	inner_e += "</div>";
	document.getElementById("content_box").innerHTML = inner_e;
	window.onbeforeunload = files_beforunload;
	window.onresize = function(){ 
		files_resize();
	};	
}

function files_update(){                                                 consolelog_func('darkblue');                                                                              
	                                                                     //console.log('In reader: '+localStorage.getItem("in_reader"))
	if (localStorage.getItem("in_reader")=='yes'){
		useFile( localStorage.getItem("reader_url") ); 
		
	}else{		
		var path = localStorage.getItem("folder_path");                  
		if ( [files.dir,"", undefined, null, 'mail'].indexOf(path)==-1 ){
			goTo( path );
		}
		files_resize();
		if (files.entries.length>0){
			files_scroll(files.iter, 'no');
			files_fill_zoom();
			files_set_zoom('no');    
		}                                                                //console.log('files.dir: '+files.dir+',  get_subdir(): '+files.get_subdir());
		if (common.welcome=='do' && localStorage.getItem("show_welcome")==="yes" ){ 
			files_welcome();
			localStorage.setItem("show_welcome",'no');
		} 
	}
	                                                                     //console.log('Parent dir: '+getPreviousDir());
}                                                     

//-- ajax functions ------------------------------------------------------

function files_ajax_enter(path){                                         consolelog_func("orange");  
	if (path==undefined){
		var path = files.get_enterpath(files.iter);                      //console.log('EPath: '+path+' - '+files.dir+'/'+files.get_fname());           
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
			useFile( path );                                             console.log('EnterPath: '+path); console.log('SavePath: '+files.get_savepath(files.iter));
		}
	}else{                                                               // open folder
		if (files.iter==0){
			var previous_dir = getPreviousDir();                         
			if (previous_dir == '') return;
			path = previous_dir;
		}
		localStorage.setItem("folder_path", path);                       
		goTo( path );
		files.iter_prev = 0;
		files.iter = 0;
	}
	utter_stop();
}  

function files_ajax_contacts(){
	var url = files.url;
	url = url.substring(0, url.indexOf('/', url.indexOf('://')+3)+1);
	
	localStorage.setItem("folder_path", 'mail');                     //console.log('Url: '+files.get_url());
	localStorage.setItem("url", url);
	window.location.href=url+'contacts';
}

function files_ajax_create(type){
	var new_name = files.get_subdir()+common.editor_text;                console.log('New fname: '+new_name);
	var i = files.entries.indexOf(new_name);
	
	var alert = 'Error';
	if ( !common_ajax_permit() ){
		alert = files.alert_guest;
	}else if (new_name==''){
		alert = 'Name is empty';
	}else if(i>-1 && (files.entrytype[i]=='folder' && type==0  || files.entrytype[i]=='file' && type==1 )){
		alert = 'Name exists';
	}else{
		if (type == 0){
			new_name = common.editor_text;
			performLfmRequest('newfolder', {name: new_name})
			.done(refreshFoldersAndItems);                               //console.log('New folder');
			alert = 'New folder was created';
		}else if (type == 1){
			$.ajax( {type: 'GET', dataType: 'text', url: 'create', cache: false, data: {file_name: new_name, file_text:''}} )
			.done( refreshFoldersAndItems('OK') );  
			alert = 'New text file was created';	
		}
	}
	common_show_notification(alert,0,1);
	common.editor_text = '';
}

function files_ajax_addcontact(){
	if ( !common_ajax_permit() ){
		alert = files.alert_guest;
	}else{
		var new_contact = document.getElementById('edit_contactname').innerHTML; 
		document.getElementById('addcontact_name').value = new_contact;
		document.getElementById('addcontact_submit').click(); 
		//$.ajax( {type: 'POST', dataType: 'text', url: 'connection_add', cache: false, data: {addcontact_name:new_contact, '_token': $('meta[name=csrf-token]').attr('content')}} )
		//.done( location.reload() ); 
	}
}

function files_ajax_rename(){
	var alert = 'Error';
	var item_name = files.get_fname(); 
	if ( !common_ajax_permit() ){
		alert = files.alert_guest;
	}else if ( files.get_savepath(files.iter)!='' && files.items_protected.indexOf(item_name)==-1){
		
		var item_name = files.get_fname();
		var new_name = common.editor_text;
		var i = files.entries.indexOf(new_name);
		
		if (i>-1){
			alert = 'Name exists';
		}else{
			performLfmRequest('rename', {file: item_name, new_name: new_name})
			.done(refreshFoldersAndItems);
		    common.editor_text = '';
		    alert = 'Item was renamed'
		}
	}
	common_show_notification(alert,0,1);
}

function files_ajax_delete(sync, fname){
	var item_name = files.get_subdir()+files.get_fname();
	var i = files.iter;
	if (fname!=undefined){                                               console.log('delete to trash: '+fname);
		item_name = fname;
		i = 'something';
	}
	var alert = 'Error';                                          console.log('delete item: '+item_name);
	
	if ( !common_ajax_permit() ){
		alert = files.alert_guest;
	}else if ( i!=0 && files.items_protected.indexOf(item_name)==-1){
		var misc = 'empty';
		if (sync==1){ misc = 'sync';}
		$.ajax( {type: 'GET', dataType: 'text', url: 'delete_dir', cache: false, data: {delete_name: item_name, delete_misc: misc}} )
		.done( refreshFoldersAndItems('OK') );
	    alert = 'Item was deleted';
	}
	common_show_notification(alert,0,1);
}      
function files_ajax_totrash(){
	var alert = 'Error';
	if ( !common_ajax_permit() ){
		alert = files.alert_guest;
	}else if ( files.get_savepath(files.iter)!='' ){
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
	if ( !common_ajax_permit() ){
		alert = files.alert_guest;
	}else{
		document.getElementById('upload-button').click();
		loadFolders(true);
		menu_back('menu_back_lvl0',1, 0);
		//location.reload();
		
	}
}
function files_ajax_download(){                                          consolelog_func();
	if (files.get_ftype()=='file' && files.get_savepath(files.iter)!=''){
		var fname = files.get_fname(); 
		download(fname);
	} 
}

function files_ajax_past(sync){                                              consolelog_func();
	var alert = 'Error';
	if ( !common_ajax_permit() ){
		alert = files.alert_guest;
	}else {
		var misc = 'empty';
		if (sync==1){ misc = 'sync'; }
		$.ajax( {type: 'GET', dataType: 'text', url: 'copyitem', cache: false, 
			data: {copy_shortpath: localStorage.getItem("copy_shortpath"), past_dir:files.get_subdir(), copy_misc:misc}} )
		.done(refreshFoldersAndItems('OK'));
		alert = 'Item was pasted';
	}
	common_show_notification(alert,0,1);
}    

function files_copy(){                                                   consolelog_func();
	var alert = 'Error';
	if (files.get_savepath(files.iter)!='' ){
		var short_path = files.get_savepath(files.iter);
		localStorage.setItem("copy_shortpath", short_path);              //console.log('Copy short_path: '+short_path);
		alert='Item was copied';
		//menu_back('menu_back_lvl0',1, 0);
	}
	common_show_notification(alert, 0,1);
}

function files_ajax_createinit(){
	$.ajax( {type: 'GET', dataType: 'text', url: 'create_init', cache: false} )
	.done(refreshFoldersAndItems('OK'));     
}

function common_ajax_permit(){
	var permit = true;                                                   
	if (user.name=='guest'){                                             console.log('Permittion denied: '+user.name);
		permit = false;
		permit = true;
	}
	return permit;
}

//-- account functions ---------------------------------------------------
function files_signin(){                                                 consolelog_func();
    var name = document.getElementById('edit_username').innerHTML;
    var pass = document.getElementById('edit_userpass').innerHTML;
    document.getElementById('signin_username').value = name;
    document.getElementById('signin_password').value = pass;
    document.getElementById('signin_submit').click();  
    //utter(login_messages_en[user_access],0,0,0);
}
function files_signup(){                                                 consolelog_func();
    var name = document.getElementById('edit_username').innerHTML;
    var pass = document.getElementById('edit_userpass').innerHTML;   
    var email = document.getElementById('edit_usermail').innerHTML;   
	
	document.getElementById('signup_email').value = email;
	document.getElementById('signup_username').value = name;
    document.getElementById('signup_password').value = pass;
    document.getElementById('signup_submit').click();  
}


function files_logout(){                                                 consolelog_func();
    document.getElementById('logout_submit').click();
}
function files_login_remember(){                                         consolelog_func();
    files.username = document.getElementById('edit_username').innerHTML;
    files.userpass = document.getElementById('edit_userpass').innerHTML;  
    files.userremember = true;
}

//-- misc ----------------------------------------------------------------
function files_edittext(id){                                             consolelog_func('darkblue');
	var text = "";                                                       
	if (id=="edit_filename"){
		var fname = files.get_fname();                                   //console.log('Edit: '+id+' '+text+' '+files.get_ftype());
		if (files.get_ftype()!='folder'){
			text = fname.substring(0,fname.lastIndexOf('.'));
		}else{
			text = fname;
		}
	}
    editor_run('files', text, id);                                       //console.log('Edit: '+id+' '+text+' '+files.entrytype);
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


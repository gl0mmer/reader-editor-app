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
	
	nentry:1,
	nfolders: 1,
	entries: [],
	paths: [],
	entrytype: [],
	json_tmp: "",
	dir: "",
	zoom_arr: ['no zoom', 'zoom'],
	home: '',
	in_contacts: false,
	contacts: [],
	messages: [],
	userid: -1,
	//url: 'http://localhost/laravel-filemanager/files',
	url: '',
	
	get_fname: function(i){                                              //consolelog_func('brown');
		if (i===undefined) {i=this.iter;} 
		return document.getElementById('fileid_'+this.iter.toString()+'_name').innerHTML; 
	},
	get_fid: function(i){                                                //consolelog_func('brown');
		if (i===undefined) {i=this.iter;} 
		return 'fileid_'+i.toString(); 
	}, 
	get_felem: function(i){                                              //consolelog_func('brown');
		if (i===undefined) {i=this.iter;}                                //console.log('ID: '+this.get_fid(i));
		return document.getElementById(this.get_fid(i));
	},
	get_felem_pic: function(i){                                          //consolelog_func('brown');
		if (i===undefined) {i=this.iter;} 
		return document.getElementById(this.get_fid(i)+'_pic');
	},
	get_ftype: function(i){                                              //consolelog_func('brown');
		if (i===undefined) {i=this.iter;} 
		var type = "";
		var elem = document.getElementById(this.get_fid(i));
		if (elem) { type=elem.getAttribute('title'); }
		return type;
	},
	get_enterpath: function(i){
		var path = '';
		if (this.entrytype[i]=='file'){
			//path = 'http://localhost/laravel-filemanager/files';
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
		else{ dir = dir.substring(dir.lastIndexOf('/')+1)+'/'; }         //console.log('Savepath: ',dir, this.entries[i]);
		return dir+this.entries[i];
	},
	get_subdir: function(){
		var dir = this.dir.substring(1);                                 //console.log('Savepath: ',dir);
		if (dir.indexOf('/')==-1){ dir = ''; }
		else{ dir = dir.substring(dir.lastIndexOf('/')+1)+'/'; }         //console.log('Savepath: ',dir, this.entries[i]);
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
	inner_e += "<div class='text_scroll' style='top:0%;left:0vw;' align='left' > ";
	inner_e += "<div id='files_array' class='reader_text' style='top:2;left:0;visibility:hidden;height:20%;'></div>";
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
		files_show_buttons();                                            //console.log('Paths: ',files.paths);	       
		common_set_fontsize(common.f_fontsize_scale, files);                                                                                                             
		common.style.resize();
		files_show_files();
		files_scroll(files.iter, 'no'); 
		files_fill_zoom();
		files_set_zoom('no');                                            //console.log('files.dir: '+files.dir+',  subdir: '+files.get_subdir());
		if (common.welcome=='do' && localStorage.getItem("show_welcome")==="yes" ){ 
			files_welcome();
			localStorage.setItem("show_welcome",'no');
		} 
	}
	                                                                     //console.log('Parent dir: '+getPreviousDir());
}    

function files_scroll(order, i_utter){                                   consolelog_func('darkblue');

    var iter = files.iter;                                               
    var iter_prev = files.iter_prev;                                     
    if (order==-1){ if (iter<files.entries.length-1) {iter+=1;} }
    else if (order==-2){ if (iter>0) {iter-=1;} }
    else { iter = order };                                               
    iter_prev = files.iter;   
    files.iter_prev = files.iter;
    files.iter = iter;
    
    if (files.iter>files.entries.length-1  || files.iter<0){
		files.iter = 0; 
		files.iter_prev = 0;
	}
                                                                         console.log('scroll iter: '+files.iter+' | '+files.iter_prev);
    files.get_felem(files.iter).className = 'files-hover';
    if (files.iter_prev != files.iter) {
		files.get_felem(files.iter_prev).className = 'files';
	}
    
    files_fill_zoom();
    scroll_to(files.get_fid(), 'content_box', title=0);
    
    if (iter==0){fname_ii='..';}
    else{fname_ii = files.get_fname(); }
    fname_ii = fname_ii.replace('_',' ');                               
    if (i_utter===undefined){ utter(fname_ii, 1, onend=0); }             
}                                                        

//-- ajax functions ------------------------------------------------------

function files_ajax_enter(){                                             consolelog_func("orange");  
	var path = files.get_enterpath(files.iter);                               
	
	if (files.entries[files.iter]=='mail') {                             // show contacts
		goTo( path );
		document.getElementById('show_contacts').click();
	}else if (files.in_contacts && files.iter==0){                       // exit contacts
		//loadItems();
		document.getElementById('show_home').click();
	}
	else if (files.entrytype[files.iter]=='file'){                       // open file
		if (files.in_contacts){                                          //console.log('Contact: '+files.paths[files.iter]);
			document.getElementById('contact_'+files.paths[files.iter]).click();
		}else{
			localStorage.setItem("reader_savepath", files.get_savepath(files.iter));  
			localStorage.setItem("reader_fname", files.get_savepath(files.iter));
			useFile( path );                                             console.log('EnterPath: '+path); console.log('SavePath: '+files.get_savepath(files.iter));
		}
	}else{                                                               // open folder
		//path = files.get_fpath(files.iter);   
		if (files.iter==0){
			var previous_dir = getPreviousDir();                         
			if (previous_dir == '') return;
			path = previous_dir;
		}
		goTo( path );
		files.iter_prev = 0;
		files.iter = 0;
	}
	
}  

function files_ajax_create(type){
	var new_name = files.get_subdir()+common.editor_text;                //console.log('New fname: '+new_name);
	var i = files.entries.indexOf(new_name);
	
	if (new_name==''){
		alert = 'Name is empty.';
	}else if(i>-1 && (files.entrytype[i]=='folder' && type==0  || files.entrytype[i]=='file' && type==1 )){
		alert = 'File exists.';
	}else{
		if (type == 0){
			performLfmRequest('newfolder', {name: new_name})
			.done(refreshFoldersAndItems);                               //console.log('New folder');
			alert = 'New folder is created.';
		}else if (type == 1){
			document.getElementById('create_filename').value = new_name;
			document.getElementById('create_submit').click();            //console.log('New .txt');
			alert = 'New text file is created.';
		}
	}
	common_show_notification(alert);
	common.editor_text = '';
}

function files_ajax_addcontact(){
	var new_contact = document.getElementById('files_addcontact_edit').innerHTML;
	document.getElementById('addcontact_name').value = new_contact;
	document.getElementById('addcontact_submit').click(); 
}

function files_ajax_rename(){
	var alert = 'Not allowed.';
	if (files.get_savepath(files.iter)!=''){
		
		var item_name = files.entries[files.iter];
		var new_name = common.editor_text;
		var i = files.entries.indexOf(new_name);
		
		if (i>-1){
			alert = 'Name exists.';
		}else{
			performLfmRequest('rename', {
		        file: item_name,
		        new_name: new_name
		      }).done(refreshFoldersAndItems);
		    common.editor_text = '';
		    alert = 'Item was renamed.'
		}
	}
	common_show_notification(alert);
}

function files_ajax_delete(){
	var alert = 'Not allowed.';
	if (files.get_savepath(files.iter)!=''){
		var item_name = files.entries[files.iter];
		performLfmRequest('delete', {items: item_name})
	    .done(refreshFoldersAndItems);
	    alert = 'Item was deleted.'
	}
	common_show_notification(alert);
}      
function files_ajax_upload(id){
	document.getElementById('upload-button').click();
	loadFolders(true);
}
function files_ajax_download(){                                          consolelog_func();
	if (files.entrytype[files.iter]=='file' && files.get_savepath(files.iter)!=''){
		var fname = files.entries[files.iter]; 
		download(fname);
	} 
}

function files_ajax_past(){                                              consolelog_func();
	var path = localStorage.getItem("copy_fullpath");                    //console.log('Copy/Past item: '+path);
	if (path!=''){
		document.getElementById("copy_fullpath").value = localStorage.getItem("copy_fullpath");
		document.getElementById("copy_shortpath").value = localStorage.getItem("copy_shortpath");
		document.getElementById("past_dir").value = files.get_subdir();
		document.getElementById("copy_submit").click(); 
	}
}    
function files_copy(){                                                   consolelog_func();
	var alert = 'Not allowed.';
	if (files.get_savepath(files.iter)!='' && files.entrytype[files.iter]=='file'){
		var full_path  = files.get_enterpath(files.iter);
		var short_path = files.get_savepath(files.iter);
		//if (files.entrytype[files.iter]=='folder'){
		//	fname = files.home+fname;
		//}
		localStorage.setItem("copy_fullpath", full_path);                //console.log('Copy full_path: '+full_path);
		localStorage.setItem("copy_shortpath", short_path);              //console.log('Copy short_path: '+short_path);
		alert='Copied.';
	}
	common_show_notification(alert);
}


//-- account functions ---------------------------------------------------
function files_signin(){                                                 consolelog_func();
    var name = document.getElementById('files_loginname_edit').innerHTML;
    var pass = document.getElementById('files_loginpass_edit').innerHTML;
    document.getElementById('signin_username').value = name;
    document.getElementById('signin_password').value = pass;
    document.getElementById('signin_submit').click();  
                  
    //utter(login_messages_en[user_access],0,0,0);
}
function files_signup(){                                                 consolelog_func();
    var name = document.getElementById('files_loginname_edit').innerHTML;
    var pass = document.getElementById('files_loginpass_edit').innerHTML;   
    var email = document.getElementById('files_loginmail_edit').innerHTML;   
	
	document.getElementById('signup_email').value = email;
	document.getElementById('signup_username').value = name;
    document.getElementById('signup_password').value = pass;
    document.getElementById('signup_submit').click();  
}


function files_logout(){                                                 consolelog_func();
    document.getElementById('logout_submit').click();
}
function files_login_remember(){                                         consolelog_func();
    files.username = document.getElementById('files_loginname_edit').innerHTML;
    files.userpass = document.getElementById('files_loginpass_edit').innerHTML;  
    files.userremember = true;
}

//-- misc ----------------------------------------------------------------
function files_edittext(id){                                             consolelog_func('darkblue');
	//var text = common.editor_text;
	var text = "";
    editor_run('files', text, id);
}

function files_set_zoom(order){                                          consolelog_func();
	if (order===undefined){ files.zoom = (files.zoom+1)%2; }             
    var bodyStyles = window.getComputedStyle(document.body);
    var elem = document.getElementById("zoom_box");               
    if (files.zoom===1){ 
        elem.style.visibility='hidden';
        document.getElementById('content_box').style.height = '105%';  
    }else{
        elem.style.visibility='visible';
        document.getElementById('content_box').style.height = common.style.textheight_zoom+'%'; 
    }                                                                    
    var name = files.zoom_arr[files.zoom];                               
    elem = document.getElementById('files_zoom'); 
    document.getElementById('zoom_box').style.height = (100 - common.style.textheight_zoom -2.3)+'%';
    document.getElementById('zoom_box').style.top = (common.style.textheight_zoom +3)+'%';
    if (elem) { 
		elem.innerHTML = files.zoom_arr[files.zoom]; 
		}
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
	//window.location.href = '/index.html'; 
}

//-- not used ----------------------------------------------------------------

function clean_tmp(){
	//window.location.href = '/script/cron.php';
	//document.getElementById('ffiles_test_submit').click(); 
	files_click_ajax("ffiles_test_submit");
}

function files_set_image(){                                              consolelog_func('brown');
	document.getElementById("body").className += " body_bkg_image";
	document.getElementById("buttons_area").className += " buttons_area_image";
	common.style.last_class = " buttons_image ";
	common.style.class_arr = ["", "", "", "", "", ""];
}

function files_disable(id){                                              consolelog_func();
    document.getElementById(id).onclick=''; 
    document.getElementById(id).className='buttons disabled';
}

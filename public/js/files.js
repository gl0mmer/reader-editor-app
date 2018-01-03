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
	subdir: "",
	editor_text: "",
	zoom_arr: ['no zoom', 'zoom'],
	home: '',
	in_contacts: false,
	in_messages: false,
	contacts: [],
	messages: [],
	contactname: '',
	userid: -1,
	
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
	get_fpath: function(i){
		//var path = files.home+files.dir+'/'+files.entries[i];
		var path = '';
		if (this.entrytype[i]=='file'){
			path = 'http://localhost/laravel-filemanager/files';
		}
		path += files.dir+'/'+files.entries[i];
		return path;
	},
}                                                        

//-- start ---------------------------------------------------------------
function files_start(){                                                  consolelog_func('darkblue');  
	
	if (cookie_get('isset_files_')!='isset'){                            
		cookie_set("isset_files_", "isset");
		common.cookie_save.call(files);
		common.cookie_save();
	}else { 
		common.cookie_load.call(files); 
		common.cookie_load();
	}
	
	//localStorage.setItem("in_reader", "no");
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

function files_set_image(){                                              consolelog_func('brown');
	document.getElementById("body").className += " body_bkg_image";
	document.getElementById("buttons_area").className += " buttons_area_image";
	common.style.last_class = " buttons_image ";
	common.style.class_arr = ["", "", "", "", "", ""];
}

//-- run functions -------------------------------------------------------

function files_update(){                                                 consolelog_func('darkblue');                                                                              
	                                                                     //console.log('In reader: '+localStorage.getItem("in_reader"))
	if (localStorage.getItem("in_reader")=='no'){
		
		files_show_buttons();                                                
		common_set_fontsize(common.f_fontsize_scale, files);                                                                                                             
		common.style.resize();
		files_show_files();
		files_scroll(files.iter, 'no'); 
		files_fill_zoom();
		//files_set_zoom('no'); 
		if (common.welcome=='do' && localStorage.getItem("show_welcome")==="yes" ){ 
			files_welcome();
			localStorage.setItem("show_welcome",'no');
		}
	}else{		
		useFile( localStorage.getItem("reader_fpath") ); 
	}
	console.log('Parent dir: '+getPreviousDir());
}                                                            

function files_ajax_enter(){                                             consolelog_func("orange"); 
	var path = files.get_fpath(files.iter);                               
	
	if (files.entries[files.iter]=='mail') {                             // show contacts
		goTo( path );
		document.getElementById('show_contacts').click();
	}else if (files.in_contacts && files.iter==0){                       // exit contacts
		//loadItems();
		document.getElementById('show_home').click();
	}
	else if (files.entrytype[files.iter]=='file'){                       // open file
		if (files.in_contacts){                                                 //console.log('Contact: '+files.paths[files.iter]);
			document.getElementById('contact_'+files.paths[files.iter]).click();
		}else{
			localStorage.setItem("reader_shortpath", files.dir+'/'+files.entries[files.iter]);
			useFile( path );  
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
	var new_name = files.editor_text;                                    //console.log('New fname: '+new_name);
	var i = files.entries.indexOf(new_name);
	
	if (new_name==''){
		alert = 'Name is empty.';
	}else if(i>-1 && (files.entrytype[i]=='folder' && type==0  || files.entrytype[i]=='file' && type==1 )){
		alert = 'File exists.';
	}else{
		if (type == 0){
			performLfmRequest('newfolder', {name: new_name})
			.done(refreshFoldersAndItems);                                   //console.log('New folder');
			alert = 'New folder is created.';
		}else if (type == 1){
			document.getElementById('create_filename').value = new_name;
			document.getElementById('create_submit').click();                //console.log('New .txt');
			alert = 'New text file is created.';
		}
	}
	common_show_notification(alert);
	files.editor_text = '';
}

function files_ajax_save(text){
	var fname = localStorage.getItem("reader_shortpath");     
	fname = fname.substring(1);
	fname = fname.substring(fname.indexOf('/'));                  
	            
	console.log('Fname: '+fname);
	document.getElementById('update_filename').value = fname;            console.log('Text: '+text);
	document.getElementById('update_filetext').value = text;
	document.getElementById('update_submit').click();                    //console.log('New .txt');
	alert = 'File was saved.';
	//common_show_notification(alert);
}

function files_ajax_rename(){
	var alert = 'Not allowed.';
	if (files.paths[files.iter]!=''){
		
		var item_name = files.entries[files.iter];
		var new_name = files.editor_text;
		var i = files.entries.indexOf(new_name);
		
		if (i>-1){
			alert = 'Name exists.';
		}else{
			performLfmRequest('rename', {
		        file: item_name,
		        new_name: new_name
		      }).done(refreshFoldersAndItems);
		    files.editor_text = '';
		    alert = 'Item was renamed.'
		}
	}
	common_show_notification(alert);
}

function files_ajax_delete(){
	var alert = 'Not allowed.';
	if (files.paths[files.iter]!=''){
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
	if (files.entrytype[files.iter]=='file' && files.paths[files.iter]!=''){
		var fname = files.entries[files.iter]; 
		download(fname);
	} 
}

function files_ajax_past(){                                              consolelog_func();
	var fname = localStorage.getItem("copy_path");                       console.log('Copy: '+fname);
	if (fname!=''){
		document.getElementById("copy_path").value = localStorage.getItem("copy_path");
		document.getElementById("copy_submit").click(); 
	}
}    
function files_copy(){                                                   consolelog_func();
	var alert = 'Not allowed.';
	if (files.paths[files.iter]!='' && files.entrytype[files.iter]=='file'){
		var fname = files.paths[files.iter];
		//if (files.entrytype[files.iter]=='folder'){
		//	fname = files.home+fname;
		//}
		localStorage.setItem("copy_path", fname);                        console.log(files.home+' | '+fname);
		document.getElementById("copy_path").value = fname;
		alert='Copied.';
	}
	common_show_notification(alert);
}

//-- show buttons ---------------------------------------------------------------------------
function files_resize(){                                                 consolelog_func("darkblue"); 
	common.style.resize();
	common_set_fontsize(common.f_fontsize_scale,files);
	files_show_buttons();
	files_show_files();
}

function files_show_buttons(){                                           consolelog_func();  
    var elem = document.getElementById('buttons_area');                  //console.log('files.iter: '+files.iter);
    var inner_e="";
    inner_e+= '<div onclick="files_show_menu();" '       +common.style.buttonpos(0,4)+'> menu </div>' ;
    inner_e+= '<div onclick="files_show_options();" '    +common.style.buttonpos(1,4)+'> opt </div>';
    //inner_e+= '<div id="ffiles_enter_submit"  onclick="files_click_ajax(this.id);" '+common.style.buttonpos(2,2)+'>'+symbol_enter+'</div></div>';
    inner_e+= '<div onclick="files_ajax_enter();" '           +common.style.buttonpos(2,2)+'>'+symbol_enter+'</div></div>';
    inner_e+= '<div onclick="files_show_login();" '      +common.style.buttonpos(4,2)+'>'+'log in'+'</div>' ;
    inner_e+= '<div onclick="files_ajax_upload();" '     +common.style.buttonpos(5,2)+'>upload</div>' ;
    inner_e+= '<div onclick="files_scroll(-2);" '   +common.style.buttonpos(3,4)+'>'+symbol_prev+'</div>' ;
    inner_e+= '<div onclick="files_scroll(-1);" '   +common.style.buttonpos(7,4)+'>'+symbol_next+'</div>' ;
    //inner_e+= '<div id="files_test"    onclick="clean_tmp();" '             +common.style.buttonpos(6,4)+'>clean_tmp</div>' ;
    //inner_e+= '<div id="files_python_button" class="buttons" onclick="files_click(10);"   style="'+reader_button_position(6)+'">py</div>';
    elem.innerHTML=inner_e;
         
}
function files_show_menu(){                                              consolelog_func();
	//document.getElementById("ffiles_copyfname_text").value = localStorage.getItem("copy_fname");
    //document.getElementById("ffiles_copyfdir_text").value = localStorage.getItem("copy_fdir"); 
	var inner_e = "";  var obj = 'files';
    inner_e += '<div id="common_lang_both_zoom"  onclick="" '  +common.style.buttonpos_menu(1,1,4,2,0,-1)+'>'+common.langbase+' +<br> '+common.lang+'</div>';
    inner_e += '<div onclick="common_show_lang(1)" '           +common.style.buttonpos_menu(2,0)+'>lang</div>';
    inner_e += '<div onclick="files_show_create();" '          +common.style.buttonpos_menu(7,0)+'>new file</div>';
    inner_e += '<div onclick="files_set_zoom();" '             +common.style.buttonpos_menu(3,0)+'>'+files.zoom_arr[files.zoom]+'</div>';
    inner_e += '<div onclick="files_cleancookie();" '          +common.style.buttonpos_menu(0,0)+'> delete cookie </div>';
    inner_e += '<div onclick="common_show_clickdelay();" '     +common.style.buttonpos_menu(4,0)+'> click delay </div>';
    inner_e += '<div onclick="common_show_fontsize('+obj+');" '+common.style.buttonpos_menu(6,0)+'> font size </div>';
    //inner_e += '<div id="files_sound"    onclick="" '+common.style.buttonpos_menu(4,3)+'> sound </div>';
    common_create_menu('files_menu', 0, inner_e);
}
function files_show_create(){                                            consolelog_func();
	var inner_e = "";
    inner_e += '<div '+common.style.buttonpos_menu(0,2)+'><div id="files_create_edit" onclick="files_edittext(this.id);" class="text_zoom menu_zoom">file name</div></div>';    
    inner_e += '<div onclick="files_ajax_create(1);" '+common.style.buttonpos_menu(6,0)+'>create txt</div>';
    inner_e += '<div onclick="files_ajax_create(0);" '+common.style.buttonpos_menu(4,0)+'>create dir </div>';
    common_create_menu('files_create', 1, inner_e);
}
function files_show_options(){                                           consolelog_func();
    var fname = files.get_fname();
    var text = fname;
    if (fname.lastIndexOf('.')!=-1) { text = fname.substring(0, fname.indexOf('.')); }
    files.editor_text = text;
    var inner_e = ""; 
    inner_e += '<div '+common.style.buttonpos_menu(0,2)+'><div id="files_options_edit" onclick="files_edittext(this.id);" class="text_zoom menu_zoom">'+text+'</div></div>';
    inner_e += '<div onclick="files_ajax_delete();" '  +common.style.buttonpos_menu(4,0)+'> delete </div>';
    inner_e += '<div onclick="files_ajax_rename();" '  +common.style.buttonpos_menu(7,0)+'> edit name </div>';
    //inner_e += '<div onclick="" '                      +common.style.buttonpos_menu(5,0)+'> html to txt </div>';
    inner_e += '<div onclick="files_ajax_download();"' +common.style.buttonpos_menu(3,0)+'> down- load </div>';
    inner_e += '<div onclick="files_ajax_past();" '    +common.style.buttonpos_menu(5,0)+'> past </div>';
    inner_e += '<div onclick="files_copy();" '    +common.style.buttonpos_menu(6,0)+'> copy </div>';    
    common_create_menu('files_options', 0, inner_e);
    //if (fname.indexOf('.html')==-1){files_disable('ffiles_cleanhtml_submit');}
}
function files_show_login(){                                             consolelog_func();
	var name="name", pass="password";
	if (files.userremember) {name = files.username; pass = files.userpass; }
    var inner_e="";
    inner_e+= '<div '+common.style.buttonpos_menu(0,2, 4,3)+'><div id="files_loginname_edit" onclick="files_edittext(this.id);" class="text_zoom menu_zoom">'+name+'</div></div>';
    inner_e+= '<div '+common.style.buttonpos_menu(4,2, 4,3)+'><div id="files_loginpass_edit" onclick="files_edittext(this.id);" class="text_zoom menu_zoom">'+pass+'</div></div>';
    inner_e+= '<div '+common.style.buttonpos_menu(2,2, 4,3)+'><div id="files_loginmail_edit" onclick="files_edittext(this.id);" class="text_zoom menu_zoom"> email </div></div>';
    inner_e+= '<div onclick="files_signin();" ' +common.style.buttonpos_menu(11,0,4,3)+'> Signin </div>';
    inner_e+= '<div onclick="files_signup();" ' +common.style.buttonpos_menu(9,0,4,3)+'> Signup  </div>';
    inner_e+= '<div onclick="files_logout();" ' +common.style.buttonpos_menu(10, 0,4,3)+'> Logout </div>';
    inner_e+= '<div onclick="files_login_remember();" ' +common.style.buttonpos_menu(8,0,4,3)+'> Remem- ber me</div>';
    inner_e+= '<div onclick="" '    +common.style.buttonpos_menu(6,3,4,3)+'> Delete </div>';
    inner_e+= '<div onclick="" '    +common.style.buttonpos_menu(7,3,4,3)+'> mail data </div>';
    common_create_menu('files_lodin', 0, inner_e);
}
function files_show_addcontact(){                                        consolelog_func();
	if (get_usrname(files.dir)=="guests"){
		common_show_notification('You need to log in to add contact.');
	}else{
		var inner_e="";
		inner_e += '<div '+common.style.buttonpos_menu(0,2)+'><div id="files_addmail_edit" onclick="files_edittext(this.id);" class="text_zoom menu_zoom"> new contact </div></div>';
		inner_e += '<div onclick="files_click_ajax(this.id);" '+common.style.buttonpos_menu(4,0)+'> add contact </div>';
		common_create_menu('files_addmail', 0, inner_e);
	}
}
function files_show_upload(){                                            consolelog_func();
    var inner_e = "";
    inner_e+= '<div '+common.style.buttonpos_menu(0,2)+'><div id="files_upload_name" onclick="" class="text_zoom menu_zoom"></div></div>';
    inner_e+= '<div onclick="files_ajax_upload(0);" '+common.style.buttonpos_menu(4,0)+'>select file</div>';
    inner_e+= '<div onclick="files_ajax_upload(1);" '+common.style.buttonpos_menu(6,0)+'>upload file</div>';
    common_create_menu('files_upload_area', 0, inner_e);      
}

//-- text display functions ---------------------------------------------------------------



function files_show_files(){                                             consolelog_func();
	var files_arr = files.entries;                                       console.log(files.entries);
	
	var wratio = window.innerWidth/window.innerHeight;                   //console.log('wratio: '+wratio+' '+window.innerWidth+' '+window.innerHeight);              
	var left_pc = -1; 
	var top_pc=-5.4; 
    var ywidth_pc=22; var yspace_pc=3.7;
    
    var content_width = common.style.get_content_width()/wratio/100*window.innerWidth; 
    var ywidth = ywidth_pc*window.innerHeight/100; 
    var yspace = yspace_pc*window.innerHeight/100;
    var top  = top_pc*window.innerHeight/100;
    var left = left_pc*window.innerWidth/100;
    
    var xwidth = ywidth*1;
    var xspace = yspace*0.7;
                                                          
    var xn = Math.floor((content_width-xspace*2)/(xspace+xwidth));       //console.log('xn: '+xn);	          
    if (xn<1){xn=1};
    var ratio = ( content_width - xwidth*xn )/(xspace*(xn+1.5));
    var pic_width = 0.6*xwidth;                                          //console.log('xwidth: '+xwidth+' ratio: '+ratio);
    xspace = xspace*ratio;
    var i=0; var type=''; 
    var inner_e = "";
	for (i=0; i<files_arr.length; i+=1){                                 
		var n_y = (i-i%xn)/xn;
	    var x = left+ xspace + (xspace+xwidth)* (i%xn);
	    var y = top + (ywidth+yspace)*n_y;  
	    
	    if (files.entrytype[i]=="folder") { 
			symbol = symbol_folder; 
			title = "dir";
		} else { 
			symbol = symbol_file; 
			title = "txt";
		}
		var style = 'position:absolute;top:'+y+'px; left:'+x+'px; height:'+ywidth+'px; width:'+xwidth+'px;';
		inner_e+= '<div id="fileid_'+i+'" onclick="files_scroll('+i+');"  class="files" style="'+style+'" title="'+title+'" >';
		inner_e+= '<div id="fileid_'+i+'_pic"  class="files_symbol" >'+symbol+'</div>';
		inner_e+= '<div id="fileid_'+i+'_name"  class="files_name" >'+files.entries[i]+'</div> </div>' ;
		//inner_e+= '<div id="fileid_'+i+'_pic"  class="files_pic files_'+title+'" >'+'</div>';
	}
	document.getElementById('files_array').style.visibility = 'visible';
	document.getElementById('files_array').innerHTML = inner_e;          //console.log(inner_e);
	common_set_fontsize(common.f_fontsize_scale, files);
	
	if (files.subdir=='mail'){                                           //console.log(files.subdir);                        
        var id = 'fileid_'+files.nentry;                                    
        document.getElementById(id).onclick=function() { files_show_addcontact(); } 
        document.getElementById(id+'_pic').innerHTML = symbol_addcontact;
	    document.getElementById(id+'_name').innerHTML = "add contact";    
	}
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

function files_fill_zoom(){                                              consolelog_func();
	//var dir = files.dir; 
	var dir = common_get_dir();
	var name = files.get_fname();                   
	if (get_usrname(dir)=="guests"){
		i1 = dir.indexOf('/',dir.indexOf('/')+1);
	    i2 = dir.indexOf('/',i1+1);                                     
		if (i2==-1) { i2 = dir.length; }                                 //console.log(i1+' - '+i2);
		dir = dir.substring(0,i1)+dir.substring(i2); 
	}
    //dir = '<em style="font-style:normal;color:#008000;opacity:0.6;">'+dir+'/ </em>';
    dir = '<em style="font-style:normal;color:black;opacity:0.3;">'+dir+'/ </em>';
    document.getElementById('zoom_text').innerHTML = dir+files.get_fname(); 
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

//-- account functions ------------------------------------------------------------------
function files_signin(){                                               consolelog_func();
    var name = document.getElementById('files_loginname_edit').innerHTML;
    var pass = document.getElementById('files_loginpass_edit').innerHTML;
    document.getElementById('signin_username').value = name;
    document.getElementById('signin_password').value = pass;
    document.getElementById('signin_submit').click();  
                  
    //utter(login_messages_en[user_access],0,0,0);
}
function files_signup(){                                           consolelog_func();
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

//-------------------------------------------------------------------------------
function files_edittext(id){                                             consolelog_func('darkblue');
	var text = files.editor_text;
    editor_run('files', text , id);
}
    
function files_disable(id){                                              consolelog_func();
    document.getElementById(id).onclick=''; 
    document.getElementById(id).className='buttons disabled';
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

function files_welcome(){
	var text = "Hi! <br>This website helps people to read and write. <br><br>";
	text+=     "Check 'readme.txt' file for details. ";
	text+=     "You will see it after closing this window. ";
	text+=     "To open the file click on the file icon and 'check' button to the right. ";
	
	if (document.getElementById('notification')){
		a=0;
	}else{
		common_show_notification(text, true, 1);
	}
	//utter_sentence(0, 1, 0, 1);
}

function clean_tmp(){
	//window.location.href = '/script/cron.php';
	//document.getElementById('ffiles_test_submit').click(); 
	files_click_ajax("ffiles_test_submit");
}

    
    

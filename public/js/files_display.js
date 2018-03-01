
//-- show buttons --------------------------------------------------------

function files_resize(){                                                 consolelog_func("darkblue"); 
	common.style.resize();
	common_set_fontsize(common.f_fontsize_scale,files);
	files_show_buttons();
	files_show_files();
}


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
		//console.log(i);
	}
	document.getElementById('files_array').style.visibility = 'visible';
	document.getElementById('files_array').innerHTML = inner_e;          //console.log(inner_e);
	common_set_fontsize(common.f_fontsize_scale, files);
	
	if (files.in_contacts==true){                                        //console.log('id',files_arr.length);                        
        var id = 'fileid_'+(files_arr.length-1).toString();              //console.log('id',id, files_arr.length-1); 
        document.getElementById(id).onclick=function() { files_show_addcontact(); } 
        document.getElementById(id+'_pic').innerHTML = symbol_addcontact;
	    document.getElementById(id+'_name').innerHTML = "add contact";    
	}
}

function files_fill_zoom(){                                              consolelog_func();
    var fname = common_make_fname( files.get_savepath(files.iter) );     //console.log('zoom: '+files.zoom);
    var dir = '<em style="font-style:normal;color:black;opacity:0.3;">'+fname[0]+' </em>';
    
    document.getElementById('zoom_text').innerHTML = dir+fname[1]; 
}   

//-- show buttons --------------------------------------------------------

function files_show_buttons(){                                           consolelog_func();  
    var elem = document.getElementById('buttons_area');                  
    var inner_e="";
    inner_e+= '<div onclick="files_show_menu();" '       +common.style.buttonpos(0,4)+'> menu </div>' ;
    inner_e+= '<div onclick="files_ajax_enter();" '      +common.style.buttonpos(2,2)+'>'+symbol_enter+'</div></div>';
    inner_e+= '<div onclick="files_show_login();" '      +common.style.buttonpos(4,2)+'>'+'log in'+'</div>' ;
    inner_e+= '<div onclick="files_scroll(-2);" '   +common.style.buttonpos(3,4)+'>'+symbol_prev+'</div>' ;
    inner_e+= '<div onclick="files_scroll(-1);" '   +common.style.buttonpos(7,4)+'>'+symbol_next+'</div>' ;
    if (files.in_contacts==false){
		inner_e+= '<div onclick="files_ajax_upload();" '     +common.style.buttonpos(5,2)+'>upload</div>' ;
		inner_e+= '<div onclick="files_show_options();" '    +common.style.buttonpos(1,4)+'> opt </div>';
	}
    //inner_e+= '<div id="files_test"    onclick="clean_tmp();" '             +common.style.buttonpos(6,4)+'>clean_tmp</div>' ;
    //inner_e+= '<div id="files_python_button" class="buttons" onclick="files_click(10);"   style="'+reader_button_position(6)+'">py</div>';
    elem.innerHTML=inner_e;
         
}
function files_show_menu(){                                              consolelog_func();
	var inner_e = "";  var obj = 'files';
    //inner_e += '<div id="common_lang_both_zoom"  onclick="" '  +common.style.buttonpos_menu(1,1,4,2,0,-1)+'>'+common.langbase+' +<br> '+common.lang+'</div>';
    inner_e += '<div onclick="common_show_lang(1)" '           +common.style.buttonpos_menu(2,0)+'>lang</div>';
    inner_e += '<div onclick="files_set_zoom();" '             +common.style.buttonpos_menu(3,0)+'>'+files.zoom_arr[files.zoom]+'</div>';
    inner_e += '<div onclick="files_cleancookie();" '          +common.style.buttonpos_menu(0,0)+'> clean cookie </div>';
    inner_e += '<div onclick="common_show_clickdelay();" '     +common.style.buttonpos_menu(4,0)+'> click delay </div>';
    inner_e += '<div onclick="common_show_fontsize('+obj+');" '+common.style.buttonpos_menu(6,0)+'> font size </div>';
    inner_e += '<div onclick="" '                              +common.style.buttonpos_menu(1,3)+'> sound </div>';
    if (files.in_contacts==false){
		inner_e += '<div onclick="files_show_create();" '          +common.style.buttonpos_menu(7,0)+'>new file</div>';
	}
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
function files_show_addcontact(){                                        consolelog_func(); console.log('Show_add_contact');
	if (get_usrname(files.dir)=="guests"){
		common_show_notification('You need to log in to add contact.');
	}else{
		var inner_e="";
		inner_e += '<div '+common.style.buttonpos_menu(0,2)+'><div id="files_addcontact_edit" onclick="files_edittext(this.id);" class="text_zoom menu_zoom"> new contact </div></div>';
		inner_e += '<div onclick="files_ajax_addcontact();" '+common.style.buttonpos_menu(4,0)+'> add contact </div>';
		common_create_menu('files_addcontact', 0, inner_e);
	}
}
function files_show_upload(){                                            consolelog_func();
    var inner_e = "";
    inner_e+= '<div '+common.style.buttonpos_menu(0,2)+'><div id="files_upload_name" onclick="" class="text_zoom menu_zoom"></div></div>';
    inner_e+= '<div onclick="files_ajax_upload(0);" '+common.style.buttonpos_menu(4,0)+'>select file</div>';
    inner_e+= '<div onclick="files_ajax_upload(1);" '+common.style.buttonpos_menu(6,0)+'>upload file</div>';
    common_create_menu('files_upload_area', 0, inner_e);      
}

//-- welcome notification ------------------------------------------------
    
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

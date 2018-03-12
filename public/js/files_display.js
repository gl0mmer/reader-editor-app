
//-- show buttons --------------------------------------------------------

function files_scroll(order, i_utter){                                   consolelog_func('darkblue');

	if (typeof files.iter != 'number'){ files.iter=0; files.iter_prev=0; } 
	   
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
    document.getElementById(files.get_fid()).className = 'files-hover';
    if (files.iter_prev != files.iter) {
		document.getElementById(files.get_fid(files.iter_prev)).className = 'files';
	}
    
    files_fill_zoom();
    scroll_to(files.get_fid(), 'content_box', title=0);
    
    if (iter==0){fname_ii='..';}
    else{fname_ii = files.get_fname(); }                                 
    fname_ii = fname_ii.replace(/_/g,' ');                               
    if (i_utter===undefined){ utter(fname_ii, 1); } 
    
    var name = files.get_subdir()+files.get_fname();                     //console.log('Opt name: '+name);
    var ifdisable = !(files.items_protected.indexOf(name)==-1 && files.iter!=0);
    common_disable_button("show_opt", ifdisable, function(){ files_show_options();} );   //console.log('Opt name: '+name, ifdisable);
         
}       

function files_resize(){                                                 consolelog_func("darkblue"); 
	common.style.resize();
	common_set_fontsize(common.f_fontsize_scale, 0);
	files_show_buttons();
	files_show_files();
	files_set_zoom('no'); 
}

function files_set_zoom(order){                                          consolelog_func();
	if (order===undefined){ files.zoom = (files.zoom+1)%2; }             
    var bodyStyles = window.getComputedStyle(document.body);
    var elem = document.getElementById("zoom_box");               
    if (files.zoom===1){ 
        elem.style.visibility='hidden';
        document.getElementById('content_box').style.height = 105*common.style.ry+'vh';  
    }else{
        elem.style.visibility='visible';
        document.getElementById('content_box').style.height = common.style.textheight_zoom*common.style.ry+'vh'; 
    }                                                                    
    var name = files.zoom_arr[files.zoom];                               
    document.getElementById('zoom_box').style.height = (100 - common.style.textheight_zoom -2.5)*common.style.ry+'vh';
    document.getElementById('zoom_box').style.top = (common.style.textheight_zoom +2.8)*common.style.ry+'vh';
    document.getElementById('zoom_box').style.fontSize = 11*common.style.rmin+'vh';
    document.getElementById('zoom_box').style.lineHeight = 18*common.style.rmin+'vh';
    
    var elem = document.getElementById('js_zoom'); 
    if (elem) { 
		elem.innerHTML = files.zoom_arr[files.zoom]; 
		}
}


function files_show_files(){                                             consolelog_func();
	var files_arr = files.entries;                                       //console.log(files.entries);
	
	var wratio = window.innerWidth/window.innerHeight;                   //console.log('wratio: '+wratio+' '+window.innerWidth+' '+window.innerHeight);              
	
	var left_pc = -1; 
	var top_pc=-5.4; 
    var ywidth_pc=22; var yspace_pc=3.7;
    
    var area = document.getElementById('files_scroll').getBoundingClientRect(); 
    //if (wratio>0){
	var content_width = common.style.get_content_width()/wratio/100*window.innerWidth;  
	//console.log('width: '+content_width+' '+window.innerWidth+' '+window.innerHeight+' | '+(area.right-area.left));
	//}else{ content_width = 1; }
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
	}
	document.getElementById('files_array').style.visibility = 'visible';
	document.getElementById('files_array').innerHTML = inner_e;          //console.log(inner_e);
	common_set_fontsize(common.f_fontsize_scale, 0);
	
}

function files_fill_zoom(){                                              consolelog_func();
    var fname = files.get_fname();
    var dir = user.name+'/ '+files.get_subdir();
    dir = '<em style="font-style:normal;color:black;opacity:0.3;">'+dir+' </em>';
    var elem = document.getElementById('zoom_text');
    if (elem){
		document.getElementById('zoom_text').innerHTML = dir+fname;
	} 
}   

//-- show buttons --------------------------------------------------------

function files_show_buttons(){                                           consolelog_func();  
    var elem = document.getElementById('buttons_area');                      
    var inner_e = button_html(0, 
		[['show_fmenu',   [0,4]],   ['show_login',   [4,2]],
		 ['ajax_enter',   [2,2]],   ['js_fprev',     [3,4]],
		 ['js_fnext',     [7,4]]
		]);
    if (files.in_contacts){
		inner_e+= button_html(0,   [['show_addcontact',[5,2]] ] );
	}else{
		inner_e+= button_html(0,   [['show_opt',     [1,4]], 
		                            ['show_create',  [5,2]]] );
        if (user.name=='admin'){
			inner_e+=button_html(0,[['show_sync',[6,2]] ] );
		}
	}
    elem.innerHTML=inner_e;       
}

function files_show_sync(){                                              consolelog_func();
	var inner_e = button_html(1, 
		[['ajax_sync_past', [4,0]], ['ajax_sync_rm',  [6,0]] ]);         // !!! error
	
	common_create_menu('files_sync', 0, inner_e);
	var copy_path = localStorage.getItem("copy_shortpath");              
    if (["", undefined, null].indexOf(copy_path)!=-1 ){
		common_disable_button("ajax_sync_past", true, function(){ files_ajax_past(1);});
	}
}
function files_show_menu(){                                              consolelog_func();
	var inner_e = button_html(1, 
		[['show_lang',      [2,0]], ['js_zoom',       [3,0]],
		 ['show_clickdelay',[4,0]], ['show_ffontsize', [5,0]],
		 ['show_sound',     [1,3]], ['show_bugfix',   [0,0]]  
		]);
    
    if (files.in_contacts){ 
		inner_e+= button_html(1,    [['ajax_mailexit', [7,0]] ]);    
	}else{
		inner_e+= button_html(1,    [['ajax_contacts', [7,0]] ]);    
	}       
    common_create_menu('files_menu', 0, inner_e);
    document.getElementById('js_zoom').innerHTML = files.zoom_arr[files.zoom]; 
}

function files_show_bugfix(){                                            consolelog_func();
	var inner_e = button_html(1, 
		[['js_cleancookie',  [0,0]], ['ajax_reinit',    [2,0]]
		]);
    common_create_menu('files_bugfix', 1, inner_e);
}

function files_show_create(){                                            consolelog_func();
	var inner_e = button_html(1, 
		[['edit_create',    [0,2]], ['ajax_newtxt',   [5,0]],
		 ['ajax_newdir',    [4,0]], ['ajax_upload',   [3,0]],
		 ['ajax_past',      [7,0]], 
		]);
    common_create_menu('files_create', 0, inner_e);
    
    var copy_path = localStorage.getItem("copy_shortpath");
    if (["", undefined, null].indexOf(copy_path)!=-1 ){
		common_disable_button("ajax_past", true, function(){ files_ajax_past();});
	}
}
function files_show_options(){                                           consolelog_func();
    var inner_e = button_html(1, 
		[['edit_filename',  [0,2]], ['ajax_totrash',  [4,0]],
		 ['ajax_rename',    [7,0]], ['js_copy',       [6,0]],
		 ['ajax_download',  [3,0]],
		]);
    common_create_menu('files_options', 0, inner_e);
    
    var fname = files.get_fname();
    if (fname.lastIndexOf('.')!=-1) { var text = fname.substring(0, fname.indexOf('.')); }
    else{ var text = fname; }
    document.getElementById('edit_filename').innerHTML = text;
}
function files_show_login(){                                             consolelog_func();
	var inner_e = button_html(1, 
		[['edit_username',  [0,2]], ['edit_userpass',   [4,2]],
		 ['edit_usermail',  [2,2]], ['ajax_signin',     [11,0]],
		 ['ajax_signup',    [9,0]], ['ajax_logout',     [10,0]],
		 ['js_rememberme',  [8,0]], ['ajax_deleteuser', [6,3]],
		 ['ajax_maildata',  [7,3]]
		], 3,4);
    common_create_menu('files_lodin', 0, inner_e);
    
    var name="name", pass="password";
	if (files.userremember) {name = files.username; pass = files.userpass; }
	var c = document.getElementById('edit_username').className;          
}
function files_show_addcontact(){                                        consolelog_func(); console.log('Show_add_contact');
	if (get_usrname(files.dir)=="guests"){
		common_show_notification('You need to log in to add contact.');
	}else{
		var inner_e = button_html(1, [['edit_contactname', [0,2]], ['ajax_addcontact', [4,0]] ]);
		common_create_menu('files_addcontact', 0, inner_e);
	}
}

//-- welcome notification ------------------------------------------------
    
function files_welcome(){
	var text = "Hi! <br>This website helps people to read and write. <br><br>";
	text+=     "Check 'Welcome.txt' file for details. ";
	text+=     "You will see it after closing this window. ";
	text+=     "To open the file click on the file icon and 'check' button to the right. ";
	
	if (document.getElementById('notification')){
		a=0;
	}else{
		common_show_notification(text, true, 1);
	}
	//utter_sentence(0, 1, 0, 1);
}

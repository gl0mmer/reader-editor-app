

if (localStorage.getItem("isset")!="true"){
	localStorage.setItem("isset", "true");
	localStorage.setItem("copy_path", "");
	localStorage.setItem("copy_working_dir", "");
	localStorage.setItem("copy_shortpath", "");
	localStorage.setItem("show_welcome", "yes");
	localStorage.setItem("working_dir", "");
	localStorage.setItem("delete_fname", "");
	localStorage.setItem("folder_path", "");
	localStorage.setItem("url", "");
	
	localStorage.setItem("in_reader", "no");
	localStorage.setItem("reader_fname", "");
	localStorage.setItem("reader_url", "");
	localStorage.setItem("reader_savepath", "");
}else{
	localStorage.setItem("show_welcome", "no");
}

var user = {
	id: 0,
	name: '',
	contact_name: '',
	contact_id: '',
};

var common = {
	langbase: "en",
	lang: "auto",
	editor_nlines_lvl0: 3,
	editor_nlines_lvl1: 2,
	b_fontsize_scale: 1,
	f_fontsize_scale: 1,
	r_fontsize_scale: 1,
	time_delay: 10,
	welcome: 'do',
	bkg_image: true,
	editor_text: '',
	ineditor: false,
	ischanged_text: false,
	utter_rate: 1,
	
	cookie_number: 15,
	browser: "",
	cookie_suffix: "_",
	name: "common",
	play_counter: 0,           
	utter_recursive_done: 1,           
	utter_playall: 0,          // in reader, play-all button
	repeat_text: '',           // used in common_show_notification() only
	in_messages: false,	
	time_click: 0,
	
	cookie_save: function(){                                             consolelog_func('brown');
	    var keys = Object.keys(this);                                    
	    var i;
	    for (i=0; i<this.cookie_number; i+=1){                             
	        cookie_set(keys[i]+this.cookie_suffix, this[keys[i]].toString() );  //console.log('save_cookie: '+i+' | '+this.cookie_suffix+' | '+this[keys[i]].toString());                    
		}
	},
	cookie_load: function(){                                             consolelog_func('brown');
	    var keys = Object.keys(this);                                    
	    var i; var v;
	    for (i=0; i<this.cookie_number; i+=1){                           
			v = cookie_get(keys[i]+this.cookie_suffix);                  //console.log('load_cookie: '+i+' | '+this.cookie_suffix+' | '+v);       
			if (v == 'true') { v=true; }
			else if (v == 'false') { v=false; }
			else if ( v.match(/\d+/g)!=null && v.match(/[a-z]/i)===null ) { 
				if (v.indexOf('.')==-1) { v=parseInt(v); }
				else { v=parseFloat(v); }   
			}         
			this[keys[i]] = v;                                           //console.log(keys[i]+' | '+v);
		}
	},
	style: {}	
}

common.style = {
    yn:4, btop:3.5, bbot:96.5, 
    xn:2, bright:98, xspace:4, dx_side:1,
    dy: 16.5, xy_ratio: 1.1,
    zoomheight: 20,
    textheight_zoom: 77,
    textheight: 97,
    b_shape: 1.1,
    b_width: 12, 
    b_height: 17,
    b_fontsize_base: 5,
    f_fontsize_base: 3.4,
    r_fontsize_base: 3.4,
    b_fontsize: 0,
    f_fontsize: 0,
    r_fontsize: 0,
    f_fontalpha: 1,
    r_fontalpha: 1,
    fontalpha_def: 0.58,
    fontalpha_def_b: 0.58,
    f_lineheight_base: 1.05,
    b_lineheight_base: 1.05,
    r_lineheight_base: 1.45,
    f_lineheight: 0,
    b_lineheight: 0,
    r_lineheight: 0,
    rx: 1.0, ry:1.0, rmin:1,
    cursorshift:0.25,
    
    init_font: function(scale, hscale){
		this.b_fontsize = scale*this.b_fontsize_base;
		this.f_fontsize = scale*this.f_fontsize_base;
		this.r_fontsize = scale*this.r_fontsize_base;
		this.b_lineheight = hscale*this.b_lineheight_base;
		this.f_lineheight = hscale*this.f_lineheight_base;
		this.r_lineheight = hscale*this.r_lineheight_base;
	},
    get_content_width: function(){                                       consolelog_func('brown');
		var wratio = window.innerWidth/window.innerHeight;
		var bright = wratio*this.bright;
		var dx = this.dy*this.b_shape; 
		var x =  (bright - 2*dx - 2*this.xspace) ; 
		return(x);
	},
    get_content_height: function(){                                       consolelog_func('brown');
		var wratio = window.innerWidth/window.innerHeight;
		var dy = this.dy/this.b_shape*wratio;                                        
	    var y =  this.bright - 2*dy - 2*this.xspace ; 
		return(y);
	},
    buttonpos: function(i, class_n){                                     //consolelog_func('brown');
		var wratio = window.innerWidth/window.innerHeight;
		if (class_n===undefined) {class_n=0;}
	    var bright = wratio*this.bright;           
	    var n_x = (i-i%this.yn)/this.yn;
	    
	    var dy = this.dy;
	    var dx = this.dy*this.b_shape; 
	    var yspace = (this.bbot-this.btop- this.yn*this.dy ) / (this.yn-1); 
	    var y =  this.btop + (i%this.yn)*(yspace+this.dy*1) ;
	    var x =  bright - (this.xn-n_x)*dx - (this.xn-n_x-1)*this.xspace ; 
	    dx = dx/wratio;  x=x/wratio;
	    
	    if (wratio<1){ 
			n_x = (n_x+1)%2;
			var bleft = (100-this.bbot);
			var dx = this.dy; 
			var dy = dx/this.b_shape*wratio;                                        
		    var xspace = (100-2*bleft - this.yn*this.dy ) / (this.yn-1); 
		    var x =  bleft + (i%this.yn)*(xspace+dx*1) ;
		    var y =  this.bright - (this.xn-n_x)*dy - (this.xn-n_x-1)*this.xspace ; 
		}
	    
	    var fontsize = this.b_fontsize*common.b_fontsize_scale;   
	    var style = 'left:'+x*this.rx+'vw; top:'+y*this.ry+'vh;'
				  + 'width:'+dx*this.rx+'vw; height:'+dy*this.ry+'vh;'
				  + 'border-width:'+fontsize*this.rmin*0.+'vmin;'
				  + 'border-bottom-width:'+this.dy*0+'vmin;'
				  + 'border-top-width:'+this.dy*0+'vmin;'
				  + 'font-size:'+fontsize*this.rmin+'vmin; line-height:'+fontsize*1.1*this.rmin+'vmin;';
		
	    return(style); 
	},
	
	buttonpos_menu: function(i, class_n, y_dim, x_dim){  //consolelog_func('brown'); 
		if (y_dim==undefined){ y_dim = 2; x_dim = 4; }
		if (class_n===undefined) {class_n=0;}
				
		var b_height = 17;
		var b_left = 10;  var b_right = 90; 
		var b_top = 10; var b_bot = 90;
		var wratio = window.innerWidth/window.innerHeight; 
		if (x_dim*y_dim==8){              
			if (wratio<1.3 && wratio>0.8){ x_dim=3; y_dim=3; }
			if (wratio>1.3 ){ x_dim=4; y_dim=2; }
			if (wratio<0.8 ){ x_dim=2; y_dim=4; }                           
		}else if (x_dim*y_dim==12){
			if (wratio<2.3 && wratio>1){ x_dim=4; y_dim=3; }
			if (wratio<1 && wratio>0.67){ x_dim=3; y_dim=4; }
			if (wratio>2.3 ){ x_dim=6; y_dim=2; }
			if (wratio<0.67 ){ x_dim=2; y_dim=6; } 
		}                                                                //console.log('wratio: '+wratio+' '+x_dim+' '+y_dim);
		var nx = i%(x_dim); var ny = (i-i%(x_dim))/x_dim;
		if (wratio<1){wratio = 1;}
		var dx = this.dy*this.b_shape/wratio;
		
		var add = 0.6;
		var x = b_left + (b_right-b_left)/(x_dim+add) *(nx+1-(1-add)/2) - dx/2.;
		var y = b_top +  (b_bot-b_top)/(y_dim+add) *(ny+1-(1-add)/2) - this.dy/2.;       //console.log(dx,this.dy,x,y);
		
		var fontsize = this.b_fontsize*common.b_fontsize_scale;   
		var lineheight = fontsize*1.2;                                   
		var borderwidth = fontsize*0.5;
		if (class_n===2) { 
			lineheight = lineheight+this.dy*this.ry/1.6; 
			dx = dx + (b_right-b_left)/(x_dim+add);
			borderwidth = 0;
		}        
		var style = 'left:'+x*this.rx+'vw; top:'+y*this.ry+'vh;'
				  + 'width:'+dx*this.rx+'vw; height:'+this.dy*this.ry+'vmin;'
				  + 'border-width:'+borderwidth*this.rmin+'vmin;'
				  + 'font-size:'+fontsize*this.rmin+'vmin; line-height:'+lineheight*this.rmin+'vmin;';  //console.log(style);
		 
		return(style);
	},
	
	resize: function(){                                                  consolelog_func('brown');
		this.rx = window.innerWidth/document.body.clientWidth;   
	    this.ry = window.innerHeight/document.body.clientHeight; 
	    common.style.init_font(0.9,1.1);
		var wratio = window.innerWidth/window.innerHeight;
		if (wratio>1){ this.rmin = this.ry; }
		else{ this.rmin = this.rx; }
		
		var z_height = this.zoomheight;
		if (wratio>1){
			var c_width = this.get_content_width();
			var b_left = c_width/wratio;
			c_width = b_left*0.96;
			var c_height = 100; 
			var b_top = 0; 
		}else{
			var c_height = this.get_content_height();
			var c_width = 100;
			var b_top= c_height;
			var b_left = 0; 
			z_height = z_height*wratio;
		}

		var elem = document.getElementById('content_box');
	    if (elem){ 
			elem.style.width= c_width*this.rx+'vw';                      
			elem.style.height= c_height*this.ry+'vh'; 
		}
	    var elem = document.getElementById('zoom_box');
	    if (elem){ 
			elem.style.width= c_width*this.rx+'vw'; 
			elem.style.height= z_height*this.ry+'vh'; 
			elem.style.top= (c_height-z_height)*this.ry+'vh';             
			elem.style.fontSize = 11*common.style.rmin+'vmin';
			elem.style.lineHeight = 18*common.style.rmin+'vmin';
		}
	    var elem = document.getElementById('buttons_area');
	    if (elem){ 
			elem.style.left= b_left*this.rx+'vw'; 
			elem.style.top= b_top*this.ry+'vh'; 
		} 
	    
	}	
}

//-- oncklick dict -------------------------------------------------------

var dict_onclick = {
	show_fmenu : 'files_show_menu();',
	show_rmenu : 'reader_show_menu();',
	show_opt: 'files_show_options();',
	show_clickdelay: 'common_show_clickdelay();',
	show_ffontsize: 'files_show_fontsize();',
	show_rfontsize: 'reader_show_fontsize();',
	show_create: 'files_show_create();',
	show_lang: 'common_show_lang(1);',
	show_sound: '',
	show_bugfix: 'files_show_bugfix();',
	show_login: 'files_show_login()',
	show_sync: 'files_show_sync();',
	show_addcontact: 'files_show_addcontact();',
	
	js_zoom: 'files_set_zoom();',
	js_fprev: 'files_scroll(-2);',
	js_fnext: 'files_scroll(-1);',
	js_rprev: 'reader_play_single(0);',
	js_rnext: 'reader_play_single(1);',
	ajax_enter: 'files_ajax_enter();',
	ajax_contacts: 'files_ajax_contacts();',
	ajax_readerexit: 'reader_exit();',
	ajax_mailexit: 'files_ajax_enter(-1)',
	
	js_copy: 'files_copy();',
	ajax_past: 'files_ajax_past();',
	ajax_rename: 'files_ajax_rename();',
	ajax_totrash: 'files_ajax_totrash();',
	//ajax_totrash: 'files_ajax_delete();',
	ajax_rm: 'files_ajax_delete();',
	ajax_download: 'files_ajax_download();',
	ajax_upload: 'files_ajax_upload();',
	ajax_newdir: 'files_ajax_create(0);', 
	ajax_newtxt: 'files_ajax_create(1);', 
	ajax_addcontact: 'files_ajax_addcontact();', 
	ajax_reinit: 'files_ajax_createinit();',
	js_cleancookie: 'files_cleancookie();',
	
	edit_create  : 'files_edittext(this.id);',
	edit_filename  : 'files_edittext(this.id);',
	edit_username  : 'files_edittext(this.id);', 
	edit_userpass  : 'files_edittext(this.id);', 
	edit_usermail  : 'files_edittext(this.id);', 
	edit_contactname  : 'files_edittext(this.id);', 
	
	ajax_logout     : 'files_logout();',
	ajax_signup     : 'files_signup();',
	ajax_signin     : 'files_signin();',
	ajax_maildata   : '',
	ajax_deleteuser : '',
	js_rememberme : 'files_login_remember();',
	
	ajax_sync_past: 'files_ajax_past(1);',
	ajax_sync_rm: 'files_ajax_delete(1);',
	
	show_mail: 'reader_show_mail();',
	show_navigate: 'reader_show_navigate();',
	show_readerzoom : 'reader_show_zoomtype();',
	js_edit: 'reader_editor();',
	js_readall: 'reader_play_all();',
	js_selecttype: 'reader_set_selecttype(1,1);',
	js_playpause: 'common_play_pause();',
	js_navigate: 'reader_navigate(this.id);',
	js_readerzoom: 'reader_set_zoomtype(0,this.id);',
	ajax_refresh: 'location.reload();',
	ajax_sendmail: 'reader_ajax_send();',
	show_editorfont: 'editor_show_fontsize();',
	js_editorfont: 'editor_set_fontsize(this.id,0);',
	show_utterrate: 'common_show_utterrate();',
	js_utterrate: 'common_set_utterrate(this.id);',
		
	js_lang: 'common_set_lang(this.id)',
	js_delay : 'common_set_clickdelay(this.id);',
	js_ffontsize : 'common_set_fontsize(this.id,0);',
	js_rfontsize : 'common_set_fontsize(this.id,1);',
}

//------------------------------------------------------------------------

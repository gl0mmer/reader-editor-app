

if (localStorage.getItem("isset")!="true"){
	localStorage.setItem("isset", "true");
	localStorage.setItem("copy_shortpath", "");
	localStorage.setItem("show_welcome", "yes");
	localStorage.setItem("delete_fname", "");       // remember fname after copying to trash
	localStorage.setItem("folder_path", "");        // to remember folder after reload
	localStorage.setItem("url", "");                // base url, for window.href
	
	localStorage.setItem("in_reader", "no");
	localStorage.setItem("reader_fname", "");
	localStorage.setItem("reader_url", "");         // to stay in reader after reload
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
	f_fontsize_scale: 1,
	r_fontsize_scale: 1,
	time_delay: 10,
	welcome: 'do',
	bkg_image: true,
	editor_text: '',
	ineditor: false,
	ischanged_text: false,
	utter_rate: 1,
	
	cookie_number: 14,
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
 
    f_fontalpha: 1,
    r_fontalpha: 1,
    fontalpha_def: 0.58,
    fontalpha_def_b: 0.58,
    
    f_fontsize: 3.06,
    r_fontsize: 3.06,
    f_lineheight: 1.16,
    r_lineheight: 1.56,
    b_fontsize_ratio: 1.25,
    rx: 1.0, ry:1.0, rmin:1,
    cursorshift:0.25,
    
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

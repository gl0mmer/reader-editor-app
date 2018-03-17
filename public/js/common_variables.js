

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

//------------------------------------------------------------------------

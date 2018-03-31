
function reader_resize(){
	style_resize();
	reader_show_buttons();
	reader_set_zoomtype(reader.zoomtype);
}

//-- reader scroll functions -------------------------------------------------------------------
 
function reader_scroll(order,stop,onend){                                consolelog_func('darkblue'); 
    iter = reader.iter;
    n_select_type = reader.selecttype;
    id_arr = reader.get_id_array();
    max_iter = id_arr.length;
    if (order==1 && iter < max_iter-1 ) { iter += 1; }
    else if (order==0 && iter > -1) { iter -=1; } 
    if (iter==-1){ id='file_title'; } 
    else { id=id_arr[iter]; }
    reader.iter = iter;
    reader.id_curr = id;                                                

    if (iter>id_arr.length-2){onend=0; common.utter_playall=0;}
    
    if (iter==-1){
        reader.latest_w  = id;
        reader.latest_s  = id;
        reader.latest_p  = id;
    }
    if ((order==1|| order==0) && iter>-1){
        if (n_select_type==0){ 
            reader.latest_w = id;
            reader.latest_s = id.substr(0,4);
            reader.latest_p = id.substr(0,2);
        } else if (n_select_type==1){ 
            reader.latest_w = id+"w0";
            reader.latest_s = id;
            reader.latest_p = id.substr(0,2);
        } else if (n_select_type==2){ 
            reader.latest_w = id+"s0w0";
            reader.latest_s = id+"s0";
            reader.latest_p = id;
            }
    }                                                                    //console.log('scroll: ', iter, common.play_counter, common.utter_recursive_done);
   
    reader_utter(stop_i=stop); 
    reader_highlite(); 
    scroll_to(id,'content_box', title=0);                   
    reader_fill_zoom();  
    
    var mail_noedit = false;
    if(reader.in_messages && $('#'+id).parents('#mail_editable').length === 0) { mail_noedit=true; } 
                                                                         
    var ifdisable = (iter==-1 || mail_noedit===true); 
    common_disable_button("js_edit", ifdisable, function(){ reader_editor();});
    
}    
function reader_utter(stop_i) {                                          consolelog_func(); 
    id = reader.get_id();                                                //console.log('reader onend: '+onend);
    iter = reader.iter;
    n_select_type = reader.selecttype;
    
	if (n_select_type!=2 || iter==-1 ){
		var text = document.getElementById(id).innerText;
		utter_sentence(text, stop_i); 
	}
	else { 
		first_iter = reader.sentence_id.indexOf(id+'s0');                  
		if ( iter==reader.paragraph_id.length-1 ){ last_iter=reader.sentence_id.length; }
		else { last_iter = reader.sentence_id.indexOf(reader.paragraph_id[iter+1]+'s0'); }  
		sentence_id_part = reader.sentence_id.slice(first_iter,last_iter);  
		utter_paragraph(id, sentence_id_part, stop_i); 
		 
	}
       
}
function reader_fill_zoom(){                                             consolelog_func(); 
    var n_zoom_type = reader.zoomtype;
    var text='empty';
    if (n_zoom_type==1){
        text = document.getElementById(reader.latest_w).innerHTML;
    }else if (n_zoom_type==2){
        text = document.getElementById(reader.latest_s).innerHTML;
    }                                                                    
    var elem=document.getElementById('zoom_text');
    elem.innerHTML=text;                                              
}
function reader_highlite(){                                              consolelog_func(); 
    var id_prev = reader.id_prev;                                    
    var id = reader.get_id();                                         
    var elem = document.getElementById(id_prev);
    if (elem){
		elem.className='text';
    }
    div = document.getElementById(id);                                   //console.log('Highlite id: '+id_prev+' | ' +id+' | '+reader.iter);                            
    if (div){
		div.className='text_highlite';      
	}                           
    reader.id_prev = id;
}

function reader_set_zoomtype(order){                                     //consolelog_func(); 
	var n_zoomtype = order;   
	reader.zoomtype = n_zoomtype;
	
	var elem = document.getElementById("zoom_box");     
    var pars = style_content_pars();
    var height = pars[0]-2*pars[5];
    if (n_zoomtype==0){ 
        elem.style.display='none';
    }else{
        elem.style.display='flex';
        height -= pars[2]; 
    }                                                                    
    
    reader_fill_zoom(); 
    document.getElementById('content_box').style.height = height*common.style.ry+'vh';    
	elem = document.getElementById('place_readerzoom');
    if (elem){ elem.innerHTML=dict.place_readerzoom[n_zoomtype]; }
    
}

//-- show buttons --------------------------------------------------------

function reader_show_buttons(){                                          consolelog_func(); 
    var buttons_arr = [ 
		 ['show_menu', 'reader_show_menu();',    [0,1,symbol_menu]],   
		 ['js_edit',    'reader_editor();',       [1,0, symbol_edit2]],
		 ['js_rprev',   'reader_play_single(0);', [3,0,symbol_prev]],   
		 ['js_rnext',   'reader_play_single(1);', [7,0,symbol_next]],
		 ['js_selecttype', 'reader_set_selecttype(1,1);', [2,0]],   
		 ['js_playpause',  'common_play_pause();',        [6,0,symbol_play]],
		 ['show_navigate', 'reader_show_navigate();',     [5,1,symbol_up_down]],   
		 ];
	if (reader.in_messages){
		buttons_arr.push( ['show_mail', 'reader_show_mail();',  [4,1,symbol_send]] );
	}else{
		buttons_arr.push( ['js_readall', 'reader_play_all();',  [4,0]] );
	}
    
    var elem = document.getElementById('buttons_area');
    elem.innerHTML = button_html(0, buttons_arr, 4,2);
    elem.style.display='block';    
    document.getElementById('js_selecttype').innerHTML = dict.js_selecttype[reader.selecttype];
}

function reader_show_menu(){                                             consolelog_func(); 
    var n_zoom = reader.zoomtype; var obj='reader';
    var inner_e = button_html(1, 
		[['show_fontsize',   'reader_show_fontsize();',  [5,0]],   
		 ['show_sound',      '',                         [2,3]],
		 ['show_lang',       'common_show_lang(1);',     [3,0]],   
		 ['show_readerzoom', 'reader_show_zoomtype();',  [6,0]],   
		 ['show_utterrate',  'common_show_utterrate();', [0,0]],
		 ['show_clickdelay', 'common_show_clickdelay();', [4,0]], 
		 //['ajax_refresh',    'location.reload();',       [1,0]], 
		]);
	if (reader.in_messages){ 
		inner_e+= button_html(1, [['ajax_readerexit', 'reader_exit();',   [7,0,symbol_people]] ]);   
	}else{
		inner_e+= button_html(1, [['ajax_readerexit', 'reader_exit();',   [7,0,symbol_home]] ]); 
	}
    common_create_menu('reader_menu', 0, inner_e);
    if (reader.in_messages){ 
		 document.getElementById('ajax_readerexit').innerHTML = symbol_people;
	}
}

function reader_show_navigate(){                                         consolelog_func(); 
	var inner_e = button_html(1, 
		[['js_navigate', 'reader_navigate(this.id);', [4,0], 0],   
		 ['js_navigate', 'reader_navigate(this.id);', [6,0], 1],
		 ['js_navigate', 'reader_navigate(this.id);', [7,0], 2]
		]);
    common_create_menu('reader_navigate', 0, inner_e);
}

function reader_show_zoomtype(){                                         consolelog_func(); 
    var inner_e = button_html(1, 
		[['place_readerzoom', '', [0,4]],   
		 ['js_readerzoom', 'reader_set_zoomtype(0);', [4,0], 0],
		 ['js_readerzoom', 'reader_set_zoomtype(1);', [5,0], 1],   
		 ['js_readerzoom', 'reader_set_zoomtype(2);', [6,0], 2]
		]);
    common_create_menu('reader_zoomtype', 1, inner_e);
    
    var n_zoom = reader.zoomtype;
    document.getElementById('place_readerzoom').innerHTML = dict.place_readerzoom[n_zoom];
}

function reader_show_mail(){                                             consolelog_func(); 
	var inner_e = button_html(1, 
		[['ajax_refresh', 'location.reload();',   [4,0]],   
		 ['ajax_sendmail', 'reader_ajax_send();', [7,0]],
		 ['ajax_mailexit',   'reader_exit(-1);', [3,0,symbol_home]]
		]);
    common_create_menu('reader_mail', 0, inner_e);
}

function reader_show_fontsize(){
	var onclick = 'common_set_fontsize(this.id,1);';
	var inner_e = button_html(1, 
		[['js_rfontsize', onclick,  [4,0], 0], 
		 ['js_rfontsize', onclick,  [5,0], 1],
		 ['js_rfontsize', onclick,  [6,0], 2], 
		 ['js_rfontsize', onclick,  [7,0], 3],
		 ['js_rfontsize', onclick,  [3,0], 4], 
		 ['js_rfontsize', onclick,  [2,0], 5],
		 ['place_fontsize', '',     [0,4]   ],
		]);
	
    common_create_menu('common_fontsize',1, inner_e);
    common_set_fontsize(common.r_fontsize_scale,1);
}  

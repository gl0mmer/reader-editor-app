

function reader_resize(){                                                consolelog_func('darkblue'); 
	common.style.resize();
	reader_show_buttons();
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
function reader_utter(stop_i) {                                   consolelog_func(); 
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


//-- show buttons --------------------------------------------------------

function reader_show_buttons(){                                          consolelog_func(); 
    var inner_e = button_html(0, 
		[['show_rmenu',    [0,1]],   ['js_edit',   [1,0]],
		 ['js_rprev',      [3,1]],   ['js_rnext',   [7,1]],
		 ['js_selecttype', [5,1]],   ['js_playpause', [6,1]],
		 ['show_navigate', [2,1]],   
		]);
		
	if (reader.in_messages){
		inner_e+= button_html(0,    [['show_mail',    [4,0]], ]);
	}else{
		inner_e+= button_html(0,    [['js_readall',   [4,0]], ]);
	}
    var elem = document.getElementById('buttons_area');
    elem.innerHTML=inner_e;
    document.getElementById('js_selecttype').innerHTML=reader.selecttext[reader.selecttype];
}

function reader_show_menu(){                                             consolelog_func(); 
    var n_zoom = reader.zoomtype; var obj='reader';
    var inner_e = button_html(1, 
		[['show_rfontsize',  [4,0]],   ['show_sound',      [0,3]],
		 ['show_lang',       [2,0]],   ['ajax_readerexit', [7,0]],
		 ['show_readerzoom', [3,0]],   ['show_utterrate', [6,0]],
		]);
    common_create_menu('reader_menu', 0, inner_e);
}

function reader_show_navigate(){                                         consolelog_func(); 
	var inner_e = button_html(1, 
		[['js_navigate',  [4,0], 0],   ['js_navigate',    [6,0], 1],
		 ['js_navigate',  [7,0], 2]
		]);
    common_create_menu('reader_navigate', 0, inner_e);
}
function reader_show_zoomtype(){                                         consolelog_func(); 
    var inner_e = button_html(1, 
		[['place_readerzoom',  [0,2]],   ['js_readerzoom',    [4,0], 0],
		 ['js_readerzoom',  [5,0], 1],   ['js_readerzoom',  [6,0], 2]
		]);
    common_create_menu('reader_zoomtype', 1, inner_e);
    
    var n_zoom = reader.zoomtype;
    document.getElementById('place_readerzoom').innerHTML = reader.zoomtype_arr[n_zoom];
}

function reader_show_mail(){                                             consolelog_func(); 
	var inner_e = button_html(1, 
		[['ajax_refresh',  [4,0]],   ['ajax_sendmail', [7,0]]
		]);
    common_create_menu('reader_mail', 0, inner_e);
}

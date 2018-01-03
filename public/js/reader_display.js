

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

    if (id_arr.length-1===iter){onend=0;}
    
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
    }
    reader_utter(stop_i=stop, onend); 
    reader_highlite(); 
    scroll_to(id,'content_box', title=0);                   
    //scroll_to(id,'text_zoom_box',title=1); alert('scroll 2');
    reader_fill_zoom();  
    
    var mail_notedit = false;
    if(files.in_messages && $('#'+id).parents('#mail_editable').length === 0) { mail_notedit=true; } 
    //console.log('scroll iter: '+iter+'  '+mail_notedit);
    if (iter==-1 || mail_notedit===true){ edit_function = ''; edit_class='buttons disabled'; 
        document.getElementById('reader_edit').className='buttons symbol disabled';
        document.getElementById('reader_edit').setAttribute( "onclick", '' );
    } else {
        document.getElementById('reader_edit').className='buttons symbol';
        document.getElementById('reader_edit').setAttribute( "onclick", 'reader_editor(reader_edit)' );
    }
}    
function reader_utter(stop_i, onend) {                                   consolelog_func(); 
    id = reader.get_id();
    iter = reader.iter;
    n_select_type = reader.selecttype;
    if (n_select_type==0 || iter==-1 ){ utter(document.getElementById(id).innerText, stop=stop_i, onend); }
    else {
        if (n_select_type==2){ 
            first_iter = reader.sentence_id.indexOf(id+'s0');                  
            if ( iter==reader.paragraph_id.length-1 ){ last_iter=reader.sentence_id.length; }
            else { last_iter = reader.sentence_id.indexOf(reader.paragraph_id[iter+1]+'s0'); }  
            sentence_id_part = reader.sentence_id.slice(first_iter,last_iter);  
            utter_paragraph(id, sentence_id_part, stop_i, onend); 
             
        }
        if (n_select_type==1){ 
			var text = document.getElementById(id).innerText;
			utter_sentence(text, stop_i, onend); 
		}
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
    div = document.getElementById(id);                                   //console.log('Highlite id: '+id_prev+' | ' +id);                            
    div.className='text_highlite';                                 
    reader.id_prev = id;
}


//-- show buttons --------------------------------------------------------

function reader_show_buttons(){                                          consolelog_func(); 
	var types = ['select <br> -','select <br> - -','select <br> - - -']; 
    var iter = reader.iter;                                              //console.log('iter: '+iter+' '+reader.readonly);
    if (iter==-1 || reader.readonly){ edit_function = ''; edit_class='buttons symbol disabled'; }
    else { edit_function='onclick="reader_editor(reader_edit);"'; edit_class='buttons symbol'; }
    
    elem = document.getElementById('buttons_area');
    inner_e = '<div id="reader_menu" onclick="reader_show_menu();" '+common.style.buttonpos(0,4)+'>menu</div>' ;
    inner_e+= '<div id="reader_edit" class="'+edit_class+'" '+edit_function+' '+common.style.buttonpos(1,2)+'>edit</div>' ;
    inner_e+= '<div id="reader_selecttype" onclick="reader_set_selecttype(1,1);" '+common.style.buttonpos(5,4)+'>'+types[reader.selecttype]+'</div>' ;
    inner_e+= '<div id="prev" onclick="reader_scroll(0,1,0);" '+common.style.buttonpos(3,4)+'>'+symbol_prev+'</div>' ;
    inner_e+= '<div id="next" onclick="reader_scroll(1,1,0);" '+common.style.buttonpos(7,4)+'>'+symbol_next+'</div>' ;
    
    //inner_e+= '<div id="reader_speed"     class="buttons" onclick=""  style="'+reader_button_position(4)+'">'+symbol_speed+'</div>' ;
    inner_e+= '<div id="playpause"   onclick="reader_play_pause();" '         +common.style.buttonpos(6,4)+'>'+symbol_play+'</div>' ;
    inner_e+= '<div id="reader_navigate"   onclick="reader_show_navigate()" ' +common.style.buttonpos(2,4)+'>'+symbol_up_down+'</div>' ;
    
    if (files.messages){
		inner_e+= '<div id="reader_mail" onclick="reader_show_mail();" '   +common.style.buttonpos(4,2)+'>'+symbol_mail+'</div>' ;
	}else{
		inner_e+= '<div id="readall"     onclick="reader_scroll(-1,1,1);"' +common.style.buttonpos(4,4)+'>read all</div>' ;
	}
    elem.innerHTML=inner_e;
}
function reader_show_navigate(){                                         consolelog_func(); 
	elem = document.getElementById('nvigate_area');
	inner_e = '';
	inner_e+= '<div id="navigate_0" onclick="reader_navigate(0);" '+common.style.buttonpos_menu(4,0)+'> start </div>' ;
	inner_e+= '<div id="navigate_1" onclick="reader_navigate(0.5);" '+common.style.buttonpos_menu(6,0)+'> mid </div>' ;
	inner_e+= '<div id="navigate_2" onclick="reader_navigate(1);" '+common.style.buttonpos_menu(7,0)+'> end </div>' ;
    common_create_menu('reader_navigate', 0, inner_e);
}

function reader_show_menu(){                                             consolelog_func(); 
    var n_zoom = reader.zoomtype; var obj='reader';
    inner_e = '';
    inner_e+= '<div id="reader_fontsize"        onclick="common_show_fontsize('+obj+');" '+    common.style.buttonpos_menu(0,0)+'> font size </div>';    
    inner_e+= '<div id="reader_menu_sound"      onclick="" ' +common.style.buttonpos_menu(4,3)+'>sound</div>';
    inner_e+= '<div id="common_lang_both_zoom"  onclick="" ' +common.style.buttonpos_menu(1,1,4,2,0,-1)+'>'+common.langbase+' +<br> '+common.lang+'</div>';
    inner_e+= '<div id="common_lang"            onclick="common_show_lang(1);" '+common.style.buttonpos_menu(2,0)+'>lang</div>';
    inner_e+= '<div id="reader_go"              onclick="" '+common.style.buttonpos_menu(3,3)+'>go</div>' ;
    //inner_e+= '<div id="reader_menu_go-files"   onclick="goto_files();" '+common.style.buttonpos_menu(7,0)+'">go home</div>';
    inner_e+= '<div id="reader_menu_go-files"   onclick="reader_exit();" '+common.style.buttonpos_menu(7,0)+'">go home</div>';
    inner_e+= '<div id="reader_menu_zoomtype_text" '+common.style.buttonpos_menu(5,1,4,2,0,-1)+'>'+reader.zoomtype_arr[n_zoom]+'</div>' ;
    inner_e+= '<div id="reader_menu_zoomtype"   onclick="reader_show_zoomtype();" '+common.style.buttonpos_menu(6,0)+'>zoom</div>' ;
    common_create_menu('reader_menu', 0, inner_e);
}
function reader_show_zoomtype(){                                         consolelog_func(); 
    n_zoom = reader.zoomtype;
    inner_e = '<div id="reader_zoomtype_zoombox" '+common.style.buttonpos_menu(0,2)+'><div id="reader_zoomtype_zoom" class="text_zoom menu_zoom">'+reader.zoomtype_arr[n_zoom]+'</div></div>';
    inner_e+= '<div id="0"   onclick="reader_set_zoomtype(this.id)" '+common.style.buttonpos_menu(4,0)+'> no zoom </div>';
    inner_e+= '<div id="1"   onclick="reader_set_zoomtype(this.id)" '+common.style.buttonpos_menu(5,0)+'> by word </div>';
    inner_e+= '<div id="2"   onclick="reader_set_zoomtype(this.id)" '+common.style.buttonpos_menu(6,0)+'> by sentence </div>';
    common_create_menu('reader_zoomtype', 1, inner_e);
}


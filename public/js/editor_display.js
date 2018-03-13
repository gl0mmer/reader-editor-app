

function editor_backto_start(){                                          consolelog_func(); 
    editor.style.set_style('bottom_2rows');
    document.getElementById('editor_buttons_area_0').style.visibility='visible';
    document.getElementById('editor_buttons_area_1').style.visibility='hidden';
}
function editor_backto_letters(change_style){                            consolelog_func(); 
    if (change_style==1){ editor.style.set_style('bottom_3rows'); }
    document.getElementById('editor_buttons_area_1').style.visibility='visible';
    document.getElementById('editor_buttons_area_2').style.visibility='hidden';
    document.getElementById('editor_buttons_area_3').style.visibility='hidden';
    document.getElementById('editor_text_box').style.width='96%';
    editor.pin_letters = 0;
    //editor_capital(0,0,1);
}

function editor_capital(setcaps, lock, reset){                           consolelog_func(); 
	if (setcaps===undefined) {setcaps=0;}
	if (lock===undefined) {lock=0;}
	if (reset===undefined) {reset=0;}
	
	if (reset===1) {editor.caps=0;}
	if (setcaps===1) {	
		if (lock===0){ editor.caps = (editor.caps+1)%2; }
		else { editor.capslock=(editor.capslock+1)%2; }
	}                                                                 
	var arr = document.getElementsByClassName("symbol");
	var inner = ""; var i = 0;
	for (i=0; i<arr.length; i+=1){
		inner = arr[i].innerHTML;
		if ( /^[a-zA-Z]+$/.test(inner) || /^[а-яА-Я]+$/.test(inner) ) { 
			if (editor.caps+editor.capslock===1) { arr[i].innerHTML = inner.toUpperCase(); }
			else                                 { arr[i].innerHTML = inner.toLowerCase(); }
		}
	}	
	if (setcaps===1 && editor.pin_letters===0) { editor_backto_letters(); }
}

//-- show buttons ---------------------------------------------------------------

function editor_show_start(){                                            consolelog_func(); 
    elem = document.getElementById('editor_buttons_area');
    inner_e0 = "<div id='editor_buttons_area_0'>";
    //inner_e0+= '<div id="editor_numbers"    onclick="editor_show_symbols(1,0);" '+editor.style.get_button(3,1) +'> xyz </div>';
    inner_e0+= '<div id="editor_numbers"    onclick="editor_show_symbols(0,0);" '+editor.style.get_button(3,1) +'> 123 </div>';
    inner_e0+= '<div id="editor_letters_en" onclick="editor_show_symbols(4,0);" '+editor.style.get_button(9,1) +'> abc </div>';
    inner_e0+= '<div id="editor_letters_ru" onclick="editor_show_symbols(5,0);" '+editor.style.get_button(10,1)+'> абв </div>';
    //inner_e0+= '<div id="editor_letters_ru" onclick="editor_show_symbols(2,0);" '+editor.style.get_button(11,1)+'>'+symbol_nextpage3+'</div>';
    inner_e0+= '<div id="editor_letters_ru" onclick="" '                         +editor.style.get_button(4,3)+'>'+symbol_nextpage3+'</div>';
    inner_e0+= '<div id="editor_navigate"   onclick="editor_show_navigate(0);" ' +editor.style.get_button(5)   +'>'+symbol_prev_next+'</div>';
    inner_e0+= '<div id="editor_exit"       onclick="editor_exit();" '           +editor.style.get_button(6)  +'> exit </div>';
    inner_e0+= '<div id="editor_menu"       onclick="editor_show_menu();" '      +editor.style.get_button(2)   +'> menu </div>';
    inner_e0+= '<div id="editor_save"       onclick="editor_save();" '           +editor.style.get_button(8)   +'> save </div>';
    //inner_e0+= '<div id="editor_copy"       onclick="" ' +editor.style.get_button(7,3) +'> copy </div>';
    inner_e0+= '<div id="editor_past"       onclick="" ' +editor.style.get_button(1,3) +'> copy past </div>';
    //inner_e0+= '<div id="editor_go"         onclick="" ' +editor.style.get_button(0,3) +'> go </div>';
    inner_e0+= "</div>"
    inner_e1 = "<div id='editor_buttons_area_1'></div>";
    inner_e2 = "<div id='editor_buttons_area_2'></div>";
    inner_e3 = "<div id='editor_buttons_area_3'></div>";
    inner_e4 = "<div id='editor_buttons_area_4'></div>";
    elem.innerHTML = inner_e0+inner_e1+inner_e2 + inner_e3 + inner_e4;
}
function editor_show_menu(){                                             consolelog_func(); 
	var inner_e = button_html(1, 
		[['show_lang',  [5,0]], ['show_editorfont',   [6,0]]
		]);
    common_create_menu('editor_menu', 0, inner_e,'editor_created_elements', true);
}
function editor_show_fontsize(){                                         consolelog_func(); 
	var inner_e = button_html(1, 
		[['js_editorfont',  [4,0],0], ['js_editorfont',   [5,0],1],
		 ['js_editorfont',  [6,0],2], ['js_editorfont',   [7,0],3]
		]);
    common_create_menu('editor_fontsize', 1, inner_e, 'editor_created_elements', true);
}
    
function editor_show_symbols(lang, lvl){                                 consolelog_func(); 
    editor.style.set_style('bottom_3rows');
    editor.style.b_nx=7;
    
    var symbol1, symbol2;
	if (lang===0)      { symbol1 = symbol_nextpage3; symbol2 = symbol_nextpage1; }
	else if (lang===1) { symbol1 = symbol_nextpage2; symbol2 = symbol_nextpage3; }
	else               { symbol1 = symbol_nextpage1; symbol2 = symbol_nextpage2; }
	if (lang===5) { symbol1 = 'эюя'; }
    
    key_arr = editor.dict.symbolset7_all()[lang][lvl];                 
    inner_e = ''; i=0; 
    if (lvl==0){                                                      
        inner_e+= editor.style.button_delete(6);
        inner_e+= editor.style.button_prev(19);
        inner_e+= editor.style.button_next(20);
        inner_e+= '<div id="editor_spell"    onclick="editor_spell();" '       +editor.style.get_button(0) +'> spell </div>' ;
        inner_e+= '<div id="editor_letters_p1" onclick="editor_show_symbols('+lang+',1);" ' +editor.style.get_button(13) +'>'+symbol1+'</div>';
        inner_e+= '<div id="editor_letters_p2" onclick="editor_show_symbols('+lang+',2);" ' +editor.style.get_button(7)  +'>'+symbol2+'</div>';
        if (editor.parent==="files"){ inner_e+= editor.style.button_exit(14); }
		else {                        inner_e+= editor.style.button_backto_start(14); }
        reserved=[5,6, 13,14,20];                                     
        reserved=[0,6,7, 13,14,20,19];                                    
    }else {
        inner_e+= editor.style.button_backto_letters(14,1);
        if (lvl===2)  { 
			inner_e+= '<div id="editor_letters_p1" onclick="editor_show_symbols('+lang+',1);" ' +editor.style.get_button(13) +'>'+symbol1+'</div>'; 
			inner_e+= '<div id="editor_capslock" onclick="editor_capital(1,1,0);" ' +editor.style.get_button(6)  +'> caps lock </div>';
			inner_e+= '<div id="editor_caps" onclick="editor.pin_letters=1;" ' +editor.style.get_button(7) +'> pin tab </div>';
			reserved=[14,6,7,13];
		}else if (lvl===1)  { 
			inner_e+= '<div id="editor_caps"     onclick="editor_capital(1,0,0);" ' +editor.style.get_button(20) +'> caps </div>';
			inner_e+= '<div id="editor_letters_p1" onclick="editor_show_symbols('+lang+',2);" ' +editor.style.get_button(7) +'>'+symbol2+'</div>'; 
			inner_e+= '<div id="editor_caps" onclick="editor.pin_letters=1;" ' +editor.style.get_button(13) +'> pin tab </div>';
			reserved=[14,7,20,13];
		}
    }                                                                  
    for (ii=0; ii<editor.style.b_nx*editor.style.b_ny; ii++){
        if (reserved.indexOf(ii)==-1 && i<key_arr.length){
            i_name = key_arr[i];
            i_name_button = editor.dict.allchar_buttons()[key_arr[i]];  
            style = editor.style.get_button(ii, 1);                    
            keys = Object.keys(editor.dict.allchar() ); nn=keys.indexOf(i_name).toString();
            inner_e += '<div id="editor_letter_'+i_name+'" onclick="editor_set_letter('+nn+');"  '+style+'>'+i_name_button+'</div>';
            i+=1;
        } 
    }
    if (lvl==0){
        document.getElementById('editor_buttons_area_0').style.visibility='hidden';
        elem = document.getElementById('editor_buttons_area_1');
    }else{
        document.getElementById('editor_buttons_area_1').style.visibility='hidden';
        elem = document.getElementById('editor_buttons_area_2');
    }elem.style.visibility='visible';
    elem.innerHTML = inner_e;                                      
    editor_capital(0,1);
}

function editor_show_navigate(lvl){                                      consolelog_func(); 
	var elem; var inner_e = "";
	editor.style.set_style('bottom_2rows',7);
    inner_e+= editor.style.button_delete(6);
    inner_e+= editor.style.button_prev(10);
    inner_e+= editor.style.button_next(12);
    inner_e+= '<div id="editor_prevword" onclick="editor_scrollword(0);" ' +editor.style.get_button(9) +'>' +symbol_prev_prev  +'</div>' ;
	inner_e+= '<div id="editor_nextword" onclick="editor_scrollword(1);" ' +editor.style.get_button(13)+'>' +symbol_next_next +'</div>' ;
    inner_e+= '<div id="editor_up"       onclick="editor_scrollvert(0);" ' +editor.style.get_button(4) +'>' +symbol_up        +'</div>' ;
	inner_e+= '<div id="editor_down"     onclick="editor_scrollvert(1);" ' +editor.style.get_button(11) +'>' +symbol_down      +'</div>' ;
	inner_e+= '<div id="editor_sound"    onclick="editor_sound();" '       +editor.style.get_button(2) +'>' +symbols_sound[editor.sound_navigator] +'</div>' ;
	inner_e+= '<div id="editor_spell"    onclick="editor_spell();" '       +editor.style.get_button(8) +'> spell </div>' ;
	inner_e+= '<div id="editor_ctrlz"    onclick="editor_ctrlz();"  '      +editor.style.get_button(0,3) +'>' +symbol_undo +'</div>' ;
	inner_e+= '<div id="editor_ctrly"    onclick="editor_ctrly();"  '      +editor.style.get_button(1,3) +'>' +symbol_redo +'</div>' ;
    inner_e+= '<div id="editor_show_letter" '+editor.style.get_button(5,2)+'>_</div>';
    if (lvl===0){ 
		inner_e+= editor.style.button_backto_start(7);
		document.getElementById('editor_buttons_area_0').style.visibility='hidden';
		elem = document.getElementById('editor_buttons_area_1');
	}else{ 
		inner_e+= editor.style.button_backto_letters(7,1);
		document.getElementById('editor_buttons_area_1').style.visibility='hidden';
		elem = document.getElementById('editor_buttons_area_2');
	}
    elem.style.visibility='visible';
    elem.innerHTML = inner_e;
}


function create_element(id, cl, parent, style, inner){                   //consolelog_func(); 
    if (parent===undefined){ parent = 'created_elements'; }
    var element = document.createElement('div');
    element.setAttribute('id', id);
    element.setAttribute('class', cl);
    if (style!=undefined) { element.setAttribute('style', style); }
    if (inner!=undefined) { element.innerHTML=inner; }
    document.getElementById(parent).appendChild(element);
    return (element);
}

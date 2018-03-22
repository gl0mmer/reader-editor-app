
function editor_resize(){
	style_resize();
	var state = editor.style.state;
	if (state[0]=='start'){ editor_show_start(); editor_set_fontsize(editor.style.nlines_lvl0, 0);  }
	else { editor_show_symbols(state[1], state[2]); editor_set_fontsize(editor.style.nlines_lvl1, 1); }
	editor_set_cursor();
}

function editor_backto_start(){                                          consolelog_func(); 
	editor.style.state = ['start',0,0];
    editor.style.set_nrow(2,0);
    document.getElementById('editor_buttons_area_0').style.visibility='visible';
    document.getElementById('editor_buttons_area_1').style.visibility='hidden';
}
function editor_backto_letters(change_style){                            consolelog_func(); 
    if (change_style==1){ 
		editor.style.set_nrow(3,1);
	}
    document.getElementById('editor_buttons_area_1').style.visibility='visible';
    document.getElementById('editor_buttons_area_2').style.visibility='hidden';
    document.getElementById('editor_buttons_area_3').style.visibility='hidden';
    document.getElementById('editor_text_box').style.width='96%';
    editor.pin_letters = 0;
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

function editor_show_start(){                                            consolelog_func(); console.log('show_start');
	editor.style.state = ['start',0,0];
	var buttons_arr = [ 
		 ['ajax_editorexit', 'editor_exit();',  [5,3]], 
		 ['ajax_editorsave', 'editor_save();',  [1,3]], 
		 ['show_menu', 'editor_show_menu();',   [4,3]], 
		 ['', 'editor_show_symbols(0,0);',   [2,2,'123']], 
		 ['', 'editor_show_symbols(4,0);',   [7,2,'abc']], 
		 ['', 'editor_show_symbols(5,0);',   [8,2,'абв']], 
		 ['', 'editor_show_navigate(0);',    [9,3,symbol_prev_next]], 
		 ['', '',                            [0,5,'copy past']], 
		 ['', '',                            [3,4,symbol_nextpage3]], 
		 ]; 
	var inner_e0 = "<div id='editor_buttons_area_0'>" + button_html(0, buttons_arr, 2,5, true) + "</div>";
    
    var elem = document.getElementById('editor_buttons_area');
    inner_e1 = "<div id='editor_buttons_area_1'></div>";
    inner_e2 = "<div id='editor_buttons_area_2'></div>";
    inner_e3 = "<div id='editor_buttons_area_3'></div>";
    inner_e4 = "<div id='editor_buttons_area_4'></div>";
    elem.innerHTML = inner_e0+inner_e1+inner_e2 + inner_e3 + inner_e4;   //console.log(elem.innerHTML);
}
    
function editor_show_symbols(lang, lvl){                                 consolelog_func(); 
    var state = editor.style.state;
    if (state[0]!='letters' || state[1]!=lang || state[2]!=lvl){         //console.log('State');
		editor.style.state = ['letters',lang,lvl];
		editor.style.set_nrow(3,1);
	}
    var b_nx=7;
    
    var symbol1, symbol2;
	if (lang===0)      { symbol1 = symbol_nextpage3; symbol2 = symbol_nextpage1; }
	else if (lang===1) { symbol1 = symbol_nextpage2; symbol2 = symbol_nextpage3; }
	else               { symbol1 = symbol_nextpage1; symbol2 = symbol_nextpage2; }
	if (lang===5) { symbol1 = 'эюя'; }
    
    key_arr = editor_get_symbolset()[lang][lvl];                 
    i=0; 
    
    var buttons_arr = [ ];
    if (lvl==0){                                                         // first panel of symbols
		reserved=[5,6, 13,14,20];                                     
        reserved=[0,6,7, 13,14,20,19]; 
        
        if (editor.parent==="files"){ buttons_arr.push( ['ajax_editorexit', 'editor_exit();',       [14,3]]  );
		}else{                        buttons_arr.push( ['js_editorback', 'editor_backto_start();', [14,3]]  ); }                    
		buttons_arr.push(
			['js_spell', 'editor_spell();',   [0,3]],                             
			['', 'editor_show_symbols('+lang+',1);',   [13,3,symbol1]],                             
			['', 'editor_show_symbols('+lang+',2);',   [7,3,symbol2]],                             
			['', 'editor_delete();',   [6,3,symbol_delete]], 
			['', 'editor_scroll(0);',   [19,3,symbol_prev]], 
			['', 'editor_scroll(1);',   [20,3,symbol_next]], 
			);           
			                            
    }else {
        buttons_arr.push( ['js_editorback', 'editor_backto_letters(0);', [14,3]]  );
        if (lvl===2)  { 
			reserved=[14,0,7,13];
			buttons_arr.push( 
				['', 'editor_show_symbols('+lang+',1);', [13,3,symbol1]],   
				['js_capslock', 'editor_capital(1,1,0);',       [0,3]],   
				['js_pintab',   'editor.pin_letters=1;',        [7,3]],  
				); 
		}else if (lvl===1)  { 
			reserved=[14,7,20,13];
			buttons_arr.push(
				['', 'editor_show_symbols('+lang+',2);', [7,3,symbol2]],   
				['js_caps', 'editor_capital(1,0,0);',            [20,3]],   
				['js_pintab',   'editor.pin_letters=1;',        [13,3]],  
				); 
		}
    }                                                    
    var allchar = editor_get_allchar();              
    for (ii=0; ii<b_nx*editor.style.b_ny; ii++){
        if (reserved.indexOf(ii)==-1 && i<key_arr.length){
            i_name = key_arr[i];
            i_name_button = allchar[1][key_arr[i]];  
            keys = Object.keys(allchar[0] ); nn=keys.indexOf(i_name).toString();
            buttons_arr.push( ['',  'editor_set_letter('+nn+');',   [ii,6, i_name_button]] );
            i+=1;
        } 
    }    
    
    var elem = document.getElementById('editor_buttons_area_0');         //console.log(elem);
    if (lvl==0){
		if (elem){
			document.getElementById('editor_buttons_area_0').style.visibility='hidden';
		}
        elem = document.getElementById('editor_buttons_area_1');
    }else{
        document.getElementById('editor_buttons_area_1').style.visibility='hidden';
        elem = document.getElementById('editor_buttons_area_2');
    }elem.style.visibility='visible';
    elem.innerHTML = button_html(0, buttons_arr, 3,b_nx, true);                                     
    editor_capital(0,1);
    
}

function editor_show_navigate(lvl){                                      consolelog_func(); 
	editor.style.set_nrow(2,0);
	var buttons_arr = [
		['', 'editor_delete();',       [6, 2, symbol_delete] ], 
		['', 'editor_scroll(0);',      [10,3, symbol_prev] ], 
		['', 'editor_scroll(1);',      [12,3, symbol_next] ], 
		['', 'editor_scrollword(0);',  [9, 3, symbol_prev_prev] ], 
		['', 'editor_scrollword(1);',  [13,3, symbol_next_next] ], 
		['', 'editor_scrollvert(0);',  [4, 3, symbol_up] ], 
		['', 'editor_scrollvert(1);',  [11,3, symbol_down] ], 
		['js_sound', 'editor_sound();',[2, 2, symbols_sound[editor.sound_navigator]] ], 
		['', '',                       [0, 5, symbol_undo] ], 
		['', '',                       [1, 5, symbol_redo] ], 
		['js_spell', 'editor_spell();', [8,2]], 
		//['editor_nav_symbol', '',      [5,4,'_']], 
		];

    if (lvl===0){ 
		buttons_arr.push( ['js_editorback', 'editor_backto_start();', [7,3]] ); 
		document.getElementById('editor_buttons_area_0').style.visibility='hidden';
		var elem = document.getElementById('editor_buttons_area_1');
	}else{ 
		buttons_arr.push( ['js_editorback', 'editor_backto_letters(0);', [7,3]]  );
		document.getElementById('editor_buttons_area_1').style.visibility='hidden';
		var elem = document.getElementById('editor_buttons_area_2');
	}
    elem.style.visibility='visible';
    elem.innerHTML = button_html(0, buttons_arr, 2,7); 
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

function editor_show_menu(){                                             consolelog_func(); 
	var inner_e = button_html(1, 
		[['show_lang',       'common_show_lang(1);',      [3,0]],
		 ['show_editorfont', 'editor_show_fontsize();',   [5,0]],
		 ['show_clickdelay', 'common_show_clickdelay();', [4,0]] 
		]);
    common_create_menu('editor_menu', 0, inner_e,'editor_created_elements', true);
}
function editor_show_fontsize(){                                         consolelog_func(); 
	var onclick = 'editor_set_fontsize(this.id,0);';
	var inner_e = button_html(1, 
		[['js_editorfont', onclick, [4,0],0], ['js_editorfont', onclick,  [5,0],1],
		 ['js_editorfont', onclick, [6,0],2], ['js_editorfont', onclick,  [7,0],3]
		]);
    common_create_menu('editor_fontsize', 1, inner_e, 'editor_created_elements', true);
}


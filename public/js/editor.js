
//-- editor variables -------------------------------------------------------------------
var editor = {
	dict: {},
	style: {},
	
	parent: "",
	destination: "",
	iter: 0,
	text_raw: "",
	text_origin: "",
	
	sound_navigator: 1,
	sound_buttons: 0,
	capslock: 0,
	caps: 0,
	pin_letters: 0,
	
	spell_type:0,
	
	symbol_ltag: '<abbr>',
	symbol_rtag: '</abbr>',
};
                                                                

//-- editor style object --------------------------------------------------------------
editor.style = {
	window_height: window.innerHeight,
	b_nx: 7, b_ny: 2, 
	
	nlines_lvl0: 3,
	nlines_lvl1: 2,
	fontsize: 0,
	cursorshift: 0.25,
	
	state: ['start',0],         // remember panel to reopen when resize
	
	set_nrow: function(nrow, lvl){                                       consolelog_func('brown');
		this.b_ny=nrow;
		style_resize();
		if (lvl==0){ editor_set_fontsize(editor.style.nlines_lvl0, 0);  }
		else { editor_set_fontsize(Math.max(editor.style.nlines_lvl0-1,2), 1); }
		editor_set_cursor();
	},
	get_bsize: function(){
		var wratio = window.innerWidth/window.innerHeight; 
		return 9.5 - 3*(wratio-1.5);   
	},	
	get_bspace: function(){
		var wratio = window.innerWidth/window.innerHeight; 
		return 7 - 2*Math.abs(wratio-1.5);  
	},	
};


//-- run/save/exit -------------------------------------------------------

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

function editor_start(parent, text_raw, destination, iter){              consolelog_func("darkblue"); 
	editor.style.nlines_lvl0 = common.editor_nlines_lvl0;
	editor.style.nlines_lvl1 = common.editor_nlines_lvl1;
	if (text_raw==undefined) { text_raw=""; }
	if (destination==undefined) { destination=""; }
	if (iter==undefined) { iter=0; }
	editor.parent = parent;
	editor.destination = destination.toString();
	editor.text_raw = text_raw.toString();
	editor.text_origin = editor.text_raw;
	editor.iter = iter;

    create_element('editor_bkg','editor_bkg', 'created_elements');
    create_element('editor_area','editor_bkg', 'editor_base_elements');
    
	var elem=create_element('editor_text_box','editor_scroll_box', 'editor_area'); 
	elem.innerHTML = '<div class="text_scroll" id="editor_text_scroll"><div id="editor_text_area"  class="editor_text" >zoom word</div></div>'; 
	elem = create_element('editor_buttons_area', 'buttons_area_editor', 'editor_area'); 
	window.onresize = function(){ editor_resize(); };
	
	editor.style.set_nrow(2,0);
	document.getElementById('editor_text_area').innerHTML=editor.text_raw;  
    if (editor.text_raw.length>1){
		editor.iter = editor.text_raw.length;
		editor_scroll(0,'no');
	}else{
		editor_set_cursor(); 
	}                                                    
	editor_show_start();                                                   
	if (parent==='files') { editor_show_symbols(3,0); }
	
	document.addEventListener('keydown', editor_keydown);
}

function editor_exit(){                                                  consolelog_func("darkblue"); 
    var elem = document.getElementById('editor_area');
    elem.parentNode.removeChild(elem);
    var elem = document.getElementById('editor_bkg');
    elem.parentNode.removeChild(elem);
    
    document.removeEventListener('keydown', editor_keydown);
    common.editor_text = editor.text_raw;
    common.ineditor = false;      
    utter_stop();                                                        //console.log(editor.parent);
    if (editor.parent=="reader"){ 
		if (editor.text_origin!=editor.text_raw){
			common.ischanged_text = true;
		}
		window.onresize = function(){ reader_resize(); };
		reader_update(); 
	}else if (editor.parent=="files"){             
		window.onresize = function(){ files_resize(); };                     
		elem = document.getElementById(editor.destination);
		if (elem) { elem.innerHTML = editor.text_raw; }               
		files_resize();                   
	}  
}function editor_save(){                                                 consolelog_func("darkblue"); 
    if (editor.parent=='reader'){
		common.editor_text = editor.text_raw;
		common.ischanged_text = true;
        reader_update(); 
    }
}

function editor_keydown(event){
	if (!document.getElementById('editor_text_area')){ return true; }
	
	var key = event.keyCode;                                         //console.log(event.keyCode, event.key);
	if (key == ctrlKey || key == cmdKey) {ctrlDown = true; }
	
	var key = event.keyCode; 
	if (ctrlDown && key==vKey){
		console.log('Ctrl+V is not ready');
	}else if (ctrlDown && key==cKey){
		console.log('Ctrl+C is not ready');
	}else if (event.key.length==1){                                  // key 0 is for Firefox(cyrillic)   // '190 >, '188 <, 192 ~, 220 \, 219 (ru)х, 
		if ( [0,32, 219,220,221,222].indexOf(key)>-1 || (key>=48 && key<=59 ) || (key>=63 && key<=125) || (key>=186 && key<=192) || (key>=1040 && key<=1103)) {
			var letter_number = /^[0-9a-zA-Z]+$/;
			if (editor.parent=='reader' || (['-','+','_','!'].indexOf(event.key)>-1 || event.key.match(letter_number)) ){
				editor_set_letter(event.key, true);                  //console.log('set '+event.key); 
			}
		}
	}else{
		if ( key == 8 || key == 46 ){ editor_delete(); }
	    else if( key == 37 ){ editor_scroll(0); }
	    else if( key == 39 ){ editor_scroll(1); }
	    else if( key == 38 && editor.parent=='reader' ){ editor_scrollvert(0); }
	    else if( key == 40 && editor.parent=='reader' ){ editor_scrollvert(1); }
	    else if( key == 13 && editor.parent=='reader' ){ editor_set_letter(92); }
	}
			
}

//-- editing functions ---------------------------------------------------

function editor_delete(){                                                consolelog_func(); 
    if (editor.iter>0) { 
		var ltag = editor.symbol_ltag, rtag = editor.symbol_rtag;              
        var iter = editor.iter;
		var text = editor.text_raw;                                      
		
        var i = text.substr(0,iter).lastIndexOf(rtag);                  
        if (iter==i+rtag.length && i!=-1){
            iter_l = text.substr(0,iter).lastIndexOf(ltag);
        }else{
            i = text.substr(0,iter).lastIndexOf('>');
            if (iter==i+1 && i!=-1){
                iter_l = text.substr(0,iter).lastIndexOf('<');
            }else{iter_l=iter-1;}    
        }
        
        text_c = text.substr(0, iter_l)+text.substr(iter);
        editor.iter = iter_l;
		editor.text_raw = text_c;	
        editor_set_cursor(); 
    }
}function editor_set_letter(n, keypress){                                consolelog_func('darkblue'); 
	if (keypress==undefined) { keypress=false; }
	var letter = "";
	var iter = editor.iter;
	var text = editor.text_raw;
	
	if (keypress==true){
		n = editor_textto_paste(n);
		letter = n.toString();
	}else{
	    var allchar = editor_get_allchar()[0];
	    var keys = Object.keys( allchar );
	    letter = allchar[keys[n]];       
	                      
	    if (editor.capslock+editor.caps===1) { 
			if (/^[a-zA-Z]+$/.test(letter) || /^[а-яА-Я]+$/.test(letter)) { letter = letter.toUpperCase(); }
		}
	}
    var text_c = text.substr(0, iter)+letter+text.substr(iter);
    editor.text_raw = text_c;
    iter_new = iter+letter.length;
    editor.iter = iter_new;
    editor_set_cursor(); 
    if (editor.pin_letters===0) { editor_backto_letters(); }
    editor_capital(0,0,1);
    var text_read = editor_textto_read(letter);
    utter(text_read, 1);
}

//-- menu functions ------------------------------------------------------------

function editor_sound(){                                                 consolelog_func(); 
    editor.sound_navigator = (editor.sound_navigator+1)%2;             
    document.getElementById('js_sound').innerHTML = symbols_sound[editor.sound_navigator];
}
function editor_set_fontsize(id, lvl){                                   consolelog_func(); 
	id = parseInt(id);
    var area = document.getElementById('editor_text_box').getBoundingClientRect(); 
    if (lvl===0){
		editor.style.nlines_lvl0 = id;                                              
		common.editor_nlines_lvl0 = id;                                   
	}else if (lvl===1){
		editor.style.nlines_lvl1 = id;                                            
		common.editor_nlines_lvl1 = id;         
	}            
	var wratio = window.innerWidth/window.innerHeight; 
	if (wratio<1){id = id/wratio;}
    var fontsize = (area.bottom-area.top) / (id+0.5);                    //console.log('area: '+area.top+' - '+area.bottom+' - '+fontsize+' - '+id);
	document.getElementById('editor_text_area').style.fontSize = fontsize.toString()+'px';
	editor.style.fontsize = fontsize;  
	var elem = document.getElementById('place_editorfont');
	if (elem){
		elem.innerHTML = editor.style.nlines_lvl0+' '+dict.js_editorfont[1];
	}
}
function editor_spell(){                                                 consolelog_func(); 
    var iter = editor.iter;
	var text = editor.text_raw;
	var text_utter = '', text_u = '';
    if (text[iter-1]!=' ' || text[iter]!=' '){ 
        i1 = text.substr(0,iter).lastIndexOf(' '); 
        i2 = text.indexOf(' ',iter);
        if (i1==-1){i1=0;}
        if (i2==-1){i2=text.length;}
        text_utter = text.substr(i1, i2-i1);
        text_utter = editor_textto_read(text_utter);
        if (text_utter.indexOf('new line')>=0){ editor.spell_type=0; }
        
        if (editor.spell_type===0){
			utter(text_utter, 1); 
		}else{ 
			var arr = [];
			for (i=0; i<text_utter.length; i+=1){ arr.push(text_utter[i]); }   //console.log('text_u: '+text_u);
			utter_recursive(arr, 1, 0, 0, 0.8);
		}
		editor.spell_type = (editor.spell_type+1)%2;
    }
}

//-- navigation functions ------------------------------------------------

function editor_scrollvert(order){                                       consolelog_func('darkblue'); 
    order = parseInt(order);
    var iter_prev = editor.iter;
    var iter_save = iter_prev; 
    var pos0 = parseInt(document.getElementById('cursor').offsetTop);      
    var proceed = 1;
    while(proceed==1){
        editor_scrollword(order);
        pos = parseInt(document.getElementById('cursor').offsetTop);    
        iter = editor.iter;
        if (pos!=pos0 || iter==iter_prev) {proceed=0;}
        iter_prev = iter;
    }
    if (order==1 && pos==pos0 && iter!=iter_save) {
        iter=iter_save;
        editor.iter = iter;
        editor_set_cursor();
        } 
    if (order==0){
        pos0 = parseInt(document.getElementById('cursor').offsetTop);   
        proceed = 1;
        while(proceed==1){
            editor_scrollword(0);
            pos = parseInt(document.getElementById('cursor').offsetTop); 
            var iter = editor.iter;  
            if (pos!=pos0 || iter==iter_prev) {proceed=0;}
            iter_prev = iter;
        }editor_scrollword(1);
    }
    var text_read = editor_textto_read( editor.text_raw.substring(iter_save, iter) );
	if (editor.sound_navigator==1) { utter(text_read, 1); }   
}
function editor_scrollword(order){                                       consolelog_func('darkblue'); 
    order = parseInt(order);
    var iter = editor.iter;
    var text = editor.text_raw;
    
    var i_left=iter, i_right=iter, i=0;
    if (order==1){ 
		if (text[iter]!=' '){
			i = text.lastIndexOf(' ', iter-1);
			if (i!=-1) { i_left = i+1; } else{i_left=0;}
			
			if (text.indexOf(' ', iter)!=-1) { iter = text.indexOf(' ', iter); }
			else {iter = text.length;}
		}
		iter = find_spaceend(text, iter);	
		i_right = iter;	
	}
	if (order==0){
		if (text[iter-1]!==' ' && iter>0){ i_right = text.indexOf(' ', iter); if (i_right==-1){i_right=text.length;} }
		if (text[iter-1]===' ' && iter>0){ iter = find_spacestart(text,iter-1) }
		if (iter>0){ 
			i = text.lastIndexOf(' ', iter-1);
			if (i!=-1) { iter = i+1; } else{iter=0;}
		}
		i_left = iter;
	}
	editor.iter = iter;
	editor_set_cursor();
	var text_read = editor_textto_read( text.substring(i_left, i_right) );
	if (editor.sound_navigator==1) { utter(text_read, 1); }   
}
function editor_scroll(order, if_utter){                                 consolelog_func('darkblue'); 
    var ltag = editor.symbol_ltag, rtag = editor.symbol_rtag; 
    var iter = editor.iter;
    var iter_prev = iter;
    var text = editor.text_raw;
    max_iter = text.length;
    if (order==1 && iter < max_iter){ 
        if (iter==text.indexOf(ltag,iter) ){
            iter = text.indexOf(rtag,iter) + rtag.length; 
        }else{
            if (iter==text.indexOf('<',iter) ){
                iter = text.indexOf('>',iter) + 1; 
            }else{iter+=1;}
        }
    }else if (order==0 && iter > 0) { 
        i = text.substr(0,iter).lastIndexOf(rtag);                       //console.log('E: '+text.length+' - '+i+' - ');
        if (iter==i+rtag.length && i!=-1){
            iter = text.substr(0,iter).lastIndexOf(ltag);              
        }else{
            i = text.substr(0,iter).lastIndexOf('>');
            if (iter==i+1 && i!=-1){
                iter = text.substr(0,iter).lastIndexOf('<');          
            }else{iter-=1;}     
        } 
    }  
    editor.iter = iter;
    editor_set_cursor();
    
    if (if_utter==undefined){
	    i1 = Math.min(iter_prev, iter); i2 = Math.max(iter_prev, iter); 
	    var letter = text.substr(i1, i2-i1);
	    var text_read = editor_textto_read(letter);
	    if (editor.sound_navigator==1) { utter(text_read, 1); }
	    
	    //var elem = document.getElementById('editor_nav_symbol');
	    //if (elem && text_read.length<2){ elem.innerHTML = text_read; }
	}
    return (iter);
}

function editor_set_cursor(){                                            consolelog_func(); 
	var cursorshift = editor.style.fontsize*editor.style.cursorshift;            
	if (common.browser=="Firefox"){         
		var cursor = '<em id="cursor" style="position:relative;"><em class="blinking-cursor" style="display:inline;margin:0 -'+cursorshift.toString()+'px; width:0px;left:-'+cursorshift.toString()+'px" >|</em></em>'; 
	}else{
		var cursor = '<em id="cursor" style="position:relative;"><em class="blinking-cursor" style="position:absolute;left:-'+cursorshift.toString()+'px;" >|</em></em>'; 
    }
    var iter = editor.iter;                                           
    var text = editor.text_raw;                                          //console.log(iter, text.length);
    if (text.length<1){ iter = 0; editor.iter=iter; }
    else if (iter>text.length){ iter = text.length-1; editor.iter=iter; }
                                         
    var rspace = text.indexOf(' ',iter);                                  
    var lspace = text.substr(0,iter).lastIndexOf(' ');                       
    
    text_c = text.substr(0, iter)+cursor+text.substr(iter); 
    document.getElementById('editor_text_area').innerHTML=text_c;
        
    //-- make cursor visible when line ends with witespaces --------------
    var elem  = document.getElementById('cursor');
    var area = document.getElementById('editor_text_box').getBoundingClientRect();
    var e = elem.getBoundingClientRect();  
    if ( e.right+cursorshift>area.right ){
		text_c = text_c.substr(0, iter)+'<br>'+text_c.substr(iter); 
		document.getElementById('editor_text_area').innerHTML=text_c;
	}                
    //--------------------------------------------------------------------
    
    scroll_to('cursor','editor_text_box', title=0);   
    editor.spell_type=0;
    }

//-----------------------------------------------------------------------------------

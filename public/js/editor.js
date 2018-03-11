
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
	if_spell: 0,
	i_spell: 0,
	spell_arr: [],
};

editor.dict = {
	symbol_ltag: '<abbr>',
	symbol_rtag: '</abbr>',
	
	letters_ru: { r1:'а',r2:'б',r3:'в',r4:'г',r5:'д',r6:'е',r7:'ё',r8:'ж',r9:'з',r10:'и',r11:'й',r12:'к',r13:'л',r14:'м',r15:'н',r16:'о',r17:'п',r18:'р',r19:'с',r20:'т',r21:'у',r22:'ф',r23:'х',r24:'ц',r25:'ч',r26:'ш',r27:'щ',r28:'ъ',r29:'ы',r30:'ь',r31:'э',r32:'ю',r33:'я' },
	letters_en: {  a:'a', b:'b', c:'c', d:'d', e:'e', f:'f', g:'g', h:'h', i:'i', j:'j', k:'k', l:'l', m:'m', n:'n', o:'o', p:'p', q:'q', r:'r', s:'s', t:'t', u:'u', v:'v', w:'w', x:'x', y:'y', z:'z'},
	symbols1:   { 0:'0',1:'1',2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9',dot:'.', dash:'-', comma:',', qmark:'?', emark:'!', colon:':', semicolon:';', quotes:'"', plus:'+', minus:'-', eq:'=', star:'*', slash:'/', lbr:'(', rbr:')', power:'^', lbrsq:'[', rbrsq:']', lbrf:'{', rbrf:'}', underscore:'_', vert:'|'},
	symbols2:   { space:' ', newline:' <br> ', pc:'%', less:'<abbr>&#60</abbr>', more:'<abbr>&#62</abbr>', at:'@', 
				  backslash:'<abbr>&#8726</abbr>', sum:'<abbr>&#8721</abbr>', prod:'<abbr>&#8719</abbr>', sqrt:'<abbr>&#8730</abbr>', cdot:'<abbr>&#8729</abbr>', 
		          leq:'<abbr>&#8804</abbr>', geq:'<abbr>&#8805</abbr>', ll:'<abbr>&#8810</abbr>', gg:'<abbr>&#8811</abbr>', sim:'<abbr>~</abbr>', neq:'<abbr>&#8800</abbr>', quiv:'<abbr>&#8801</abbr>', approx:'<abbr>&#8776</abbr>', 
		          prime:"'", ldquo:'<abbr>&#8220</abbr>', rdquo:'<abbr>&#8221</abbr>', lsquo:'<abbr>&#8216</abbr>', rsquo:"'", 
		          cap:'<abbr>&#8745</abbr>', cup:'<abbr>&#8746</abbr>', subset:'<abbr>&#8834</abbr>', supset:'<abbr>&#8835</abbr>' },
	symbols2_b: { space:' ',  newline:'line',  pc:'&#37', less:'&#60', more:'&#62', leq:'&#8804', geq:'&#8805', ll:'&#8810', gg:'&#8811', approx:'&#8776', vert:'|', backslash:'&#8726', sum:'&#8721', prod:'&#8719', cap:'&#8745', cup:'&#8746', subset:'&#8834', supset:'&#8835', sim:'~', cdot:'&#8729', neq:'&#8800', quiv:'&#8801', sqrt:'&#8730',   prime:'&#8242', ldquo:'&#8220', rdquo:'&#8221', lsquo:'&#8216', rsquo:'&#8217', at:'&#64' },
	allchar: function(){ 
		return( Object.assign({}, this.letters_en, this.letters_ru, this.symbols1, this.symbols2   )); }, 
	allchar_buttons: function(){ 
		return( Object.assign({}, this.letters_en, this.letters_ru, this.symbols1, this.symbols2_b )); },
	
	symbolset7_en: [ 
		['u','c','d','r','l',  'o','t','h','e','s',  'n','a','i','space'],
	    [ 'prime','dash','dot','comma','z','q','m',   'j','x','g','p','f',   'k','v','b','y','w' ],             
	    ['quotes','colon','emark','qmark','lbr','rbr',  '1','2','3','4','5',  '6','7','8','9','0','newline']
	], symbolset7_ru: [ 
		['r17','r18','r16','r13','r14',  'r3','r1','r6','r15','r10',   'space','r12','r19','r20'],    
        ['r31','r11','r25','r32','r26','r27','r5',   'r23','r8','r9','r2','r21',  'r24','r29','r33','r30','r4'],    
		['qmark','1','2','3','4','5',  '6','7','8','9','0',  'r28','r22', 'newline','dash','dot','comma']
	], symbolset7_math: [
		['0','1','2','3','4','5','6','7','8','9',  'eq','plus','minus','space'],    
		['lbrf','rbrf','lbrsq','rbrsq','semicolon','colon',  'qmark','space','power','space','space',  'newline','eq','slash','rsquo','lbr','rbr'],    
		['i','j','k','l','underscore',  'space','e','f','g','h','d',  'a','b','c','x','y','z']  
	], symbolset7_math2: [
		['a','b','comma','dot','2','3', 'slash','minus','plus','lbr','rbr', 'x','y','z','space'],    
		['less','more','sqrt','power','cdot','eq',  'newline','1','2','3','4','5',  '6','7','8','9','0','space'],    
		['space','space','space','space','space','space',  'lbrf','rbrf','lbrsq','rbrsq','less','pc', 'underscore','c','d','e','f','g','h']  
	],	symbolset7_files: [ 
		['m','u','c','d','r','l',  'o','t','h','e','s',  'n','a','i','underscore'],
		[ 'dot','space','space','dash','z','q','at',   'j','x','g','p','f',   'k','v','b','y','w' ],             
	    ['space','space','space','space','space','space', '1','2','3','4','5',  '6','7','8','9','0','underscore']
	],symbolset7_other: [  
		['semicolon','colon','power','star','at',  'prime','quotes','slash','pc','dash', 'lbr','rbr','qmark','emark'],      
		['space','space','space','space','space','space','space',  'dot','comma','eq','plus','underscore',  'space','lbrf','rbrf','lbrsq','rbrsq'],  
		['space','space','space','space','space','space',  '0','1','2','3','4','5','6','7','8','9','space']
	],                               
	symbolset7_all: function(){ return [this.symbolset7_math, this.symbolset7_math2, this.symbolset7_other, this.symbolset7_files, this.symbolset7_en, this.symbolset7_ru] ; },
	
};                                                                  

//-- editor style object --------------------------------------------------------------
editor.style = {
	window_height: window.innerHeight,
	b_nx: 5, b_ny: 2, 
	b_height: 15, b_width:12,
	b_xratio: 0.4, b_yratio: 0.5,
	b_left: 3, b_right: 97, b_top: 38, b_bottom: 95,
	b_leftwidth: 1, b_rightwidth: 1, b_botheight: 1,
	font_size : '900%',
	text_zoom : '900%',
	box_class : 'text_zoom',
	zoomspace : 5,
	nlines_lvl0: 3,
	nlines_lvl1: 2,
	fontsize: 0,
	cursorshift: common.style.cursorshift,
	class_arr: ["buttons editor", "buttons symbol", "buttons nobkg", "buttons disabled"],
	
	get_button: function (i, class_n){                                   //consolelog_func("brown"); 
		if (class_n===undefined) {class_n=0;}
		var class_name = this.class_arr[class_n];
		var style="";
	    var ny = (i-i%this.b_nx)/this.b_nx;                           
	    var nx = i % this.b_nx;
	   
	    var b_yspace = (this.b_bottom - this.b_top) / ( this.b_ny-1 + (this.b_ny-1+this.b_botheight) / this.b_yratio ); 
	    var b_xspace = (this.b_right - this.b_left) / ( this.b_nx-1 + (this.b_nx-2+this.b_leftwidth+this.b_rightwidth) / this.b_xratio ); 
	    var b_height = b_yspace/this.b_yratio;
	    var b_width  = b_xspace/this.b_xratio;
	    
	    var y = this.b_top + (b_height+b_yspace)* ny;
	    var x = this.b_left + (b_width+b_xspace)* nx;
	    
	    if ( nx>0 )   { x -= b_width*(1-this.b_leftwidth); }
	    if ( nx===0 )           { b_width = b_width*this.b_leftwidth; }
	    if ( nx===this.b_nx-1 ) { b_width = b_width*this.b_rightwidth; }
	    if ( ny===this.b_ny-1 && this.b_botheight!=1 ) { b_height = b_height*this.b_botheight;
		}
	    
	    var fontsize = common.style.b_fontsize*common.b_fontsize_scale*common.style.vmin; 
	    style+= 'left:'+x+'vw; top:'+y*common.style.ry+'vh; width:'+b_width+'vw; height:'+b_height*common.style.ry+'vh; border-bottom-width:'+b_height*common.style.ry*0.07+'vh; font-size:'+fontsize+'px;'  ;  
	    return('class="'+class_name+'" style="'+style+'"');
	},
	
	set_style: function (stylename, ncol){                               consolelog_func("brown"); 
		if (stylename==='bottom_3rows') {                               
			if (ncol===undefined) {ncol=7;}
		    this.b_nx=ncol; this.b_ny=3; 
		    this.b_yratio=0.5; this.b_xratio=0.5;
		    this.b_left=2; this.b_right=98; this.b_top=42.5; this.b_bottom=97; this.b_botheight=1;
		    this.b_leftwidth=1; this.b_rightwidth=1; this.zoomspace = 6;
		    var zoomheight = this.b_top - 2 - this.zoomspace;            //console.log(this.zoomspace, this.b_top);
		    document.getElementById('editor_text_box').style.height=zoomheight*common.style.ry+'vh';
		    document.getElementById('editor_buttons_area').style.top=(this.b_top-this.zoomspace/2)*common.style.ry+'vh';
		    editor_set_fontsize(this.nlines_lvl1,1); 
		    editor_set_cursor(); 
		     
		}else if (stylename==='bottom_2rows') {                          
			if (ncol===undefined) {ncol=6;}
		    this.b_nx=ncol; this.b_ny=2; 
		    this.b_yratio=0.5; this.b_xratio=0.5;
		    this.b_left=2; this.b_right=98; this.b_top=64; this.b_bottom=97; this.b_botheight=1;
		    this.b_leftwidth=1; this.b_rightwidth=1; this.zoomspace = 5;
		    var zoomheight = this.b_top - 2.4 ;            //console.log('2rows:',this.zoomspace, this.b_top);
		    document.getElementById('editor_text_box').style.height = zoomheight*common.style.ry+'vh';  
		    document.getElementById('editor_buttons_area').style.top=(this.b_top-this.zoomspace/2)*common.style.ry+'vh';
		    editor_set_fontsize(this.nlines_lvl0,0);                     
		    editor_set_cursor();
		}
	},
	button_exit:   function(i) { return '<div id="editor_exit"    onclick="editor_exit();" '    +this.get_button(i) +'> exit </div>'; },
	button_delete: function(i) { return '<div id="editor_delete"  onclick="editor_delete();" '  +this.get_button(i) +'>'+symbol_delete+'</div>'; },
	button_prev:   function(i) { return '<div id="editor_prev"    onclick="editor_scroll(0);" ' +this.get_button(i) +'>'+symbol_prev+'</div>' },
	button_next:   function(i) { return '<div id="editor_next"    onclick="editor_scroll(1);" ' +this.get_button(i) +'>'+symbol_next+'</div>' },
	button_backto_start:   function(i)    { return '<div id="editor_backto_start"   onclick="editor_backto_start();" '        +this.get_button(i) +'> back </div>' },
	button_backto_letters: function(i, s) { return '<div id="editor_backto_letters" onclick="editor_backto_letters('+s+');" ' +this.get_button(i) +'> back </div>' },
		
};


//-- run/save/exit -------------------------------------------------------

//editor_run();
if (typeof reader!=='undefined' && common.ineditor===true) { reader_editor();}

function editor_run(parent, text_raw, destination, iter){                consolelog_func("darkblue"); 
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
	elem = create_element('editor_buttons_area', 'editor_buttons_area', 'editor_area'); 
	
	var input = document.getElementsByTagName('body')[0];
    if (common.browser=="Firefox"){ 
		var a=0;
		// todo
	}
	else{
	    input.onkeypress = function(event) {
			var key = event.keyCode;                                     // Get the Unicode value
			if ( (key >= 32 && key <= 59 ) || key == 61 ||  (key >= 63 && key <= 125) || (key >= 1040 && key <= 1103) ) {
				var y = String.fromCharCode(key);                        //console.log('keypress '+key+' '+y);  
				editor_set_letter(y, true);
			}
		};
			
	    input.onkeydown = function(event) {
		    var key = event.keyCode;                                     //console.log('keydown: '+key);
		    if( key == 8 || key == 46 ){                                 //console.log('delete');
		        editor_delete();
			}
		    if( key == 13 ){                                             //console.log('enter');
		        editor_set_letter(92);
			}
		    if( key == 37 ){                                    
		        editor_scroll(0);
			}
		    if( key == 39 ){                                    
		        editor_scroll(1);
			}
		};
	}
	
	
	editor_type = 'bottom_2rows';
	editor.style.set_style(editor_type);
	
	document.getElementById('editor_text_area').innerHTML=editor.text_raw;  
    if (editor.text_raw.length>1){
		editor.iter = editor.text_raw.length;
		editor_scroll(0,'no');
	}
	editor_set_cursor();                                                     
	editor_show_start();                                                   
	if (parent==='files') { editor_show_symbols(3,0); }
}

function editor_exit(){                                                  consolelog_func("darkblue"); 
    var elem = document.getElementById('editor_area');
    elem.parentNode.removeChild(elem);
    var elem = document.getElementById('editor_bkg');
    elem.parentNode.removeChild(elem);
    var input = document.getElementsByTagName('body')[0];
    input.onkeydown = "";
    input.onkeypress = "";
    common.editor_text = editor.text_raw;
    common.ineditor = false;                                             //console.log(editor.parent);
    if (editor.parent=="reader"){ 
		if (editor.text_origin!=editor.text_raw){
			common.ischanged_text = true;
		}
		reader_update(); 
	}else if (editor.parent=="files"){                                  
		elem = document.getElementById(editor.destination);
		if (elem) { elem.innerHTML = editor.text_raw; }               
		elem = document.getElementById("ffiles_edit_text" );
		if (elem) { elem.value = editor.text_raw; }                      
	}  
}function editor_save(){                                                 consolelog_func("darkblue"); 
    if (editor.parent=='reader'){
		common.editor_text = editor.text_raw;
		common.ischanged_text = true;
        reader_update(); 
    }
}

//-- editing functions ---------------------------------------------------

function editor_delete(){                                                consolelog_func(); 
    if (editor.iter>0) { 
		//var rtag = "</abbr>"; var ltag = "<abbr>";    
		var ltag = editor.dict.symbol_ltag, rtag = editor.dict.symbol_rtag;              
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
}function editor_set_letter(n, keypress){                                          consolelog_func(); 
	if (keypress===undefined) { keypress=false; }
	var letter = "";
	var iter = editor.iter;
	var text = editor.text_raw;
	
	if (keypress===true){
		letter = n.toString();
	}else{
	    var keys = Object.keys( editor.dict.allchar() );
	    letter = editor.dict.allchar()[keys[n]];       
	                      
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
    var text_read = common_textto_read(letter);
    utter(text_read, 1);
}

//-- menu functions ------------------------------------------------------------

function editor_sound(){                                                 consolelog_func(); 
    editor.sound_navigator = (editor.sound_navigator+1)%2;             
    document.getElementById('editor_sound').innerHTML = symbols_sound[editor.sound_navigator];
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
    var fontsize = (area.bottom-area.top) / (id+0.3);                    //console.log('area: '+area.top+' - '+area.bottom+' - '+fontsize+' - '+id);
	document.getElementById('editor_text_area').style.fontSize = fontsize.toString()+'px';
	editor.style.fontsize = fontsize;    
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
        text_utter = common_textto_read(text_utter);
        if (text_utter.indexOf('new line')>=0){ editor.spell_type=0; }
        
        if (editor.spell_type===0){
			utter(text_utter, 1); 
		}else{ 
			editor.spell_arr=[];
			editor.if_spell = 1;
			text_u = '';
			for (i=0; i<text_utter.length; i+=1){ text_u+=text_utter[i]+'. '; }   //console.log('text_u: '+text_u);
			utter(text_u, 1);
		}
		editor.spell_type = (editor.spell_type+1)%2;
    }
}

//-- navigation functions ------------------------------------------------

function editor_scrollvert(order){                                       consolelog_func(); 
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
    var text_read = common_textto_read( editor.text_raw.substring(iter_save, iter) );
	if (editor.sound_navigator==1) { utter(text_read, 1); }   
}
function editor_scrollword(order){                                       consolelog_func(); 
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
	var text_read = common_textto_read( text.substring(i_left, i_right) );
	if (editor.sound_navigator==1) { utter(text_read, 1); }   
}
function editor_scroll(order, if_utter){                                           consolelog_func(); 
    var ltag = editor.dict.symbol_ltag, rtag = editor.dict.symbol_rtag; 
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
	    var text_read = common_textto_read(letter);
	    if (editor.sound_navigator==1) { utter(text_read, 1); }
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
    var text = editor.text_raw;                                     
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

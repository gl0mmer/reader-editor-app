

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

function editor_get_allchar(){
	var letters_ru = { r1:'а',r2:'б',r3:'в',r4:'г',r5:'д',r6:'е',r7:'ё',r8:'ж',r9:'з',r10:'и',r11:'й',r12:'к',r13:'л',r14:'м',r15:'н',r16:'о',r17:'п',r18:'р',r19:'с',r20:'т',r21:'у',r22:'ф',r23:'х',r24:'ц',r25:'ч',r26:'ш',r27:'щ',r28:'ъ',r29:'ы',r30:'ь',r31:'э',r32:'ю',r33:'я' };
	var letters_en = {  a:'a', b:'b', c:'c', d:'d', e:'e', f:'f', g:'g', h:'h', i:'i', j:'j', k:'k', l:'l', m:'m', n:'n', o:'o', p:'p', q:'q', r:'r', s:'s', t:'t', u:'u', v:'v', w:'w', x:'x', y:'y', z:'z'};
	var symbols1   = { 0:'0',1:'1',2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9',dot:'.', dash:'-', comma:',', qmark:'?', emark:'!', colon:':', semicolon:';', quotes:'"', plus:'+', minus:'-', eq:'=', star:'*', slash:'/', lbr:'(', rbr:')', power:'^', lbrsq:'[', rbrsq:']', lbrf:'{', rbrf:'}', underscore:'_', vert:'|'};
	var symbols2 = { space:' ', newline:' <br> ', pc:'%', less:'<abbr>&#60</abbr>', more:'<abbr>&#62</abbr>', at:'@', 
				  backslash:'<abbr>&#8726</abbr>', sum:'<abbr>&#8721</abbr>', prod:'<abbr>&#8719</abbr>', sqrt:'<abbr>&#8730</abbr>', cdot:'<abbr>&#8729</abbr>', 
		          leq:'<abbr>&#8804</abbr>', geq:'<abbr>&#8805</abbr>', ll:'<abbr>&#8810</abbr>', gg:'<abbr>&#8811</abbr>', sim:'<abbr>~</abbr>', neq:'<abbr>&#8800</abbr>', quiv:'<abbr>&#8801</abbr>', approx:'<abbr>&#8776</abbr>', 
		          prime:"'", ldquo:'<abbr>&#8220</abbr>', rdquo:'<abbr>&#8221</abbr>', lsquo:'<abbr>&#8216</abbr>', rsquo:"'", 
		          cap:'<abbr>&#8745</abbr>', cup:'<abbr>&#8746</abbr>', subset:'<abbr>&#8834</abbr>', supset:'<abbr>&#8835</abbr>' };
	var symbols2_b = { space:' ',  newline:'line',  pc:'&#37', less:'&#60', more:'&#62', leq:'&#8804', geq:'&#8805', ll:'&#8810', gg:'&#8811', approx:'&#8776', vert:'|', backslash:'&#8726', sum:'&#8721', prod:'&#8719', cap:'&#8745', cup:'&#8746', subset:'&#8834', supset:'&#8835', sim:'~', cdot:'&#8729', neq:'&#8800', quiv:'&#8801', sqrt:'&#8730',   prime:'&#8242', ldquo:'&#8220', rdquo:'&#8221', lsquo:'&#8216', rsquo:'&#8217', at:'&#64' };
	
	var allchar =  Object.assign({}, letters_en, letters_ru, symbols1, symbols2   ); 
	var allchar_buttons = Object.assign({}, letters_en, letters_ru, symbols1, symbols2_b );
	
	return([allchar,allchar_buttons]);
}
function editor_get_symbolset(){
	var symbolset7_en = [ 
		['u','c','d','r','l',  'o','t','h','e','s',  'n','a','i','space'],
	    [ 'prime','dash','dot','comma','z','q','m',   'j','x','g','p','f',   'k','v','b','y','w' ],             
	    ['quotes','colon','emark','qmark','lbr','rbr',  '1','2','3','4','5',  '6','7','8','9','0','newline']
		]; 
	var symbolset7_ru = [ 
		['r17','r18','r16','r13','r14',  'r3','r1','r6','r15','r10',   'space','r12','r19','r20'],    
        ['r31','r11','r25','r32','r26','r27','r5',   'r23','r8','r9','r2','r21',  'r24','r29','r33','r30','r4'],    
		['qmark','1','2','3','4','5',  '6','7','8','9','0',  'r28','r22', 'newline','dash','dot','comma']
		]; 
	var symbolset7_math = [
		['0','1','2','3','4','5','6','7','8','9',  'eq','plus','minus','space'],    
		['lbrf','rbrf','lbrsq','rbrsq','semicolon','colon',  'qmark','space','power','space','space',  'newline','eq','slash','rsquo','lbr','rbr'],    
		['i','j','k','l','underscore',  'space','e','f','g','h','d',  'a','b','c','x','y','z']  
		]; 
	var symbolset7_math2 = [
		['a','b','comma','dot','2','3', 'slash','minus','plus','lbr','rbr', 'x','y','z','space'],    
		['less','more','sqrt','power','cdot','eq',  'newline','1','2','3','4','5',  '6','7','8','9','0','space'],    
		['space','space','space','space','space','space',  'lbrf','rbrf','lbrsq','rbrsq','less','pc', 'underscore','c','d','e','f','g','h']  
		];	
	var symbolset7_files = [ 
		['m','u','c','d','r','l',  'o','t','h','e','s',  'n','a','i','underscore'],
		[ 'dot','space','space','dash','z','q','at',   'j','x','g','p','f',   'k','v','b','y','w' ],             
	    ['space','space','space','space','space','space', '1','2','3','4','5',  '6','7','8','9','0','underscore']
		];
	var symbolset7_other = [  
		['semicolon','colon','power','star','at',  'prime','quotes','slash','pc','dash', 'lbr','rbr','qmark','emark'],      
		['space','space','space','space','space','space','space',  'dot','comma','eq','plus','underscore',  'space','lbrf','rbrf','lbrsq','rbrsq'],  
		['space','space','space','space','space','space',  '0','1','2','3','4','5','6','7','8','9','space']
		];                               
	var symbolset7_all = [symbolset7_math, symbolset7_math2, symbolset7_other, symbolset7_files, symbolset7_en, symbolset7_ru] ; 
	
	return(symbolset7_all);
	
}

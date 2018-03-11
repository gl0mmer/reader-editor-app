
//-- init ----------------------------------------------------------------

common.browser = check_browser();
common.style.vmin = Math.min(window.innerWidth, window.innerHeight)/100;
common.style.init_font(0.9,1.1);

document.addEventListener("click",handler,true);
if ('speechSynthesis' in window) {
	var msg = new SpeechSynthesisUtterance();
}

//-- init functions ------------------------------------------------------

function handler(e){                                                     consolelog_func('orange'); 
	var time = new Date().getTime();
	var type = e.target.type;     
	if (type===undefined){
		if (time-common.time_click<common.time_delay) {                      
			e.stopPropagation();
		    e.preventDefault();
		}
		else{ common.time_click = time; }
	}
}

function check_browser(){                                                consolelog_func(); 
    c = navigator.userAgent.search("Chrome");
    f = navigator.userAgent.search("Firefox");
    m8 = navigator.userAgent.search("MSIE 8.0");
    m9 = navigator.userAgent.search("MSIE 9.0");
    if (c > -1) {
        browser = "Chrome";
    } else if (f > -1) {
        browser = "Firefox";
    } else if (m9 > -1) {
        browser ="MSIE 9.0";
    } else if (m8 > -1) {
        browser ="MSIE 8.0";
    } else{ browser = "Other";}
    return browser;
}


//-- utter functions -----------------------------------------------------

function utter_paragraph(id, id_all, stop){                              consolelog_func(); 
	var txt_arr = [];
    for (var i=0; i<id_all.length; i++){
        var txt = document.getElementById(id_all[i]).innerText;
        txt_arr.push(txt);
    }                                                                    console.log('P-Arr: ',txt_arr);
    utter_recursive(txt_arr, 1, 0, 0);
}    
function utter_split_sentence(txt){
	var txt_arr = [];
    var proceed=true; 
    var ii=0, i=0, txt_i='', part_i='';
    var i1=0, i2=0;
    while(proceed){
        if (txt.length>200){
            txt_i=txt.substring(0,200);
            i1=txt_i.lastIndexOf('. ');                                    
            i2=txt_i.lastIndexOf(',');
            i = Math.max(i1,i2);                                
            if (i===-1){i=txt_i.lastIndexOf(' ');}
            part_i=txt_i.substring(0,i+1);
            txt=txt.substring(i+1);
            ii++;
            txt_arr.push(part_i);
        }else{                                                           
			proceed=false;                                               
            txt_arr.push(txt);
        }
    }                                                                    //console.log('S-Arr: ',txt_arr);
    return txt_arr;
}
function utter_sentence(txt, stop, repeat){                              consolelog_func();  
    if (repeat!==undefined){ txt=common.repeat_text; }                   //console.log(txt);
    
    if (txt.length>200){ 
		var txt_arr = utter_split_sentence(txt);
		utter_recursive(txt_arr, 1, 0, 0); 
	}else{ utter(txt, stop); }
}
function utter(txt, stop){                                               consolelog_func(); 
	if ( !('speechSynthesis' in window)) { return true; }  
    
    var ru = /[а-яА-ЯЁё]/.test(txt); var en = /[a-zA-Z]/.test(txt); 
    if (common.lang=='auto'){ 
		if (en && en+ru==1){ msg.lang='en'; } 
		if (ru && ru+en==1){ msg.lang='ru'; } 
		if (ru==en){ msg.lang=common.langbase; }	
	}
    else { msg.lang=common.lang; }                                       //console.log(common.lang, common.langbase,  msg.lang, en+'-'+ru);
    //msg.rate = rate;                                                     //console.log('rate: '+msg.rate+', lang: '+msg.lang+', txt: '+msg.text+', stop: '+stop);
    //msg.rate = 0.9;                                                     //console.log('rate: '+msg.rate+', lang: '+msg.lang+', txt: '+msg.text+', stop: '+stop);
    if (stop==1){ window.speechSynthesis.cancel(); }   
      
    var elem = document.getElementById('js_playpause');
    if (elem){                                                           //
	    msg.onstart=function(event){ 
			common.play_counter=1; 
			common_playpause_icon(1); 
			console.log('--START-- '+event.utterance.text);
		};
	}
	msg.text = txt;  
    window.speechSynthesis.speak(msg);  
}    
var utter_recursive = function(text_arr, stop, onend, i, play_all) {
	if ( !('speechSynthesis' in window)) { return true; }
    var txt = text_arr[i];
    if (txt.length>200){ 
		var arr = utter_split_sentence(txt);
		var a = text_arr.slice(0,i); 
		var b = text_arr.slice(i+1);                                     //console.log('Concat: ',i,a,b,arr,' | ');
		text_arr = a.concat(arr).concat(b); 
		txt = text_arr[i]; 
	}
   
    if (i>0){ stop=0; 
	}else if(i>text_arr.length-2){ onend = 0; }
	
	if (i<text_arr.length-1){
		msg.onend=function(event){                                       //console.log('Rec '+i+': '+text_arr[i]+' - '+stop);
			common_playpause_icon(0);
			utter_recursive(text_arr, stop, onend, i+1);
		};
	}else if (common.utter_playall==1){
		msg.onend=function(event){                                
			common_playpause_icon(0);      
			reader_scroll(1,0,1); };
	}else{ 
		msg.onend=function(event){
			common_playpause_icon(0);
			return true;
		}
	}
	utter(txt, stop); 
};

function utter_stop(order){
	if ( 'speechSynthesis' in window) {
		if (window.speechSynthesis.speaking ){                        
				window.speechSynthesis.pause();       
		}
		if (order=='cancel'){
			window.speechSynthesis.cancel(); 
		}
	}
}

function common_playpause_icon(i){
	var elem = document.getElementById('js_playpause');
    if (elem){          
		elem.innerHTML=symbols_play_pause[i];                            //console.log(i);
	}else{
		console.log('No elem "playpause"!');
	}
}

//-- cookie functions ----------------------------------------------------

function cookie_get(cname) {                                             //consolelog_func(); 
    var name = cname + "=";                                              
    decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');  
    var i;  var c;
    for( i = 0; i <ca.length; i++) {
        c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }                                                                    
    return "";
}
function cookie_set(cname, cvalue, exdays){                              //consolelog_func(); 
	if (exdays===undefined) {exdays=60;}
	var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 3600 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function cookie_delete_all() {                                           consolelog_func(); 
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

//-- menu functions ------------------------------------------------------

function common_set_clickdelay(delay){                                      consolelog_func(); 
	common.time_delay = delay*1000;                                     
	document.getElementById('place_delay').innerHTML = delay+' sec';
}

function common_set_lang(lang){                                   consolelog_func(); 
	common.langbase = lang; 
	document.getElementById('place_lang').innerHTML = lang;
	        
}

function common_set_fontsize(id, obj){                                   consolelog_func(); //console.log('scale: '+id+'|'+obj);
	obj = parseInt(obj); 
	
	var s = common.style;
	var classname = ''; var lineheight = 1.1; 
	var alpha_def=s.fontalpha_def; 
	var font_default = 3;
	if (obj==0){ classname = 'files_name';  lineheight = s.f_lineheight; font_default = s.f_fontsize; }
	if (obj==1){ classname = 'text_scroll'; lineheight = s.r_lineheight; font_default = s.r_fontsize; }                         
	var scale = parseFloat(id);                                          //console.log('scale: '+id);
    var alpha = alpha_def-(0.11-0.05*(scale-1)/2.0)*(scale-1);                                 
    var fontsize = font_default*scale*s.vmin;                            //console.log('Fontsize: '+fontsize+' | '+alpha);
    common.style.f_fontalpha = alpha;
    
    var elem = document.getElementById('place_fontsize');
    if (elem) {
		elem.style.fontSize = fontsize+'px'; 
		elem.style.color = 'rgba(0,0,0,'+alpha+')';
	}
    $('.'+classname).css('font-size', fontsize+'px');
    $('.'+classname).css('line-height', lineheight*fontsize+'px');
    $('.'+classname).css('color', 'rgba(0,0,0,'+alpha+')');
    if (obj==0){ common.f_fontsize_scale = scale;   common.style.f_fontalpha = alpha; }
    if (obj==1){                                            //console.log('READER');
		common.r_fontsize_scale = scale;   common.style.r_fontalpha = alpha; 
		var elem = document.getElementById('text_scroll_area');
	    elem.style.fontSize = fontsize+'px';                             //console.log(elem.style.fontSize);
		elem.style.color = 'rgba(0,0,0,'+common.style.r_fontalpha+');'; 
		elem.style.lineHeight = lineheight*fontsize+'px'; 
	}  
	
    //common.style.resize();                    
}


//-- path functions ------------------------------------------------------

function get_subdir(name){                                               consolelog_func(); 
	var i1 = name.indexOf('/');
    var i2 = name.indexOf('/',i1+1);
    var dir = "";
    if (i2==-1) {dir='';}
    else{ dir=name.substr(i1+1,i2-i1-1); }                               //console.log(dir);     
    
    i1 = name.indexOf('/',name.indexOf('/')+1);
    i2 = name.indexOf('/',i1+1);
    if (dir==="guests"){
		i1 = i2*1;
		i2 = name.indexOf('/',i1+1);
	}
    if (i2==-1) {dir='';}
    else{ dir=name.substr(i1+1,i2-i1-1); }                               //console.log(dir);     
    return(dir);
}
function get_usrname(fname_i){                                           //consolelog_func(); 
    var i1 = fname_i.indexOf('/');
    var i2 = fname_i.indexOf('/',i1+1);
    var dir = "";
    if (i2==-1) {dir='';}
    else{ dir=fname_i.substr(i1+1,i2-i1-1); }                            //console.log(fname_i+" | "+dir);     
    return(dir);
}

function common_get_dir(fname){
	var dir = localStorage.getItem("working_dir");                       //console.log('dir2: '+dir);
	dir = dir.substring(dir.indexOf('/')+1);
	return dir;
}
function common_make_fname(fname){	  
    var i = fname.lastIndexOf('/');
    var name = fname.substring(i+1);
    var dir = user.name +'/'+ fname.substring(0,i+1);                    //console.log('Path: '+files.dir);
    return([dir, name]);
}

//-- misc functions ------------------------------------------------------

function consolelog_func(color, noargs) { 
	if (color===undefined) { color='green'; }
	var caller = consolelog_func.caller;
	var arg = consolelog_func.caller.arguments;
	var name = consolelog_func.caller.name;
	var i=0;
	var msg_arg = "";
	
	if (noargs===true){ arg = []; }
	for (i=0; i<arg.length; i+=1) {
		if (i>0){ msg_arg+=', '; }
		msg_arg += typeof arg[i];
		if(arg[i]!==undefined){ 
			if(arg[i].length>100){ msg_arg += '= -- too long --'; }
			else { msg_arg += '='+arg[i]; }
		}
	}
	var msg = name+'('+msg_arg+')';
	var lvl = 0;
	if (caller.caller!=null) { 
		lvl = 1;
		if (caller.caller.caller!=null) {
			lvl = 2;
			if (caller.caller.caller.caller!=null){
				lvl = 3;
				if (caller.caller.caller.caller.caller!=null){
					lvl = 4;
					if (caller.caller.caller.caller.caller!=null){
						lvl = 5;
						if (caller.caller.caller.caller.caller!=null){
							lvl = 6;
						}
					}
				}
			}
		}
	}
	var msg_shift = "";
	var shift = ". ";
	for (i=0; i<lvl; i+=1) { 
		if (i<3 || i==lvl-1){msg_shift += shift; }
		else {msg_shift += '.'; }
	}
	//if (lvl>3) { msg+= " <-- " + caller.caller.name + "()"; }
	//console.log('%c'+msg_shift+msg, 'color:'+color); 
	
}
function consolelog(text, lvl, color){
	if (lvl===undefined) { lvl = 1; }
	if (color===undefined) { color='grey'; }
	var i=0; var shift = '  ';
	for (i=0; i<lvl; i+=1) { text = shift+text; }
	console.log('%c'+text, 'color:'+color); 
}


function welcome_donot(){                                                consolelog_func();
	common.welcome="donot";
	cookie_set("welcome_", "donot");
}

function merge_options(obj1,obj2){                                       consolelog_func(); 
    obj3 = {};
    for (attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}
function concatenate_arr(arr1, arr2){                                    consolelog_func(); 
	for (i=0; i<arr2.length; i++){ arr1.push(arr2[i]); } 
	return(arr1);
}

//-- not used ------------------------------------------------------------

function common_textto_read(text){                                       consolelog_func(); 
	text = text.replace('<br>', ' new line ');
	text = text.replace('<abbr>', '');
	text = text.replace('</abbr>', '');
	return(text);
}

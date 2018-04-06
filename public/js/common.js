
//-- init ----------------------------------------------------------------

common.browser = check_browser();

var dict = {};                                    

document.addEventListener("click",handler,true);
if ('speechSynthesis' in window) {
	var msg = new SpeechSynthesisUtterance();
}

var ctrlDown = false, ctrlKey = 17, cmdKey = 91, vKey = 86, cKey = 67;
$(document).keydown(function(e) {                                
	if (e.keyCode == ctrlKey || e.keyCode == cmdKey) {ctrlDown = true; }
 }).keyup(function(e) {
	if (e.keyCode == ctrlKey || e.keyCode == cmdKey) {ctrlDown = false; }
}); 

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
        
	    if (txt.length>200){ 
			var arr = utter_split_sentence(txt);
			txt_arr = txt_arr.concat(arr); 
		}else{
			txt_arr.push(txt);
		}
		
    }                                                                    
    if (txt_arr.length<2){ txt_arr.push(" "); }                          //console.log('P-Arr: ',txt_arr);
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
    } 
    return txt_arr;
}
function utter_sentence(txt, stop, repeat){                              consolelog_func();  
    if (repeat!==undefined){ txt=common.repeat_text; }                   
    
    if (txt.length>200){ 
		var txt_arr = utter_split_sentence(txt);
	}else{ 
		var txt_arr = [txt,''];
	}                                                                    //console.log('S-Arr: ',txt_arr);
	utter_recursive(txt_arr, 1, 0, 0);
	
}
function utter(txt, stop, rate, onend){                                  consolelog_func();  
	if ( !('speechSynthesis' in window)) { return true; }                //console.log('U: |'+stop+'|'+rate+'|'+onend); 
    
    txt = common_textto_read(txt);                                       //console.log('T:'+txt.replace(/ /g,'')+'|');
    var ru = /[а-яА-ЯЁё]/.test(txt); var en = /[a-zA-Z]/.test(txt); 
    if (common.lang=='auto'){ 
		if (en && en+ru==1){ msg.lang='en'; } 
		if (ru && ru+en==1){ msg.lang='ru'; } 
		if (ru==en){ msg.lang=common.langbase; }	
	}
    else { msg.lang=common.lang; }                                       
    
    if (typeof rate != 'number'){ msg.rate=common.utter_rate; }
    else{ msg.rate=rate; }                                               
    if (localStorage.getItem("in_reader")!='yes'){ msg.rate=1; };
    
    if (stop==1){ window.speechSynthesis.cancel(); }   
    
    msg.onstart = function(event){ };

	if (onend==1){     
		msg.onend=function(event){                                       //console.log('--END-- scroll');
			reader_scroll(1,0,0); 
		};
	}
	msg.text = txt;  
    window.speechSynthesis.speak(msg);  
}    
var utter_recursive = function(text_arr, stop, onend, i, rate) {         //console.log('recursive: |'+stop+'|'+onend+'|-'+i+'-|'+rate);
	if ( !('speechSynthesis' in window)) { return true; }                
    
    if (i==0){ common.utter_recursive_done=0; }
    if (i>0){ stop=0; 
	}else if(i>text_arr.length-2){ onend = 0; }
	
	var utter_onend = 0;
	if (rate==undefined){rate=common.utter_rate;}
	
	if (i<text_arr.length-1){
		msg.onend=function(event){                                       //console.log('--end-- '+i+'-'+text_arr.length);
			utter_recursive(text_arr, stop, onend, i+1, rate);           
		};
	}else if (common.utter_playall==1){                                  
		utter_onend = 1;
	}else{ 
		msg.onend=function(event){                                       //console.log('--END-- '+i+'-'+text_arr.length);
			common.utter_recursive_done=1;
			common_playpause_icon(0);
			return true;
		}
	}
	utter(text_arr[i], stop, rate, utter_onend); 
};

function common_play_pause(){                                            consolelog_func(); 
	// 0 - to speak/resume, 1 - to pause, 

	if ( 'speechSynthesis' in window){                                   //console.log('play: ', common.play_counter,common.utter_recursive_done);
		if (common.play_counter==1 ){   
			window.speechSynthesis.pause();                                 
	        common_playpause_icon(0);
	    }
		else if (common.utter_recursive_done==1){
			common_playpause_icon(1);
			
			if( localStorage.getItem("in_reader")=="yes")	{
				reader_utter(1, 0); 
			}else if (common.repeat_text!=''){
				utter_sentence(common.repeat_text, 1, 0); 
			}
		}
	    else if (common.play_counter==0){                                                            
	        window.speechSynthesis.resume();                                             
	        common_playpause_icon(1);
	    }
	}
}

function utter_stop(order){
	if ( 'speechSynthesis' in window) {
		common.utter_playall = 0; 
		common.utter_recursive_done = 1;                                 //console.log('STOP!!!'); 
		
		msg.onend = function(event){ };
		window.speechSynthesis.cancel();
		common_playpause_icon(0);
		msg = new SpeechSynthesisUtterance();
	}
}

function common_playpause_icon(i){
	var elem = document.getElementById('js_playpause');
    if (elem){          
		elem.innerHTML=symbols_play_pause[i];                            //console.log(i);
		common.play_counter=i; 
	}
}

//-- cookie functions ----------------------------------------------------

function cookie_get(cname) {                                             //consolelog_func(); 
    var name = cname + "=";                                              //console.log(document.cookie);         
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

function common_set_clickdelay(delay){                                   consolelog_func(); 
	common.time_delay = delay*1000;                                     
	document.getElementById('place_delay').innerHTML = delay+' sec';
}

function common_set_lang(lang){                                          consolelog_func(); 
	common.langbase = lang; 
	document.getElementById('place_lang').innerHTML = lang;	  
	dict = lang[common.langbase];        
	location.reload();
	//files_start();
	//files_resize();
}
function common_set_utterrate(rate){                                     consolelog_func();
	console.log('rate: '+rate);
	common.utter_rate = rate; 
	utter_stop();
	if ('speechSynthesis' in window) {
		msg.rate = rate;
		msg.text = dict.place_utterrate;
		window.speechSynthesis.speak(msg); 
	}       
}

function common_set_fontsize(id, obj){                                   //consolelog_func(); console.log('scale: '+id+'|'+obj);
	obj = parseInt(obj); 
	
	var s = common.style;
	var classname = ''; var lineheight = 1.1; 
	if (obj==0){ classname = 'files_name';  lineheight = s.f_lineheight; font_default = s.f_fontsize; }
	if (obj==1){ classname = 'text_scroll'; lineheight = s.r_lineheight; font_default = s.r_fontsize; }                         
	var scale = parseFloat(id);                                          //console.log('scale: '+id);
    var alpha = 0.58-(0.11-0.042*(scale-1)/2.0)*(scale-1);                                 
    var fontsize = font_default*scale*s.rmin;                            //console.log('Fontsize: '+fontsize+' | '+alpha, s.rmin);
    common.style.f_fontalpha = alpha;
    
    var elem = document.getElementById('place_fontsize');
    if (elem) {
		elem.style.fontSize = fontsize+'vmin'; 
		elem.style.color = 'rgba(0,0,0,'+alpha+')';
	}
 
    $('.'+classname).css('font-size', fontsize+'vmin');
    $('.'+classname).css('line-height', lineheight*fontsize+'vmin');
    $('.'+classname).css('color', 'rgba(0,0,0,'+alpha+')');
    if (obj==0){ 
		common.f_fontsize_scale = scale;   
		common.style.f_fontalpha = alpha; 
		$('.buttons').css('font-size', fontsize*s.get_bfontsize_ratio()+'vmin');
	}
    if (obj==1){                                                         //console.log('READER');
		common.r_fontsize_scale = scale;   common.style.r_fontalpha = alpha; 
		var elem = document.getElementById('text_scroll_area');
	    elem.style.fontSize = fontsize+'vmin';                           //console.log(elem.style.fontSize);
		elem.style.color = 'rgba(0,0,0,'+common.style.r_fontalpha+');'; 
		elem.style.lineHeight = lineheight*fontsize+'vmin'; 
	}  
	
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

function editor_textto_read(text){                                       consolelog_func('grey'); 
	text = text.replace(/<br>/g, ' new line ');
	text = text.replace(/<abbr>/g, '');
	text = text.replace('</abbr>', '');
	return(text);
}
function common_textto_read(text){                                       consolelog_func('grey'); 
	text = text.replace(/<br>/g, ' ');                                   
	text = text.replace(/\n/g,' ');   
	return(text);
}
function editor_textto_paste(text){
	//text = text.replace(/>/g, '&gt;'); 
	//text = text.replace(/</g, '&lt;'); 
	text = text.replace(/>/g, ''); 
	text = text.replace(/</g, ''); 
	return(text);
}

function common_phpresponse(data, refresh){
	if (refresh){ refreshFoldersAndItems('OK'); }                        //console.log('R: ',data);
	if (data[0]!='{'){ console.log('Error:notJSON'); return true; }
	
	var response = JSON.parse(data);                                     
	//if (response.msg){ console.log('PHP_LOG ', response.log, response.log.length); }
	
	var alert_text = '';
	var msg='';
	if (response.msg){                                                   //console.log('PHP_MSG: ', response.msg, response.msg.length); 
		alert_text = '';
		var arr = response.msg;
		if (arr.length>0){
			for (i=0; i<arr.length; i++){
				msg = arr[i];
				if (dict[msg]){ alert_text += dict[msg]+'<br>'; }
			}
			common.alert_text += alert_text;
		}
	}
	
	if (response.errors){                                                //console.log('PHP_ERR: ', response.errors, response.errors.length); 
		var arr = response.errors;                                       
		if (arr.length>0){
			alert_text = '';
			var msg='';
			for (i=0; i<arr.length; i++){
				msg = arr[i];
				alert_text+= dict['error_start'];
				if (dict[msg]){ alert_text+= dict[msg]+'<br>'; }
			}
			common.alert_text += alert_text;
		}
	}
	if (common.alert_text!=''){ common_show_notification(common.alert_text); }
	
}

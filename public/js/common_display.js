

function menu_blur(ineditor){                                            consolelog_func(); 
	
	if (ineditor===undefined) {ineditor=false;}
	if (common.browser!='Firefox'){
		if (ineditor){ $('#editor_base_elements').foggy({ blurRadius:5, opacity:0.8, cssFilterSupport:true }); }
		else{          $('#base_elements').foggy({ blurRadius:5, opacity:0.8, cssFilterSupport:true }); 
		}
	}
}
function menu_back(id, foggyoff, ineditor){                              consolelog_func(); 
	utter_stop();
	common.repeat_text = '';
	if (ineditor===undefined) {ineditor=false;}
	
	if (common.browser!='Firefox'){
		if (ineditor){ if (foggyoff==1){ $('#editor_base_elements').foggy(false);  } }
		else{          if (foggyoff==1){ $('#base_elements').foggy(false);  } }
	}
	
    elem = document.getElementById(id).parentNode;                       //console.log('Parent id: '+elem.getAttribute('id')+' | '+elem.parentNode.getAttribute('id'));
    elem.parentNode.removeChild(elem);
}

function scroll_to(id, id_area, title){                                  consolelog_func(); 
    if (title==0){ elem = document.getElementById(id);  }
    else { elem= document.querySelectorAll('[id="'+id+'"]')[1]; 
    }
    area = document.getElementById(id_area).getBoundingClientRect();     
    rect = elem.getBoundingClientRect();                                 //console.log(rect);
    if (rect.top+0.5*(rect.bottom-rect.top)>area.bottom || rect.left+0.5*(rect.right-rect.left)>area.right || rect.bottom-0.5*(rect.bottom-rect.top)<area.top || rect.right-0.5*(rect.right-rect.left)<area.left )
        {elem.scrollIntoView(true);} 
}

function common_disable_button(id, disable, todo){
	var elem = document.getElementById(id);
	if (elem){
		if (disable){
			elem.onclick = "";
			$("#"+id).addClass("disabled");
		}else{
			elem.onclick = todo;
			$("#"+id).removeClass("disabled");
		}
	}
}


//-- create html ---------------------------------------------------------


function button_html(lvl, arr, y_dim, x_dim){
	if (y_dim==undefined){ y_dim = 2; }
	if (x_dim==undefined){ x_dim = 4; }
	var class_arr = [["symbol", "menu2"],
	                 ["buttons_menu", "", "", "disabled buttons_menu"]];
	
	var html = '';
	var name = '', tail='', inner='', id='';
	var pos = [];
	for (var i=0; i<arr.length; i++){
		pos = arr[i][2];                                                 //console.log(arr[i]);
		name = arr[i][0]; 
		inner = dict[name];
		if (arr[i].length>3){                                            //console.log('inner: '+inner);           
			tail = inner[ 2+ arr[i][3] ];
			id = tail;
			inner = inner[0] +' '+ tail +' '+ inner[1];
		}else{
			inner = dict[ arr[i][0] ];
			id = name;
		}                                                                //console.log('name: '+name+'|'+tail+'|'+inner);
		var class_name = class_arr[lvl][pos[1]];
		if (lvl==0){ var style = style_buttonpos(pos[0],pos[1], y_dim, x_dim); }
		if (lvl==1){ var style = style_buttonpos_menu(pos[0],pos[1], y_dim, x_dim); }
		if (lvl==1 && pos[1]==2){
			html += '<div id="'+id+'_box" class="button_zoom_box " onclick="'+arr[i][1]+'" style="'+style+'"><div id="'+id+'" class="text_zoom">'+inner+'</div></div>';
		}else{
			html += '<div id="'+id+'" onclick="'+arr[i][1]+'" class="buttons '+class_name+'" style="'+style+'">'+inner+'</div>' ;
		}
	}
	return html;
}

function common_create_menu(id, lvl, buttons_html, parent, ineditor){    consolelog_func(); 
	if (parent==undefined) { parent='created_elements'; }
    if (lvl==0){                                                         
        menu_blur(ineditor);
        inner_e = '<div id="menu_back_lvl0"  onclick="menu_back(this.id,1,'+ineditor+');" class="back_area"></div>';
        inner_e+= '<div id="menu_area"  class="menu_area">';
    }else{                                                               
        inner_e = '<div id="menu_back_lvl2"  onclick="menu_back(this.id,0,'+ineditor+');" class="back_area" style="opacity:0;"></div>';
        inner_e+= '<div id="menu_area1"  class="menu_area" style="background-color:rgba(100,100,100,0.2);"></div>';
        inner_e+= '<div id="menu_area2"  class="menu_area_lvl2">';
        }                                                                
    var elem = document.createElement('div');                            //console.log('elem: '+elem+', parent: '+parent);
    elem.innerHTML = inner_e + buttons_html + '</div>';
    document.getElementById(parent).appendChild(elem);                   //console.log(elem.innerHTML);
    utter_stop();
    return (elem);
}

function common_show_notification(text, welcome, blur){                        consolelog_func();
	var elem = document.getElementById('menu_back_lvl0');
	if (elem){ menu_back('menu_back_lvl0',1, 0); }
	
	if (blur==undefined){blur=0;}
	var parent='created_elements';
	var id = "notification";
	var b_top = 90-common.style.b_height;
	common.repeat_text = common_textto_read(text);
	menu_blur();
	
	inner_e = '<div id="back_lvl" onclick="menu_back(this.id,'+blur+',false);" class="back_area"> </div>';
	inner_e+= '<div class="menu_area" >';
	inner_e+= '<div class="text_scroll_box" style="position:fixed;'
			+ 'top:'+15*common.style.ry+'vh; left:12vw;'
			+ 'width:76vw; height:'+(b_top-25)*common.style.ry+'vh;'
			+ 'font-size:'+4.8*common.style.ry+'vmin;line-height:'+7.5*common.style.ry+'vmin;'
			+ 'color: rgba(0,0,0,0.55);">';
	inner_e+= '<div class="text_scroll" align="left" style="top:0vh;"> <div class="reader_text" style="'
			+ 'top:'+(-5*common.style.ry)+'vh;height:'+20*common.style.ry+'vh;'
			+ '">'+text+' &nbsp </div> </div> </div> </div>' ;
      
    inner_e += button_html(1, [ ['js_playpause', 'common_play_pause();', [11,0]], ], 3,4);
                  
    element = document.createElement('div');
    element.setAttribute('id', id);
    element.innerHTML=inner_e;
    document.getElementById(parent).appendChild(element);
    return (element);	
}


//-- show menu -----------------------------------------------------------


function common_show_lang(lvl, parent){                                  consolelog_func(); 
    var inner_e = ''; var lang='';
    var inner_e = button_html(1, 
		[['js_lang', 'common_set_lang(this.id)',   [4,0], 0],
		 ['js_lang', 'common_set_lang(this.id)',   [5,0], 1],
		 ['place_lang', '',                        [0,2]],
		]);
    if (editor!=undefined) {parent = "editor_created_elements";}
    common_create_menu('common_lang',lvl, inner_e, parent);
    document.getElementById('place_lang').innerHTML = common.langbase;
}
function common_show_clickdelay(){                                       consolelog_func(); 
	var onclick = 'common_set_clickdelay(this.id);';
	var inner_e = button_html(1, 
		[['js_delay', onclick,  [4,0], 0], 
		 ['js_delay', onclick,  [5,0], 1],
		 ['js_delay', onclick,  [6,0], 2], 
		 ['js_delay', onclick,  [7,0], 3],
		 ['place_delay', '',    [0,2]]
	    ]);
    common_create_menu('common_clickdelay',1, inner_e);
    
    var delay = common.time_delay/1000;                                 
	document.getElementById('place_delay').innerHTML = delay+' sec';
}
function common_show_utterrate(){                                       consolelog_func(); 
	var onclick = 'common_set_utterrate(this.id);';
	var inner_e = button_html(1, 
		[['js_utterrate', onclick,  [7,0], 0], 
		 ['js_utterrate', onclick,  [6,0], 1],
		 ['js_utterrate', onclick,  [5,0], 2], 
		 ['js_utterrate', onclick,  [4,0], 3],
		 ['place_utterrate', '',    [0,2]]
	    ]);
    common_create_menu('common_utterrate',1, inner_e);
}

//-- buttons positions ---------------------------------------------------


function style_content_pars(){
	var s = common.style;
	var wratio = window.innerWidth/window.innerHeight;
	var bright = wratio*s.bright;
	var dx = s.dy*s.b_shape; 
	var x =  (bright - 2*dx - 1.5*s.xspace) ;
	var dy = s.dy/s.b_shape*wratio;                                        
	var y =  s.bright - 2*dy - 1.5*s.xspace ; 
	var z_height = s.zoomheight;
	if (wratio>1){
		var c_width = x;
		var b_left = c_width/wratio;
		c_width = b_left*0.96;
		var c_height = 100; 
		var b_top = 0; 
	}else{
		var c_height = y;
		var c_width = 100;
		var b_top= c_height;
		var b_left = 0; 
		z_height = z_height*wratio;
	}
	return ([c_height, c_width, z_height, b_top, b_left]);
	
}
	
function style_buttonpos(i, class_n){                                     //consolelog_func('brown');
	var s = common.style;
	
	var wratio = window.innerWidth/window.innerHeight;
	if (class_n===undefined) {class_n=0;}
    var bright = wratio*s.bright;           
    var n_x = (i-i%s.yn)/s.yn;
    
    var dy = s.dy;
    var dx = s.dy * s.b_shape; 
    var yspace = (s.bbot - s.btop - s.yn*s.dy ) / (s.yn-1); 
    var y =  s.btop + (i% s.yn) * (yspace + s.dy*1) ;
    var x =  bright - (s.xn - n_x) * dx - (s.xn - n_x - 1) * s.xspace ; 
    dx = dx/wratio;  x=x/wratio;
    
    if (wratio<1){ 
		n_x = (n_x+1)%2;
		var bleft = (100-s.bbot);
		var dx = s.dy; 
		var dy = dx/s.b_shape*wratio;                                        
	    var xspace = (100-2*bleft - s.yn*s.dy ) / (s.yn-1); 
	    var x =  bleft + (i%s.yn)*(xspace+dx*1) ;
	    var y =  s.bright - (s.xn-n_x)*dy - (s.xn-n_x-1)*s.xspace ; 
	}
    
    var fontsize = s.f_fontsize*common.f_fontsize_scale*s.b_fontsize_ratio;   
    var style = 'left:'+x*s.rx+'vw; top:'+y*s.ry+'vh;'
			  + 'width:'+dx*s.rx+'vw; height:'+dy*s.ry+'vh;'
			  + 'border-width:'+fontsize*s.rmin*0.+'vmin;'
			  + 'border-bottom-width:'+s.dy*0+'vmin;'
			  + 'border-top-width:'+s.dy*0+'vmin;'
			  + 'font-size:'+fontsize*s.rmin+'vmin; line-height:'+fontsize*1.1*s.rmin+'vmin;';	
    return(style); 
}

function style_buttonpos_menu(i, class_n, y_dim, x_dim){                 //consolelog_func('brown'); 
	if (y_dim==undefined){ y_dim = 2; x_dim = 4; }
	if (class_n===undefined) {class_n=0;}
	var s = common.style;
			
	var b_height = 17;
	var b_left = 10;  var b_right = 90; 
	var b_top = 10; var b_bot = 90;
	var wratio = window.innerWidth/window.innerHeight; 
	if (x_dim*y_dim==8){              
		if (wratio<1.3 && wratio>0.8){ x_dim=3; y_dim=3; }
		if (wratio>1.3 ){ x_dim=4; y_dim=2; }
		if (wratio<0.8 ){ x_dim=2; y_dim=4; }                           
	}else if (x_dim*y_dim==12){
		if (wratio<2.3 && wratio>1){ x_dim=4; y_dim=3; }
		if (wratio<1 && wratio>0.67){ x_dim=3; y_dim=4; }
		if (wratio>2.3 ){ x_dim=6; y_dim=2; }
		if (wratio<0.67 ){ x_dim=2; y_dim=6; } 
	}                                                                
	var nx = i%(x_dim); var ny = (i-i%(x_dim))/x_dim;
	if (wratio<1){wratio = 1;}
	var dx = s.dy*s.b_shape/wratio;
	
	var add = 0.6;
	var x = b_left + (b_right-b_left)/(x_dim+add) *(nx+1-(1-add)/2) - dx/2.;
	var y = b_top +  (b_bot-b_top)/(y_dim+add) *(ny+1-(1-add)/2) - s.dy/2.;       //console.log(dx,s.dy,x,y);
	
	var fontsize = s.f_fontsize*common.f_fontsize_scale*s.b_fontsize_ratio;   
	var lineheight = fontsize*1.2;                                   
	var borderwidth = fontsize*0.5;
	if (class_n===2) { 
		lineheight = lineheight+s.dy*s.ry/1.6; 
		dx = dx + (b_right-b_left)/(x_dim+add);
		borderwidth = 0;
	}        
	var style = 'left:'+x*s.rx+'vw; top:'+y*s.ry+'vh;'
			  + 'width:'+dx*s.rx+'vw; height:'+s.dy*s.ry+'vmin;'
			  + 'border-width:'+borderwidth*s.rmin+'vmin;'
			  + 'font-size:'+fontsize*s.rmin+'vmin; line-height:'+lineheight*s.rmin+'vmin;';  
	 
	return(style);
}

function style_resize(){                                                 consolelog_func('brown');
	var s = common.style;
	
	s.rx = window.innerWidth/document.body.clientWidth;   
    s.ry = window.innerHeight/document.body.clientHeight; 
	var wratio = window.innerWidth/window.innerHeight;
	if (wratio>1){ s.rmin = s.ry; }
	else{ s.rmin = s.rx; }

	var pars = style_content_pars();
	var elem = document.getElementById('content_box');
    if (elem){ 
		elem.style.width= pars[1]*s.rx+'vw';                      
		elem.style.height= pars[0]*s.ry+'vh'; 
	}
    var elem = document.getElementById('zoom_box');
    if (elem){ 
		elem.style.width= pars[1]*s.rx+'vw'; 
		elem.style.height= pars[2]*s.ry+'vh'; 
		elem.style.top= (pars[0]-pars[2])*s.ry+'vh';             
		elem.style.fontSize = 11*common.style.rmin+'vmin';
		elem.style.lineHeight = 18*common.style.rmin+'vmin';
	}
    var elem = document.getElementById('buttons_area');
    if (elem){ 
		elem.style.left= pars[4]*s.rx+'vw'; 
		elem.style.top= pars[3]*s.ry+'vh'; 
	} 
    
}	

//-- font size -----------------------------------------------------------

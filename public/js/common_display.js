

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
	if (y_dim==undefined){ y_dim = 2; x_dim=4; }                         //console.log('lang: ',reader_lang);
	if (dict==undefined){ common.langbase='en'; dict = reader_lang['en']; }   console.log(common.langbase); console.log(dict);
	var class_arr = [["green", "grey", "editor1", "editor2", 'editor1 disabled', 'editor2 disabled', 'editor1'],
	                 ["editor1", "", "", "disabled buttons_menu"]];
	
	var html = '';
	var name = '', tail='', inner='', id='';
	var pos = [];
	for (var i=0; i<arr.length; i++){
		pos = arr[i][2];                                                 //console.log(arr[i]);
		name = arr[i][0]; 
		inner = dict[name];
		
		if (pos.length>2){ 
			id = name; 
			inner = pos[2];
		}else if (arr[i].length>3){                                            
			tail = inner[ 2+ arr[i][3] ];
			id = tail;
			inner = inner[0] +' '+ tail +' '+ inner[1];
		}else{
			inner = dict[ name ];
			id = name;
		}                                                                //console.log('name: '+name+'|'+tail+'|'+inner);
		var class_name = class_arr[lvl][pos[1]];
		if (lvl==0){ var style = style_buttonpos(pos[0],pos[1], y_dim, x_dim); }   //console.log(style);
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
        inner_e+= '<div id="menu_area"  class="menu_area border">';
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
	common.repeat_text = common_textto_read(text);
	menu_blur();
	
	var fontsize = common.style.get_bfontsize();
	inner_e = '<div id="back_lvl" onclick="menu_back(this.id,'+blur+',false);" class="back_area"> </div>';
	inner_e+= '<div class="menu_area border" >';
	inner_e+= '<div class="text_scroll_box" style="position:fixed;'
			+ 'top:'+15*common.style.ry+'vh; left:12vw;'
			+ 'width:76vw; height:'+(52)*common.style.ry+'vh;'
			+ 'font-size:'+fontsize+'vmin;line-height:'+fontsize*1.5+'vmin;'
			+ 'color: rgba(0,0,0,0.55);">';
	inner_e+= '<div class="text_scroll" align="left" style="top:0vh;"> <div class="reader_text" style="'
			+ 'top:'+(-5*common.style.ry)+'vh;height:'+20*common.style.ry+'vh;'
			+ '">'+text+' &nbsp </div> </div> </div> </div>' ;
      
    inner_e += button_html(1, [ ['js_playpause', 'common_play_pause();', [11,0,symbol_play]], ], 3,4);
                  
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
	if (common.ineditor){ nrow = editor.style.b_ny; var bsize=editor.style.get_bsize(); var bspace=editor.style.get_bspace();}                    
	else { nrow = 2; var bsize = s.dy; var bspace = s.xspace; }                                 
	
	var wratio = window.innerWidth/window.innerHeight;
	var dx = bsize*s.b_shape; 
	//var x =  (100*wratio - nrow*dx - (nrow+1)*bspace) ;
	var x =  (100*wratio - nrow*dx - (nrow+0.)*bspace) ;
	var dy = bsize/s.b_shape*wratio;                                        
	var y =  100 - nrow*dy - (nrow)*bspace ; 
	
	var v_space = s.zoomleft*1.5;
	var z_height = s.zoomheight;  
	if (wratio>1 && common.ineditor==false){
		var c_width = x;
		var b_left = c_width/wratio;
		c_width = b_left-1.5-bspace/wratio;
		var c_height = 100; 
		var b_top = 0;  
	}else{
		var c_height = y;
		var c_width = 100-bspace;
		var b_top= c_height;
		var b_left = 0; 
		z_height = z_height*wratio;                                      
	}                   
	if (common.style.content_border==false){
		c_height += 2*v_space;
	}                                                                    //console.log('ineditor: ', common.ineditor, [c_height, c_width, z_height, b_top, b_left]);  
	return ([c_height, c_width,  z_height,  b_top, b_left, v_space]);
	
}
	
function style_buttonpos(i, class_n, y_dim, x_dim){             //consolelog_func('brown');
	var s = common.style;
	if (y_dim==undefined){ y_dim = 4; x_dim = 2; }
	if (common.ineditor) {
		var bsize = editor.style.get_bsize(); 
		var bspace = editor.style.get_bspace();
		x_dim = x_dim+y_dim; y_dim=x_dim-y_dim; x_dim=x_dim-y_dim; 
	}else{ 
		var bsize = s.dy; 
		var bspace = s.xspace;
	}
	
	var wratio = window.innerWidth/window.innerHeight;
    var n_x = (i-i%y_dim)/y_dim;
    
    if (wratio<1 || common.ineditor){                                    //console.log('ineditor');
		var bleft = (100-s.bbot);
		var dx = bsize; 
		var dy = dx/s.b_shape*wratio;  
		                                      
	    if (common.ineditor){
			var xspace = (100 - y_dim*bsize ) / (y_dim);
			var x =  xspace*0.5 + (i%y_dim)*(xspace+dx) ; 
		}else{
			var xspace = (100-2*bleft - y_dim*bsize ) / (y_dim-1); 
			var x =  bleft + (i%y_dim)*(xspace+dx*1) ;
		}
	    var y =  100 - (x_dim-n_x)*dy - (x_dim-n_x-0.5)*bspace ; 
	}else{
		var dy = bsize;
		var dx = bsize * s.b_shape; 
		var yspace = (s.bbot - s.btop - y_dim*bsize ) / (y_dim-1); 
		var y =  s.btop + (i% y_dim) * (yspace + bsize*1) ;
		var x =  100*wratio - (x_dim - n_x) * dx - (x_dim - n_x) * bspace ; 
		dx = dx/wratio;  x=x/wratio;
	}
    
    var padding = 0.7;
    var fontsize = s.get_bfontsize();
    if (common.ineditor){ padding = 0.5; }  
    if (class_n==6){ fontsize = fontsize*1.2; }  
    var style = 'left:'+x*s.rx+'vw; top:'+y*s.ry+'vh;'
			  + 'width:'+dx*s.rx+'vw; height:'+dy*s.ry+'vh;'
			  + 'padding-left:'+padding*fontsize+'vmin;'
			  + 'padding-right:'+padding*fontsize+'vmin;'
			  //+ 'background-clip: content-box;'
			  + 'font-size:'+fontsize+'vmin; line-height:'+fontsize*1.2+'vmin;';	
    return(style); 
}

function style_buttonpos_menu(i, class_n, y_dim, x_dim){                 //consolelog_func('brown'); 
	if (y_dim==undefined){ y_dim = 2; x_dim = 4; }
	if (class_n===undefined) {class_n=0;}
	var s = common.style;
			
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
	
	var fontsize = s.get_bfontsize();  
	var lineheight = fontsize*1.2;                                   
	if (class_n===2) { 
		lineheight = lineheight+s.dy*s.ry/1.6; 
		dx = dx + (b_right-b_left)/(x_dim+add);
		borderwidth = 0;
	}        
	var style = 'left:'+x*s.rx+'vw; top:'+y*s.ry+'vh;'
			  + 'width:'+dx*s.rx+'vw; height:'+s.dy*s.ry+'vmin;'
			  + 'padding-left:'+0.7*fontsize+'vmin;'
			  + 'padding-right:'+0.7*fontsize+'vmin;'
			  //+ 'background-clip: content-box;'
			  + 'font-size:'+fontsize+'vmin; line-height:'+lineheight+'vmin;';  
	 
	return(style);
}

function style_resize(){                                                 consolelog_func('brown');
	var s = common.style;
	
	s.rx = window.innerWidth/document.body.clientWidth;   
    s.ry = window.innerHeight/document.body.clientHeight; 
	var wratio = window.innerWidth/window.innerHeight;                   //console.log(wratio);
	if (wratio>1){ s.rmin = s.ry; }
	else{ s.rmin = s.rx; }

	[c_height, c_width,  z_height,  b_top, b_left, v_space] = style_content_pars();
	var border = common.style.content_border;
	
	var name = 'content_box';
	if (common.ineditor){name = 'editor_text_scroll'; }
	var elem = document.getElementById(name);
    if (elem){ 
		if (border){
			elem.style.top    = (v_space*s.ry)+'vh';                    
			elem.style.height = (c_height-2*v_space)*s.ry+'vh';   
		}else{        
			elem.style.top    = (-v_space*s.ry)+'vh';                    
			elem.style.height = (c_height)*s.ry+'vh';   
		}
		if (common.ineditor){
			elem.style.top    = '0vh';     
			elem.style.height = (c_height-0*v_space)*s.ry+'vh';   
			elem.style.width = (100)*s.rx+'vw';                      
			elem.style.left  = (0*v_space)*s.rx+'vw';      
		}else{
			elem.style.width = c_width*s.rx+'vw';                      
			elem.style.left  = s.zoomleft*s.rx+'vw';   
		}                   
	}
	
	var elem = document.getElementById('files_scroll');
	if (elem){ elem.style.top = (v_space*s.ry)+'vh'; }
	
	if (border==false){
		var elem = document.getElementById('files_array');
		if (elem){ elem.style.top = (3*v_space*s.ry)+'vh'; }
	}
	
    
    var elem = document.getElementById('zoom_box');
    if (elem){ 
		if (wratio<1){
			elem.style.width = 100*s.rx+'vw'; 
			elem.style.left  = 0*s.rx+'vw'; 
		}else{
			elem.style.width = (c_width)*s.rx+'vw'; 
			elem.style.left  = 1.5*s.rx+'vw'; 
		}
		elem.style.height = (z_height-v_space)*s.ry+'vh';
		if (border){ elem.style.top = (c_height-z_height)*s.ry+'vh';  
		}else{       elem.style.top = (c_height-z_height-2*v_space)*s.ry+'vh'; }            
		elem.style.fontSize   = 11*common.style.rmin+'vmin';
		elem.style.lineHeight = 18*common.style.rmin+'vmin';
	}
	
	name = 'buttons_area';
	if (common.ineditor){name = 'editor_buttons_area'; }
    var elem = document.getElementById(name);
    if (elem){         
		elem.style.height = (100-2*v_space)*s.ry+'vh'; 
		if (common.ineditor){
			elem.style.top  = (b_top)*s.ry+'vh'; 
			elem.style.width  = (100)*s.rx+'vw'; 
			elem.style.left = (0)*s.rx+'vw'; 
		}else{
			elem.style.top  = (b_top+v_space)*s.ry+'vh'; 
			elem.style.width  = (100-c_width-2*v_space)*s.rx+'vw'; 
			elem.style.left = (b_left-0.5*v_space)*s.rx+'vw'; 
		}
	} 
    
}	

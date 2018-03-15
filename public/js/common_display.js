

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
	var class_arr = [["symbol", "editor"],
	                 ["buttons_menu", "", "", "disabled buttons_menu"]];
	
	var html = '';
	var name = '', tail='', inner='', id='';
	var pos = [];
	for (var i=0; i<arr.length; i++){
		pos = arr[i][1];                                                 //console.log(arr[i]);
		name = arr[i][0]; 
		inner = dict[name];
		if (arr[i].length>2){                                            //console.log('inner: '+inner);           
			tail = inner[ 2+ arr[i][2] ];
			id = tail;
			inner = inner[0] +' '+ tail +' '+ inner[1];
		}else{
			inner = dict[ arr[i][0] ];
			id = name;
		}                                                                //console.log('name: '+name+'|'+tail+'|'+inner);
		var class_name = class_arr[lvl][pos[1]];
		if (lvl==0){ var style = common.style.buttonpos(pos[0],pos[1], y_dim, x_dim); }
		if (lvl==1){ var style = common.style.buttonpos_menu(pos[0],pos[1], y_dim, x_dim); }
		if (lvl==1 && pos[1]==2){
			html += '<div id="'+id+'_box" class="button_zoom_box " onclick="'+dict_onclick[name]+'" style="'+style+'"><div id="'+id+'" class="text_zoom">'+inner+'</div></div>';
		}else{
			html += '<div id="'+id+'" onclick="'+dict_onclick[name]+'" class="buttons '+class_name+'" style="'+style+'">'+inner+'</div>' ;
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
      
    inner_e += button_html(1, [ ['js_playpause', [11,0]], ], 3,4);
                  
    element = document.createElement('div');
    element.setAttribute('id', id);
    element.innerHTML=inner_e;
    document.getElementById(parent).appendChild(element);
    return (element);	
}


//-- show menu -----------------------------------------------------------


function common_show_lang(lvl, parent){                                  consolelog_func(); 
    var inner_e = ''; var lang='';
    var inner_e = button_html(1, [['place_lang', [0,2]],
                                  ['js_lang',    [4,0], 0],
                                  ['js_lang',    [5,0], 1],
                                 ]);
    if (editor!=undefined) {parent = "editor_created_elements";}
    common_create_menu('common_lang',lvl, inner_e, parent);
    document.getElementById('place_lang').innerHTML = common.langbase;
}

function reader_show_fontsize(){
	var inner_e = button_html(1, 
		[['js_rfontsize',    [4,0], 0], ['js_rfontsize',   [5,0],1],
		 ['js_rfontsize',    [6,0], 2], ['js_rfontsize',   [7,0],3],
		 ['js_rfontsize',    [3,0], 4], ['js_rfontsize',   [2,0],5],
		 ['place_fontsize', [0,2]   ],
		]);
	var alpha=common.style.r_fontalpha, font_def = common.style.r_fontsize, scale = common.r_fontsize_scale;
	var style='"color:rgba(0,0,0,'+alpha+'); font-size:'+font_def*scale*common.style.rmin+'vmin;"';
	
    common_create_menu('common_fontsize',1, inner_e);
}  
function files_show_fontsize(){
	var inner_e = button_html(1, 
		[['js_ffontsize',    [7,0], 0], ['js_ffontsize',   [6,0],1],
		 ['js_ffontsize',    [5,0], 2], ['js_ffontsize',   [4,0],3],
		 ['place_fontsize', [0,2]   ],
		]);
	var alpha=common.style.f_fontalpha, font_def = common.style.f_fontsize, scale = common.f_fontsize_scale;
	var style='"color:rgba(0,0,0,'+alpha+'); font-size:'+font_def*scale*common.style.rmin+'vmin;"';
	
    common_create_menu('common_fontsize',1, inner_e);
}  

function common_show_clickdelay(){                                       consolelog_func(); 
	var inner_e = button_html(1, 
		[['js_delay',    [4,0], 0], ['js_delay',   [5,0], 1],
		 ['js_delay',    [6,0], 2], ['js_delay',   [7,0], 3],
		 ['place_delay', [0,2]]
	    ]);
    common_create_menu('common_clickdelay',1, inner_e);
    
    var delay = common.time_delay/1000;                                 
	document.getElementById('place_delay').innerHTML = delay+' sec';
}
function common_show_utterrate(){                                       consolelog_func(); 
	var inner_e = button_html(1, 
		[['js_utterrate',    [7,0], 0], ['js_utterrate',   [6,0], 1],
		 ['js_utterrate',    [5,0], 2], ['js_utterrate',   [4,0], 3],
		 ['place_utterrate', [0,2]]
	    ]);
    common_create_menu('common_utterrate',1, inner_e);
}



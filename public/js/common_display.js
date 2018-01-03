
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
    return (elem);
}

function menu_blur(ineditor){                                            consolelog_func(); 
	
	if (ineditor===undefined) {ineditor=false;}
	if (common.browser!='Firefox'){
		if (ineditor){ $('#editor_base_elements').foggy({ blurRadius:5, opacity:0.8, cssFilterSupport:true }); }
		else{          $('#base_elements').foggy({ blurRadius:5, opacity:0.8, cssFilterSupport:true }); 
		               //$('#base_elements').css('webkitFilter', 'blur (5px)');
		}
	}
}
function menu_back(id, foggyoff, ineditor){                              consolelog_func(); 
	if (ineditor===undefined) {ineditor=false;}
	
	if (common.browser!='Firefox'){
		if (ineditor){ if (foggyoff==1){ $('#editor_base_elements').foggy(false);  } }
		else{          if (foggyoff==1){ $('#base_elements').foggy(false);  } }
	}
	
    elem = document.getElementById(id).parentNode;  //console.log('Parent id: '+elem.getAttribute('id')+' | '+elem.parentNode.getAttribute('id'));
    elem.parentNode.removeChild(elem);
}

function scroll_to(id, id_area, title){                                  consolelog_func(); 
    if (title==0){ elem = document.getElementById(id);  }
    else { elem= document.querySelectorAll('[id="'+id+'"]')[1]; 
    }
    rect_scroll = document.getElementById(id_area).getBoundingClientRect(); 
    rect = elem.getBoundingClientRect();  
    if (rect.top+0.5*(rect.bottom-rect.top)>rect_scroll.bottom || rect.left+0.5*(rect.right-rect.left)>rect_scroll.right || rect.bottom-0.5*(rect.bottom-rect.top)<rect_scroll.top || rect.right-0.5*(rect.right-rect.left)<rect_scroll.left )
        {elem.scrollIntoView(true);} 
}


//-- show menu -----------------------------------------------------------

function common_show_lang(lvl, parent){                                  consolelog_func(); 
    var inner_e = ''; var lang='';
    inner_e+=     '<div id="en"               onclick="common_set_lang(this.id,'+true+');" '+common.style.buttonpos_menu(1,0)+'>en</div>';
    inner_e+=     '<div id="ru"               onclick="common_set_lang(this.id,'+true+');" '+common.style.buttonpos_menu(2,0)+'>ru</div>';
    inner_e+=     '<div id="en"               onclick="common_set_lang(this.id,'+false+');" '+common.style.buttonpos_menu(5,0)+'>en</div>';
    inner_e+=     '<div id="ru"               onclick="common_set_lang(this.id,'+false+');" '+common.style.buttonpos_menu(6,0)+'>ru</div>';
    inner_e+=     '<div id="auto"             onclick="common_set_lang(this.id,'+false+');" '+common.style.buttonpos_menu(7,0)+'>auto</div>';
    inner_e+=     '<div id="common_langbase_zoom"  onclick="" '+common.style.buttonpos_menu(0,1)+'>'+common.langbase+'</div>';
    inner_e+=     '<div id="common_lang_zoom"      onclick="" '+common.style.buttonpos_menu(4,1)+'>'+common.lang+'</div>';
    if (editor!=undefined) {parent = "editor_created_elements";}
    common_create_menu('common_lang',lvl, inner_e, parent);
}

function common_show_fontsize(obj){                                      consolelog_func(); 
	var alpha_def = 1, font_def = 3, scale=1;
	if (obj.name==='files'){ alpha=common.style.f_fontalpha; font_def = common.style.f_fontsize; scale = common.f_fontsize_scale; }
	if (obj.name==='common'){ alpha=common.style.r_fontalpha; font_def = common.style.r_fontsize; scale = common.r_fontsize_scale; }            
	if (obj.name==='reader'){ alpha=common.style.r_fontalpha; font_def = common.style.r_fontsize; scale = common.r_fontsize_scale; } 
    var inner_e = ''; 
    if (obj.name==='files'){
	    inner_e+=     '<div id="0.8"      class="buttons"  onclick="common_set_fontsize(this.id,'+obj.name+');" '+common.style.buttonpos_menu(7,0)+'> x 0.8 </div>';
	    inner_e+=     '<div id="1"      class="buttons"  onclick="common_set_fontsize(this.id,'+obj.name+');" '+common.style.buttonpos_menu(6,0)+'> x 1 </div>';
	    inner_e+=     '<div id="1.2"      class="buttons"  onclick="common_set_fontsize(this.id,'+obj.name+');" '+common.style.buttonpos_menu(5,0)+'> x 1.2 </div>';
	    inner_e+=     '<div id="1.4"    class="buttons"  onclick="common_set_fontsize(this.id,'+obj.name+');" '+common.style.buttonpos_menu(4,0)+'> x 1.4 </div>';
    }
    if (obj.name==='reader'){
		inner_e+=     '<div id="0.8"      class="buttons"  onclick="common_set_fontsize(this.id,'+obj.name+');" '+common.style.buttonpos_menu(2,0)+'> x 0.8 </div>';
		inner_e+=     '<div id="1"      class="buttons"  onclick="common_set_fontsize(this.id,'+obj.name+');" '+common.style.buttonpos_menu(3,0)+'> x 1 </div>';
		inner_e+=     '<div id="1.2"      class="buttons"  onclick="common_set_fontsize(this.id,'+obj.name+');" '+common.style.buttonpos_menu(7,0)+'> x 1.2 </div>';
		inner_e+=     '<div id="1.4"    class="buttons"  onclick="common_set_fontsize(this.id,'+obj.name+');" '+common.style.buttonpos_menu(6,0)+'> x 1.4 </div>';
		inner_e+=     '<div id="2.0"      class="buttons"  onclick="common_set_fontsize(this.id,'+obj.name+');" '+common.style.buttonpos_menu(5,0)+'> x 2.0 </div>';
		inner_e+=     '<div id="3.0"      class="buttons"  onclick="common_set_fontsize(this.id,'+obj.name+');" '+common.style.buttonpos_menu(4,0)+'> x 3.0 </div>';
	}
    inner_e+=     '<div class="text_zoom_box" '+common.style.buttonpos_menu(0,2)+'><div id="common_fontsize_zoom" class="text_zoom menu_zoom" style="color:rgba(0,0,0,'+alpha+'); font-size:'+font_def*scale*common.style.vmin+'px;">text example</div></div>';
    common_create_menu('common_fontsize',1, inner_e);
}

function common_show_clickdelay(){                                       consolelog_func(); 
	var delay = common.time_delay/1000;
    var inner_e = ''; 
    inner_e+= '<div id="common_clickdelay_zoom"  onclick="" ' +common.style.buttonpos_menu(0,1)+'>'+delay+' sec</div>';
    inner_e+= '<div id="0.0"      class="buttons"  onclick="common_set_clickdelay(0.01);" '+common.style.buttonpos_menu(4,0)+'> 0.0 </div>';
    inner_e+= '<div id="0.1"      class="buttons"  onclick="common_set_clickdelay(0.1);" '+common.style.buttonpos_menu(5,0)+'> 0.1 sec </div>';
    inner_e+= '<div id="0.5"      class="buttons"  onclick="common_set_clickdelay(0.5);" '+common.style.buttonpos_menu(6,0)+'> 0.5 sec </div>';
    inner_e+= '<div id="0.7"      class="buttons"  onclick="common_set_clickdelay(0.7);" '+common.style.buttonpos_menu(7,0)+'> 0.7 sec </div>';
    common_create_menu('common_clickdelay',1, inner_e);
}

function common_show_notification(text, welcome, blur){                        consolelog_func();
	if (blur==undefined){blur=0;}
	if (welcome===undefined){ welcome = false; }
	var parent='created_elements';
	var id = "notification";
	var b_top = 90-common.style.b_height;
	common.repeat_text = replace_all(text,'<br>','');
	menu_blur();
	
	inner_e = '<div id="back_lvl" onclick="menu_back(this.id,'+blur+',false);" class="back_area"> </div>';
	inner_e+= '<div class="menu_area" >';
	inner_e+= '<div class="text_scroll_box" style="position:fixed;top:15vh;left:12vw;width:76vw;height:'+(b_top-23)+'vh;font-size:4.8vmin;line-height:7.5vh; color: rgba(0,0,0,0.55);">';
	inner_e+= '<div class="text_scroll" align="left" style="top:0;"> <div class="reader_text" style="top:-5vh;height:20%;">'+text+' &nbsp </div> </div> </div> </div>' ;
                                       
    inner_e += '<div onclick="utter_sentence(0, 1, 0, 1);" ' +common.style.buttonpos_menu(19,0,4,5)+' > utter </div>';
    if (welcome){
		inner_e += '<div onclick="welcome_donot();" ' +common.style.buttonpos_menu(16,0,4,5)+" > Don't show again </div>";
	}
                  
    element = document.createElement('div');
    element.setAttribute('id', id);
    element.innerHTML=inner_e;
    document.getElementById(parent).appendChild(element);
    return (element);	
}

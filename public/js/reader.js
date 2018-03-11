

//-- reader variables ----------------------------------------------------

var reader = {
    latest_w: "p0s0w0", latest_s: "p0s0", latest_p: "p0",
    id_prev: "p0s0w0",  id_curr: "p0s0w0",
    iter: 0,
    selecttype: 2,
    zoomtype: 0,
    text_origin: "", editor_text: "", mailtext: "",
    editor_iter: 0,
    
    cookie_number: 12,
    cookie_suffix: "_",
    name: 'reader',
    
    fname: "",
    text_parsed: "",
    word_id: [], sentence_id: [], paragraph_id: [],
    messages_arr: [],
    draft: '',
    save_inprocess: false,
    
    in_messages: false,
    
    selecttext: ['select <br> -','select <br> - -','select <br> - - -'],
    zoomtype_arr: ['no zoom', 'by word', 'by sentence'],
    
    get_id_array: function(){                                            //consolelog_func('brown'); 
        var id_arr = [];
        if (this.selecttype == 1){ id_arr=this.sentence_id; }    
        else if (this.selecttype == 2){ id_arr=this.paragraph_id; }    
        else if (this.selecttype == 0){ id_arr=this.word_id; }                      
        return(id_arr);
    },
    get_id: function(){                                                  //consolelog_func('brown'); 
        var latest_id;                                                   //console.log('Sentence_id',this.sentence_id);
        var id_arr = [];                                                 //console.log('selecttype: '+this.selecttype);
        if (this.selecttype == 1){ id_arr=this.sentence_id; }    
        else if (this.selecttype == 2){ id_arr=this.paragraph_id; }    
        else if (this.selecttype == 0){ id_arr=this.word_id; }  
                                              
        if (this.iter==-1){ latest_id='file_title'; }
        else{ latest_id = id_arr[this.iter]; }                              
        return(latest_id);
    },
    get_id_backup: function(){                                           //consolelog_func('brown'); 
        var latest_id;
        if (this.selecttype == 0){ latest_id=this.latest_w; }    
        else if (this.selecttype == 1){ latest_id=this.latest_s; }    
        else if (this.selecttype == 2){ latest_id=this.latest_p; }    
        return(latest_id);
    },
    
}

//-- start/exit/update ---------------------------------------------------

function reader_start(){                                                 consolelog_func('darkblue');    
	reader.in_messages = common.in_messages;     
	localStorage.setItem("in_reader", "yes");	                                  
	
	var inner_e = "";
	inner_e += "<div id='text_scroll_area' class='text_scroll' align='left' >";
	inner_e += "<em id='file_title' style='font-style:normal;top:-0vh; left:1.7vw;position:relative;'> </em> ";
	inner_e += "<div id='text_from_file' class='reader_text' style='top:1vh;'> </div>";
	inner_e += "</div>";
	document.getElementById("content_box").innerHTML = inner_e;
	window.onbeforeunload = reader_beforunload;                          
	
	reader.fname = localStorage.getItem("reader_fname");                 // !!
	window.onresize = function(){ 
		common.style.resize();
		reader_show_buttons();
	};
	reader.cookie_suffix = "_"+reader.fname;                             //console.log('cookie_suffix: '+reader.cookie_suffix);
	                 
	console.log('Cookie_isset: '+cookie_get('isset_'+reader.fname)+' = '+reader.fname);
	if (cookie_get('isset_'+reader.fname)!='isset'){                    
	    cookie_set("isset_"+reader.fname, "isset");
	    common.cookie_save.call(reader);
	}else{ common.cookie_load.call(reader); }                            
		
	reader_update();
}

function reader_exit(){
	var elem = document.getElementById('menu_back_lvl0');                //console.log('Elem: '+elem);
	if (elem){ menu_back('menu_back_lvl0',1, 0); }
	var elem = document.getElementById('menu_back_lvl1');                //console.log('Elem: '+elem);
	if (elem){ menu_back('menu_back_lvl1',1, 0); }

	common.cookie_save.call(reader);
	common.cookie_save();  
	localStorage.setItem("in_reader", "no"); 
	document.getElementById('created_elements').innerHTML = '';
	
	utter_stop();
	if (reader.in_messages){                                             //console.log('U: '+localStorage.getItem("reader_exitpath"));
		window.location.href=localStorage.getItem("url")+'contacts';
	}else{
		files_start();
		files_update();
	}
	
}

function reader_update(start) {                                          consolelog_func('darkblue');   console.log('ischanged_text: ',common.ischanged_text);                                            
	
	if (common.ischanged_text){
		reader_ajax_save();
	}
                                             
    if (reader.in_messages){
		var fname = [user.name+'/', reader.fname.replace('/','/ ')];
		reader_messages_tohtml();
	}else{
		var fname = common_make_fname(localStorage.getItem("reader_savepath"));     //console.log('NAME: '+fname[0]+' | '+fname[1]);
	}
	document.getElementById('file_title').innerHTML = '<em><span style="color:black;opacity:0.3;direction:ltr;">'+fname[0]+' </span>'+fname[1]+'</em>';
        
        
    var text = document.getElementById('hidden_text').innerHTML;         //console.log('Draft 3: '+text);              
	var parser = reader_parse_html(text);
	var text_parsed = parser[0];                                         //console.log('false text_parsed: '+text_parsed);                                
	reader.word_id=parser[1]; reader.sentence_id=parser[2]; reader.paragraph_id=parser[3];
																	
	document.getElementById('text_from_file').innerHTML = text_parsed;  
	reader.text_origin = text;
	reader.text_parsed = text_parsed;                                    //console.log('Draft 4: '+text_parsed);
    
    reader_show_buttons();    
    reader_set_selecttype(order=0);                                  
    reader_set_zoomtype(reader.zoomtype);                                       
    common_set_fontsize(common.r_fontsize_scale, 1);                console.log('ReaderIter: '+reader.iter+' '+reader.iter_prev);
    if (reader.in_messages){
        reader.iter = reader.get_id_array().length-1;                  
        reader_highlite(); 
        scroll_to(reader.get_id(),'content_box', title=0);
	}                                                                    //console.log('Save_inprocess: '+reader.save_inprocess);
	//if (reader.save_inprocess){ reader.save_inprocess = false; }
    
}

//-- ajax function -------------------------------------------------------

function reader_ajax_save(){                                             consolelog_func('darkblue'); 
    if ( common_ajax_permit() ){
	
	    var text = "", text_parsed = "";
	    reader.save_inprocess = true;
	    
		if (reader.in_messages){                                           
			text_parsed = $('#text_from_file').find('#mail_editable').html();     
		}else{
			text_parsed = reader.text_parsed;
		}                                                                //console.log('true text_parsed: '+text_parsed);
		
		reader.id_curr = reader.get_id();                                
		text = common.editor_text;                                       
		document.getElementById('tmp').innerHTML = text_parsed;         
		var id = reader.id_curr;                                         //console.log('text_new: '+text+' ID: '+id);
		document.getElementById("text_from_file").innerHTML = "";
		document.getElementById(id).innerHTML = text;                    //console.log('text_new_parsed: '+document.getElementById('tmp').innerHTML);
		
		var text_all_parsed = document.getElementById('tmp').innerHTML; 
		var text_all_origin = merge_text(text_all_parsed);               
	
		common.ischanged_text = false;                                   //console.log('NEW TEXT: '+text_all_origin);
		
		if (reader.in_messages){ 
			document.getElementById('savedraft_text').value = text_all_origin;
			document.getElementById('savedraft_submit').click();
		}else{
			var fname = localStorage.getItem("reader_savepath");         //console.log('Fname: '+fname);
			$.ajax( {type: 'GET', dataType: 'text', url: 'update', cache: false, data: {file_name: fname, file_text: text_all_origin}} )
			.done( function () { location.reload(); } );
			alert = 'File was saved.';     
		}
	}
}

function reader_ajax_send(){
	if ( common_ajax_permit() ){
		document.getElementById('createmessage_text').value = reader.draft;
		document.getElementById('createmessage_submit').click();
	}
}
 

//-- menu functions ------------------------------------------------------

function reader_set_selecttype(order, settype){                          consolelog_func(); 
	if (settype===undefined){settype=0;}
    n_select_type = reader.selecttype;
    
    if (settype==1){
        n_select_type = (n_select_type+1)%3;
        reader.selecttype = n_select_type;
        id_arr = reader.get_id_array();  latest_id = reader.get_id_backup();      
        reader.iter = id_arr.indexOf(latest_id);
    }else if (settype==2){
		n_select_type = order;
		reader.selecttype = n_select_type;
        id_arr = reader.get_id_array();  latest_id = reader.get_id_backup();      
        reader.iter = id_arr.indexOf(latest_id);
		}        
    reader_highlite(); 
    reader_fill_zoom();                           
    id=reader.get_id(); 
    reader.id_curr = id;                                              
    document.getElementById('js_selecttype').innerHTML=reader.selecttext[n_select_type];
}

function reader_set_zoomtype(order,id){                                  //consolelog_func(); 
	if (id!=undefined){
		var nav = {no:0, word:1, sentence:2};                            //console.log('nav: '+id);
		var n_zoomtype = nav[id];   
	}else{
		var n_zoomtype = order;
	}
	reader.zoomtype = n_zoomtype;
    
    var bodyStyles = window.getComputedStyle(document.body);
    textheight_zoom = bodyStyles.getPropertyValue('--reader-textheight-zoom'); 
    var elem = document.getElementById("zoom_box");              
    if (n_zoomtype==0){ 
        elem.style.visibility='hidden';
        document.getElementById('content_box').style.height = 100*common.style.ry+'vh'; 
    }else{
        elem.style.visibility='visible';
        document.getElementById('content_box').style.height = (common.style.textheight_zoom+3)*common.style.ry+'vh'; 
    }                                                                    
    reader_fill_zoom();                                                   
    elem = document.getElementById('place_readerzoom');
    if (elem){ elem.innerHTML=reader.zoomtype_arr[n_zoomtype]; }
    elem = document.getElementById('reader_menu_zoomtype_text');
    if (elem){ elem.innerHTML=reader.zoomtype_arr[n_zoomtype]; }          
    common.style.resize();
    document.getElementById('zoom_box').style.height = (100 - common.style.textheight_zoom -2.5)*common.style.ry+'vh';
    document.getElementById('zoom_box').style.top = (common.style.textheight_zoom +2.9)*common.style.ry+'vh';
    document.getElementById('zoom_box').style.fontSize = 11*common.style.rmin+'vh';
    document.getElementById('zoom_box').style.lineHeight = 18*common.style.rmin+'vh'
}
   
function reader_play_pause(){                                            consolelog_func(); 
	//console.log(window.speechSynthesis.speaking, window.speechSynthesis.paused, window.speechSynthesis.pending);                            
	if ( 'speechSynthesis' in window){
	    if (common.play_counter==0){                                     console.log('resume: ',window.speechSynthesis.speaking, window.speechSynthesis.paused, window.speechSynthesis.pending);                            
	        //window.speechSynthesis.speaking = false;
	        //window.speechSynthesis.cancel(); 
	        window.speechSynthesis.resume();                             console.log('msg: '+msg.text);                 
	        //window.speechSynthesis.speak(); 
	        common_playpause_icon(1);
	        common.play_counter=1; 
	        }
	    else if (window.speechSynthesis.speaking ){   
			window.speechSynthesis.pause();                                  // works in windows-firefox and any-chrome      
			//if (common.browser!='Firefox'){
			//	window.speechSynthesis.pause();       
			//} else{ window.speechSynthesis.cancel();  }
	        common_playpause_icon(0);
	        common.play_counter=0; 
	    }
	    else{reader_utter(1, 0); common.play_counter=1;}
	}
}
function reader_play_all(){                                              //console.log('common.onend: '+common.utter_playall);
	if (common.utter_playall==1){ reader_play_pause(); }
	else{ 
		common.utter_playall=1;
		reader_scroll(1,1,1); 
	}	
}
function reader_play_single(order){
	utter_stop('cancel');
	common.utter_playall=0;
	reader_scroll(order,1,0); 
}
    
function reader_navigate(order){                                         consolelog_func(); 
	var len = reader.paragraph_id.length;
	var nav = {start:'0.0', mid:'0.5', end:'1.0'};                   //console.log('nav: '+order);
	order = nav[order];                                              //console.log('nav: '+order);
	reader.iter = Math.floor(len*order);
	
	if (reader.iter==len){reader.iter = len-1;}                  
	var id = reader.get_id();                                       
    reader.id_curr = id;
    reader_highlite(); 
    scroll_to(id,'content_box', title=0);
}


//-- mail functions ------------------------------------------------------

function reader_messages_tohtml(){
	var mail_arr = reader.messages_arr;                            
	var text = "", class_i="", id_from="", i=0;
	var day_prev = "";
	for (i=0; i<mail_arr.length; i+=1){      
		var date = mail_arr[i][2];                                       
		var time = date.substring(date.lastIndexOf(' ')+1, date.lastIndexOf(':')); 
		var day = date.substring(date.lastIndexOf('-')+1, date.indexOf(' ')); 
		var month = date.substring(date.indexOf('-')+1, date.lastIndexOf('-')); 
		month = month_names[parseInt(month)-1];    
		
		var title = time;
		if (day!=day_prev){
			title = month+' '+day+',  '+time;
		}
		day_prev = day;
		
		id_from = mail_arr[i][1];    
		if (id_from==user.id) {class_i = 'out'; name_i = user.name }
		else {class_i = 'in'; name_i = user.contact_name}       
		text+= '<div title="'+name_i+'" class="message mail_'+class_i+' mail_title" >'+title+'</div>';
		text+= '<div title="'+name_i+'" class="message mail_'+class_i+'">'+mail_arr[i][3]+'</div>';                
	}
	
	var msg = reader.draft;                                              
	text+= '<div title="'+user.name+'" class="message mail_out mail_title" > Draft </div>';
	text+= '<div title="'+user.name+'" class="message mail_out mail_temp" id="mail_editable">'+msg+'</div>';  
	text+= '<div title="void_div" style="position:relative;height:11vh;">  </div>'; 
   
	document.getElementById('hidden_text').innerHTML=text;       
}    

function reader_if_editable(){                                           consolelog_func(); 
    id = reader.latest_p;
    title = document.getElementById(id).getAttribute('title');          
    if (parse_words(title).indexOf('editable')!=-1){editable=true;}
    else {editable=false;}
    return(editable);
}

function reader_show_mail(){                                             consolelog_func(); 
	var inner_e = button_html(1, 
		[['ajax_refresh',  [4,0]],   ['ajax_sendmail', [7,0]]
		]);
    common_create_menu('reader_mail', 0, inner_e);
}


//-- misc ----------------------------------------------------------------

function is_inlist(list){                                                //consolelog_func(); 
    inlist = false;
    fname_i = document.getElementById('file_title').innerText; 
    for (i=0; i<list.length; i++){ 
		if (fname_i.indexOf(list[i])==fname_i.indexOf('/')){inlist = true;} 
    }
    return(inlist);
}

function reader_editor(){                                                consolelog_func("darkblue"); 
	utter_stop();
    text_all = document.getElementById('text_from_file').innerHTML;
    reader.text_parsed = text_all;
    id = reader.get_id();
    text = document.getElementById(id).innerHTML;
    text_plane = merge_text(text); 
    common.ineditor = true;                                    
    editor_run('reader', text_plane);
}

function reader_beforunload() {                                          consolelog_func(); 
	//common.cookie_save.call(reader); 
	//common.cookie_save(); 
	if (reader.save_inprocess==false){
		reader_exit();
	}
}

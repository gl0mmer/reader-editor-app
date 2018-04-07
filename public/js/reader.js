

//-- reader variables ----------------------------------------------------

var reader = {
    latest_w: "p0s0w0", latest_s: "p0s0", latest_p: "p0",
    id_prev: "p0s0w0",  id_curr: "p0s0w0",
    iter: 0,
    selecttype: 2,
    zoomtype: 0,
    editor_text: "", mailtext: "",
    editor_iter: 0,
    
    cookie_number: 11,
    cookie_suffix: "_",
    name: 'reader',
    
    fname: "",
    text_parsed: "",
    word_id: [], sentence_id: [], paragraph_id: [],
    messages_arr: [],
    draft: '',
    save_inprocess: false,
    in_messages: false,
    parse_tag: 'span',
        
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
	
	common.style.content_border = true;
	$("#content_box").addClass("border");
	
	var inner_e = "";
	inner_e += "<div id='text_scroll_area' class='text_scroll' align='left' >";
	inner_e += "<div id='title_box' > <span id='file_title'></span> </div> ";
	inner_e += "<div id='text_from_file' class='reader_text' style='top:1vh;'> </div>";
	inner_e += "</div>";
	document.getElementById("content_box").innerHTML = inner_e;
	window.onbeforeunload = reader_beforunload;                          
	
	reader.fname = localStorage.getItem("reader_fname");                 // !!
	window.onresize = function(){ reader_resize(); };
	reader.cookie_suffix = "_"+reader.fname;                             //console.log('cookie_suffix: '+reader.cookie_suffix);
	                 
	                                                                     //console.log('Cookie_isset: '+cookie_get('isset_'+reader.fname)+' = '+reader.fname);
	if (cookie_get('isset_'+reader.fname)!='isset'){                    
	    cookie_set("isset_"+reader.fname, "isset");
	    common.cookie_save.call(reader);
	}else{ common.cookie_load.call(reader); }                            
		
	if (reader.iter==undefined){                                         // !!Error may occure here
		reader.iter=0;  
		reader.id_prev= "p0s0w0";  
		reader.id_curr= "p0s0w0";                                        //console.log('SET ITER'); 
	} 
	reader_update();
}

function reader_exit(order){
	if (reader.in_messages==false){
		var elem = document.getElementById('menu_back_lvl0');                //console.log('Elem: '+elem);
		if (elem){ menu_back('menu_back_lvl0',1, 0); }
		var elem = document.getElementById('menu_back_lvl1');                //console.log('Elem: '+elem);
		if (elem){ menu_back('menu_back_lvl1',1, 0); } 
	}                      
	    
	common.cookie_save.call(reader);
	common.cookie_save();  
	localStorage.setItem("in_reader", "no"); 
	document.getElementById('created_elements').innerHTML = '';
	
	common.style.content_border = false;
	$("#content_box").removeClass("border");
	utter_stop();
	if (order==-1){
		files.in_contacts = false;                                       
		window.location.href=localStorage.getItem("url");
	}else if (reader.in_messages){                                       //console.log('U: '+localStorage.getItem("reader_exitpath"));
		window.location.href=localStorage.getItem("url")+'contacts';
	}else{
		files_start();
		files_update();
	}
	
}

function reader_update(start) {                                          consolelog_func('darkblue');                                             
	
	if (common.ischanged_text){
		reader_ajax_save();
	}
                   
    var elem = document.getElementById('title_box');                    
    if (reader.in_messages){
		reader_messages_tohtml();
		var title = reader.fname.substring(reader.fname.lastIndexOf('/')+1);
		elem.className = 'reader_title_mail';
		elem.style.fontSize   = 1.5*common.style.get_bfontsize()+'vmin';
		elem.style.lineHeight = 2.0*common.style.get_bfontsize()+'vmin';
	}else{
		var name = localStorage.getItem("reader_savepath");
		var i = name.lastIndexOf('/');
	    var fname = [ user.name +'/'+ name.substring(0,i+1),  name.substring(i+1) ];
	    var title = '<span><span style="opacity:0.4;">'+fname[0]+' </span>'+fname[1]+'</span>';
	    elem.className = 'reader_title';
	}
	document.getElementById('file_title').innerHTML = title;
        
        
    var text = document.getElementById('hidden_text').innerHTML;         
    if (reader.fname=='Welcome.txt' && !('speechSynthesis' in window) ){
		text = '<strong class="text_error">'+dict.alert_nospeech +'</strong><br><br>'+ text;
	}
                  
	var parser = reader_parse_html(text);
	var text_parsed     = parser[0];                                     //console.log('false text_parsed: '+text_parsed);                                
	reader.word_id      = parser[1]; 
	reader.sentence_id  = parser[2]; 
	reader.paragraph_id = parser[3];
																	
	document.getElementById('text_from_file').innerHTML = text_parsed;  
	reader.text_parsed = text_parsed;                                    //console.log('Draft 4: '+text_parsed);
    
    reader_show_buttons();    
    reader_set_selecttype(order=0);                                  
    reader_set_zoomtype(reader.zoomtype);                                       
    common_set_fontsize(common.r_fontsize_scale, 1);                     console.log('ReaderIter: '+reader.iter);
    if (reader.in_messages){
        reader.iter = reader.get_id_array().length-1;                  
        reader_highlite(); 
	}                                                                    //console.log('Save_inprocess: '+reader.save_inprocess);
    reader_resize();
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
		text = common.editor_text;                                       console.log('SAVE |'+text+'|'); 
		document.getElementById('tmp').innerHTML = text_parsed;         
		var id = reader.id_curr;                                         //console.log('text_new: '+text+' ID: '+id);
		document.getElementById("text_from_file").innerHTML = "";
		document.getElementById(id).innerHTML = text;                    
		
		var text_all_parsed = document.getElementById('tmp').innerHTML; 
		var text_all_origin = merge_text(text_all_parsed); 
		document.getElementById('hidden_text').innerHTML = text_all_origin;              
	
		common.ischanged_text = false;                                   //console.log('NEW TEXT: '+text_all_origin);
		
		if (reader.in_messages){ 
			document.getElementById('savedraft_text').value = text_all_origin;
			document.getElementById('savedraft_submit').click();
		}else{
			if (editor.if_addtag && common.ineditor){ editor_exit(); }
			var fname = localStorage.getItem("reader_savepath");         //console.log('Fname: '+fname);
			$.ajax( {type: 'GET', dataType: 'text', url: 'update', cache: false, data: {file_name: fname, file_text: text_all_origin}} )
			.done( function () { reader_update(); } );
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
    var n_select_type = reader.selecttype;
    
    if (settype==1){                                                     
        n_select_type = (n_select_type+1)%3;
    }else if (settype==2){                                               
		n_select_type = order;
	}
	reader.selecttype = n_select_type;
	var id_arr = reader.get_id_array();  
	reader.iter = id_arr.indexOf( reader.get_id_backup() );              
    reader.id_curr = reader.get_id();    
	                
	reader_highlite(); 
    reader_fill_zoom();                            
    document.getElementById('js_selecttype').innerHTML=dict.js_selecttype[n_select_type];
}
   
function reader_play_all(){                                              
	if (common.utter_playall==1 ){
		common_play_pause();
	}else{
		utter_stop();
		common_playpause_icon(1);
		common.utter_playall=1;
		reader_scroll(1,1,0); 
	}
}
function reader_play_single(order){
	utter_stop();
	common.utter_playall=0;
	reader_scroll(order,1,0); 
	common_playpause_icon(1);
}
    
function reader_navigate(order){                                         consolelog_func(); 
	reader.selecttype = 2;
	reader_set_selecttype(2,2); 
	var len = reader.paragraph_id.length;
	var nav = {start:'0.0', mid:'0.5', end:'1.0'};                   
	order = nav[order];                                              
	reader.iter = Math.floor(len*order);
	
	if (reader.iter==len){reader.iter = len-1;}
	reader_scroll(2,1,0,reader.iter);                  
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
		
		var month_names = ["January", "February", "March", "April", "May", "June",
							"July", "August", "September", "October", "November", "December"];
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


//-- misc ----------------------------------------------------------------


function reader_edittext(){                                              consolelog_func("darkblue"); 
	utter_stop();
    text_all = document.getElementById('text_from_file').innerHTML;
    reader.text_parsed = text_all;
    id = reader.get_id();
    text = document.getElementById(id).innerHTML;
    text_plane = merge_text(text); 
    common.ineditor = true;                                    
    editor_start('reader', text_plane);
}

function reader_beforunload() {                                          consolelog_func(); 
	common.ineditor = false;
	common.cookie_save.call(reader); 
	common.cookie_save(); 
	//if (reader.save_inprocess==false){ reader_exit(); }
}

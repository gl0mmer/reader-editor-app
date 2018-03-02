


function replace_all(text, a,b){                                         //consolelog_func(); 
    proceed=1;
    while (proceed==1){
        i = text.indexOf(a);
        if (i==-1) { proceed=0; }
        else { text_i = text.replace(a, b); text = text_i; }
    }
    return(text);
}

function merge_text(text){                                               consolelog_func(); 
    proceed = 1;
    while (proceed==1){
        i = text.indexOf('<'+common.ctag);
        if (i==-1){ proceed=0; }
        else { 
			i2 = text.indexOf('>',i+1);                               
            text = text.substr(0,i)+text.substr(i2+1);                   
        }
    }                                                                    
    text = replace_all(text, '</'+common.ctag+'>', '');
    return (text);
}

function find_closing(text, tag, i0){                                    consolelog_func(); 
    i=i0*1; i_start=i0; i_end=i0;
    pr1 = true;
    while (pr1){
        i1 = text.indexOf('<'+tag,i+1);
        i_start = text.indexOf('>',i+1) + 1;
        i_end = text.indexOf('</'+tag+'>',i+1);
        if (i1==-1 || (i1>i_end && i1!=-1)){ 
            pr1=false; 
            i_start = text.indexOf('>',i+1) + 1;
            i_end = text.indexOf('</'+tag+'>',i+1);
            }
        else{ 
            i = i1*1;
        }
    }
    return([i_start, i_end]);
}
function parse_words(text){                                              consolelog_func(); 
    arr = []; 
    if (text!=''){
        proceed = 1; i=0; i_start=0; word='';
        while (proceed==1){
            i = text.indexOf(' ',i_start+1);
            if (i==-1){
                word = text.substr(i_start); proceed=0; }
            else{
                word = text.substr(i_start, i-i_start); i_start = i; 
            }
            arr.push(word.replace(' ',''));
        }
    }
    return(arr);
}


function find_spaceend(txt, i_start){                                    consolelog_func(color="green", noargs=true); 
	if ( txt[i_start]!=' ' || i_start==txt.length ) { return(i_start); }
	if ( i_start === undefined ) { i_start = 0; }
	var proceed = 1; var i=i_start+1;
	while (proceed==1){
		if ( i>=txt.length-1 ) { proceed=0; }
		else if ( txt[i]!=' ' ) { proceed=0; }
		else { i+=1; } 
	}                                                                    
	return (i); 
}
function find_spacestart(txt, i_start){                                  consolelog_func(color="green", noargs=true); 	
	if ( i_start === undefined ) { i_start = txt.length-1; }
	var proceed = 1; var i=i_start;
	while (proceed==1){
		if ( i<=0 ) { proceed=0; }
		else if ( txt[i-1]!=' ' ) { proceed=0; }
		else { i-=1; } 
	}                                                                    
	return (i); 
}

function find_indexof(text_origin, arr, i_start, i_end){                 consolelog_func(color="green", noargs=true); 
	if ( i_start === undefined ) { i_start = 0; }                       
	if ( i_end === undefined ) { i_end = text_origin.length; }           
	var txt = text_origin.substring(i_start, i_end);                     
	var i=0, j=0, res=txt.length, symb='', success=0;
	
	for (i=0; i<arr.length; i++) {
		j = txt.indexOf(arr[i]);
		if ( j!=-1 && j<res ) { res=j; symb=arr[i]; success=1; }
	}                                                                    
	if ( success == 0 ) { res = -1; }
	else {res = res+i_start; }
	return([res, symb]);
}

function find_indexof_all(text_origin, arr, i_start, i_end){             //consolelog_func(color="green", noargs=true); 
	if ( i_start === undefined ) { i_start = 0; }                        
	if ( i_end === undefined ) { i_end = text_origin.length; }           
	var txt = text_origin.substring(i_start, i_end);                     
	var i=0, j=0, res=txt.length, symb='', success=0;
	var res_arr = [];
	var proceed = true; var k=0;                                         
	
	while (proceed){
		success = 0; res = txt.length;
		for (i=0; i<arr.length; i++) {
			j = txt.indexOf(arr[i], k);
			if ( j!=-1 && j<res ) { 
				res=j; symb=arr[i]; success=1;      
			}
		}                                                                    
		if ( success == 0 ) { 
			res = -1; 
			proceed = false;
		}else { 
			if ( symb == "<" ) { 
				k = txt.indexOf(">", k+1)+1; 
				
				var proceed2 = 1; 
				while (proceed2==1){
					if ( k>=txt.length-1 || txt[k]!=' ') { proceed2=0; }
					else { k+=1; } 
				}         
			}
			else{ k = res + symb.length; }
			res_arr.push([res,symb]);
		}
	}
	for (i=0; i<res_arr.length; i+=1) { res_arr[i][0] += i_start; }
	return(res_arr);
}


function text_clean(text_origin){                                        //consolelog_func();  // only void tags allowed!  
	var txt = text_origin.replace('\n','<br>');                          
	var proceed = 1, i = 0, j1=0, j2=0; 
	i = txt.indexOf('<');
	if (i===-1) {proceed=0;}
	while (proceed==1){                                                  
		j1 = txt.indexOf('>', i);
		j2 = txt.indexOf('<', i+1);
		if (i===txt.length-1) { txt = txt.substring(0,i); proceed=0; }
		else if (j2===-1) { proceed=0; }
		else if (j1===-1 || j1>j2 ) { txt = txt.substring(0,i)+txt.substring(i+1); alert('lonely bracket!! '+i); 
		}
		i = j2;
	}
	replace_all(txt, '< ', '<'); 
	replace_all(txt, '</ ', '</');
	return (txt);
}
function reader_parse_html(text_origin){                                 //consolelog_func(); 
	if (text_origin.replace(' ','')==='') { return reader_parse_txt(text_origin, 0); }
	
	var txt = text_clean(text_origin);  
	
	//var endtag = ['div','p','article','aside','button','canvas','caption','cite','code','datalist','del','details','dialog','dl','dt','figcaption','figure','footer'];
	var tag_arr = ['div','p', 'h1', 'h2', 'h3'];                                            
	
	tag_open_close = [];
	for (i=0; i<tag_arr.length; i+=1) { tag_open_close.push("<"+tag_arr[i]); }
	for (i=0; i<tag_arr.length; i+=1) { tag_open_close.push("</"+tag_arr[i]); }        
	
	var index_arr = [[0,0]];
	var proceed=1, j1=0, j2=0;                                                            
	while (proceed==1){                                                  // devide text by tags. index_arr[i] = [ tag_start, tag_end ]		
		j1=txt.length;
		for (i=0; i<tag_open_close.length; i+=1){
			ii = txt.indexOf(tag_open_close[i],j2);
			if (ii===-1){ii=txt.length;}
			if (ii<j1){j1=ii;}
		}if (j1===txt.length){j1=-1;}                                    
		
		if (j1!=-1) {
			j2 = txt.indexOf('>', j1); 
			index_arr.push([j1,j2+1]);                                   
		}else{ proceed=0; }
	}
	index_arr.push([txt.length,txt.length]);                             //console.log('index_arr: '+index_arr);
	
	var text_final = "", arr_w=[], arr_s=[], arr_p=[];
	var i=0, n_p=0, txt_i="", txt_parsed="", tag1="", tag2="", upper_div=false, skip_div=false;
	for (i=1; i<index_arr.length; i+=1){                                 //console.log('text block: '+i+', index_arr[i]='+index_arr[i]);
		skip_div=false;                                                  // 
		upper_div=false;                                                 // div without div inside
		txt_i = txt.substring(index_arr[i-1][1], index_arr[i][0]);       
		text_final += txt.substring(index_arr[i-1][0], index_arr[i-1][1]);  
		
		if (i>1 && i<index_arr.length-1) {
			tag1 = txt.substring(index_arr[i-1][0], index_arr[i-1][1]);      
			tag2 = txt.substring(index_arr[i][0], index_arr[i][1]);          
			if (tag1.indexOf("</")===-1 && tag2.indexOf("</")!=-1 ) {
				upper_div=true;            
				if (tag1.indexOf("void_div")!=-1) { skip_div=true; }
			}
			else{ upper_div=false; }
		}else{upper_div=false;}                                          
		
		//console.log('----------------------');
		//console.log(' skip: '+skip_div+'|'+txt_i.toString().replace(' ','').substring(0,300)+'|');
		//if (txt_i.length>300){ console.log(txt_i.substring(0,300)+"..."); }
		//else { console.log(txt_i); }
		
		if ( (txt_i.toString().replace(' ','')!=='' || upper_div==true) && skip_div===false ) { 
			txt_parsed = reader_parse_txt(txt_i, n_p);                   //console.log('Parsed: '+txt_parsed[0].substring(0,300)); 
			text_final += txt_parsed[0];                                 
			arr_w = arr_w.concat(txt_parsed[1]);
			arr_s = arr_s.concat(txt_parsed[2]);
			arr_p = arr_p.concat(txt_parsed[3]);                                     
			n_p = txt_parsed[4]+1;
		}
	}                                                                    
	return ([text_final, arr_w, arr_s, arr_p]);
}

function reader_parse_txt(text_origin, n_p){                             //consolelog_func(); 
    var txt = text_origin;
    var endsymbol = ['<br>', '...', '!!!', '???', '.', '!', '?', ',', ' ','<'] ;
    //var endsymbol = [' '];
    var emptytag = ['area','base','col','command','embed','hr','img','input','ceygen','link','meta','param','source','track','wbr','video','audio'];
    var proceed = 1, i = 0, i_end=0, j = [], arr = [], tag_arr=[]; 
    var tag_i = "";
    
    //-- split text by words ---------------------------------------------
    if (txt[0]==' '){
		var proceed2 = 1; 
		while (proceed2==1){                                             // find first not-space symbol
			if ( i>=txt.length-1 || txt[i]!=' ') { proceed2=0; }
			else { i+=1; } 
		}  
		arr.push( txt.substring(0,i) );                                  //concole.log('Arr 0: '+arr);
	}
	
	var arr_endpositions = find_indexof_all(txt, endsymbol );            //console.log('Ends: '+arr_endpositions);
	if (arr_endpositions.length==0){ arr_endpositions=[txt.length-1]; }
	var k=0;        
	var i_end_test=0;
	for (k=0; k<arr_endpositions.length; k+=1){
		if ( i>=txt.length-1 ) { break; }                                
		if (k<arr_endpositions.length-1) { i_end_test = arr_endpositions[k+1][0]; }
		else { i_end_test = txt.length; }
		
		j = arr_endpositions[k];                                         //if (k<10){console.log(k+" ["+j+"]");}
		if ( k==arr_endpositions.length-1 ) {                            // end of text
			i_end = txt.length; 
			proceed=0; 
		} else if ( j[0]==i && j[1]=="<" ) {                             // 
			i_end = txt.indexOf(">", i)+1;           
			tag_i = txt.substring(i+1, txt.indexOf(" ",i));
			if ( emptytag.indexOf(tag_i)!=-1 ) { tag_arr.push(arr.length); }    // remember index if word has non-empty tag, to preserve html structure
		} else if ( j[0]==i ){                                           //
			i_end = j[0]+j[1].length;
			a=0;  
		} else {                                                         
			if (j[1]==' ') { i_end = j[0]+1; }
			else { i_end = j[0]; }    
			a=0;                                   
        }   
                 
        var proceed2 = 1; 
		while (proceed2==1){                                             // find first not-space symbol
			if ( i_end>=txt.length-1 || txt[i_end]!=' ' ) { proceed2=0; }
			else { i_end+=1; } 
		}  
		                                                         
        if (i!=i_end){
			arr.push( txt.substring(i,i_end) );     
		}                         
        i = i_end;
    }                                                                    
    if (arr.length===0){ arr=[" "]; }                                    //console.log('Arr: '+arr+' | '+txt);                               
    
    //-- compose text with rpoper tags -----------------------------------
    var endsentence = ['... ', '!!! ', '??? ', '. ', '! ', '? ', '...', '!!!', '???', '.', '!', '?'];
    var p0=n_p.toString();  
    var text = '';
    var i_w = 0, i_s = 0, i_p = n_p; 
    var arr_w=['p'+p0+'s0w0'], arr_s=['p'+p0+'s0'], arr_p=['p'+p0];
    
    var id_p='', id_s='', id_w='';
    var word='', word_start = '', word_end='';
    var otag=common.otag, ctag=common.ctag, tag_p=common.ptag;
    var character='';
    
    word_start = "<"+tag_p+" id='p"+p0+"'><"+otag+" id='p"+p0+"s0'><"+otag+" id='p"+p0+"s0w0'>";
    
    var i = arr.length-1,  i_end=-1;
    while (i_end==-1 && i>=0 ) {
		if ( tag_arr.indexOf(i)==-1 ) { i_end = i; }
		else { i -=1; } 
	}                                                                    
    
    var new_sentence = false;
    for (i=0; i<arr.length; i+=1){
        word=arr[i];             
		new_sentence = false;
		if (endsentence.indexOf(word.replace(' ',''))!=-1){
			/*  
			//-- check uppercase in the beginning of a new sentence ------
			if (i===i_end) {character = 'A';}
			else{ character = arr[i+1].charAt(0); }                      //console.log('1: '+character+' |'+arr[i]+'|'+arr[i+1]+'|');
			if (character.toLowerCase() === character.toUpperCase() && /^\d+$/.test(character)===false){ character='a'; }  //console.log('2: '+character);
			if (character == character.toUpperCase() ){ new_sentence = true; }
			*/
			new_sentence = true;
			}
		
        if ( tag_arr.indexOf(i)!=-1 ) {                                  // if tag, no wrapping
				text = text+word; 
		} else if (i===i_end) {                                          // last word
			word_end = '</'+ctag+'></'+ctag+'></'+tag_p+'>'; 
			text = text+ word_start + word + word_end;
			
		} else if ( word.indexOf('<br>')!=-1 ){                          // new paragraph
			i_p+=1;  i_s=0;  i_w=0;
			id_p = 'p'+i_p; 
			id_s = 'p'+i_p + 's'+i_s; 
			id_w = 'p'+i_p + 's'+i_s + 'w'+i_w;
			arr_p.push(id_p);  arr_s.push(id_s);  arr_w.push(id_w);
			
			word_end = '</'+ctag+'></'+ctag+'></'+tag_p+'>';
			text = text+ word_start + word + word_end;
			word_start =  '<'+tag_p+' id="'+id_p+'"><'+otag+' id="'+id_s+'"><'+otag+' id="'+id_w+'">';
			
		} else if ( new_sentence ){                                      // new sentence
			i_s+=1; i_w=0;
			id_s = 'p'+i_p + 's'+i_s; 
			id_w = 'p'+i_p + 's'+i_s + 'w'+i_w;
			arr_s.push(id_s);  arr_w.push(id_w);
			
			word_end = '</'+ctag+'></'+ctag+'>';
			text = text+ word_start + word + word_end;
			word_start =  '<'+otag+' id="'+id_s+'"><'+otag+' id="'+id_w+'">';
			
		} else {                                                         // new word
			i_w+=1;
			id_w = 'p'+i_p + 's'+i_s + 'w'+i_w;
			arr_w.push(id_w);
			
			word_end = '</'+ctag+'>';
			text = text+ word_start + word + word_end;
			word_start =  '<'+otag+' id="'+id_w+'">';
		}
    }
    return ([text, arr_w, arr_s, arr_p, i_p]);

}


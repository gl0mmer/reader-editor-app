
//-- Extend --------------------------------------------------------------
var  show_list = 0;

function loadContacts(ids, names, unreads){
	localStorage.setItem("in_reader", "no");                             
	files.in_contacts =true;
	
	// sort contacts by name 
	var d={}; var r={};
	for (var i=0; i<names.length; i++){ d[names[i]]=ids[i]; }              
	for (var i=0; i<names.length; i++){ r[names[i]]=unreads[i]; }              
	names.sort(); 
	ids=[]; unreads=[];
	for (var i=0; i<names.length; i++){ ids.push(d[names[i]]); }
	for (var i=0; i<names.length; i++){ unreads.push(r[names[i]]); }
	
	files.entries = names;                                               //console.log('Entries 2: ',names, ids);                       
	files.paths = ids;                                                   //console.log('Unreads: ', unreads);    
	files.entrytype = Array(ids.length).fill('file'); 
	files.unreads = unreads;    
	files_update();     
}
function loadMessages(messages) {                                               
	common.in_messages =true;                                            console.log('User and contact: '+user.name+' | '+user.contact_name);
	reader.messages_arr = messages;
	var text_i = messages;
	document.getElementById('hidden_text').innerHTML = text_i;
	document.getElementById('created_elements').innerHTML = '';
	localStorage.setItem("reader_fname", 'mail/'+user.contact_name); 
	localStorage.setItem("reader_fpath", '');                            
	reader_start();
}

//-- Override ------------------------------------------------------------

// ====================
// ==  Ajax actions  ==
// ====================

var refreshFoldersAndItems = function (data) {
  loadFolders(true);
  if (data != 'OK') {
    data = Array.isArray(data) ? data.join('<br/>') : data;
    notify(data);
  }
};

function loadFolders(onreadystate) {
  if (onreadystate!=undefined){
	  performLfmRequest('folders', {}, 'html')
	    .done(function (data) {
	      $('#tree').html(data);
	      loadItems();
	    });
  }
}

function loadItems(dir) {                                                
  if (dir==undefined){dir = $('#working_dir').val()}; 
  var path = dir;
  path = path.substring(1);
  if (path.indexOf('/')>-1){
	  path = path.substring(path.indexOf('/'));
  }else{ path = '' };                                                    //console.log('jsonitem: |'+path+'|');  // Bug may occure here!!!
  $.ajax( {type: 'GET', dataType: 'text', url: 'jsonitems', cache: false, data: {path: path}} )
    .done(function (data) {
      var response = JSON.parse(data);
      files.entries   = response.entries;                                
      files.entrytype = response.entrytype;                              
      files.dir       = response.working_dir;
      files.url       = response.homedir.substring(0,response.homedir.lastIndexOf('/'));   
      $('#working_dir').val(response.working_dir);                       // from the default script
      $('#current_dir').text(response.working_dir);                      //console.log('Homedir: ', files.url, response.homedir);
      
      // move trash to the 1st position
      var i = files.entries.indexOf('trash');                            //console.log(files.entries,i);
      if (i>-1){
		  files.entries.splice(i, 1);
		  files.entries.splice(1,0, 'trash');                            //console.log(files.entries);
	  }
      setOpenFolders();                                                  	
      files_update();
      common_phpresponse(data);
    });
}

// ==================================
// ==  Ckeditor, Bootbox, preview  ==
// ==================================

function useFile(file_url) {                                             //console.log('useFile()');

	var url = file_url;                                                  console.log('File url: '+url);
  
    var type = url.substring(url.lastIndexOf('.'));                      //console.log('type: '+type);
    if (type.replace(' ','')=='.txt'){
		
		$.ajax({type: "GET", url: url})
		.done(function (data){
			var text_i = data;                                           //console.log('text: '+text_i);
			document.getElementById('hidden_text').innerHTML = text_i;
			document.getElementById('created_elements').innerHTML = '';
			localStorage.setItem("reader_url", url);                         	 
			reader_start();
		});   
		
	}else{
		window.open(url);
	}
  
   
}
//end useFile

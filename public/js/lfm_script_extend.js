
//-- Extend --------------------------------------------------------------
var  show_list = 0;

function loadContacts(ids, names){
	localStorage.setItem("in_reader", "no");                             
	files.in_contacts =true;
	
	// sort contacts by name 
	var d = {};
	for (var i=0; i<names.length; i++){ d[names[i]]=ids[i]; }            //console.log('Entries 1: ',names, ids);   
	names.sort(); ids=[];
	for (var i=0; i<names.length; i++){ ids.push(d[names[i]]); }
	
	files.entries = names;                                               //console.log('Entries 2: ',names, ids);                       
	files.paths = ids;      
	files.entrytype = Array(ids.length).fill('file');     
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
      $('#content').html(response.html);                                 //console.log('Resp.html: '+response.html);
      files.entries = response.entries;                                  //console.log('Paths: '+response.paths);
      files.entrytype = response.entrytype;                              
      var home_path = response.path;
      files.home = home_path.substring(0,home_path.lastIndexOf('/'));   
      files.dir = response.working_dir;
      files.url = response.homedir.substring(0,response.homedir.lastIndexOf('/'));   //console.log('Homedir: ', files.url, response.homedir, home_path);
      $('#working_dir').val(response.working_dir);                       
      localStorage.setItem("working_dir", response.working_dir);         //console.log('loadItems Dir: '+response.working_dir);
      $('#current_dir').text(response.working_dir);                      //console.log('Current working_dir : ' + $('#working_dir').val());
      setOpenFolders();                                                  	
      files_update();
    });
}

// ==================================
// ==  Ckeditor, Bootbox, preview  ==
// ==================================

function useFile(file_url) {                                             //console.log('useFile()');

	var url = file_url;                                                  console.log('File url: '+url);
  
    var type = url.substring(url.lastIndexOf('.'));                      //console.log('type: '+type);
    if (type.replace(' ','')=='.txt'){
		var text_i = $.ajax({type: "GET", url: url, async: false}).responseText;   //console.log('text: '+text_i);
		
		document.getElementById('hidden_text').innerHTML = text_i;
		document.getElementById('created_elements').innerHTML = '';
		localStorage.setItem("reader_url", url);                       //console.log("USE");	 
		reader_start();
		
	}else{
		window.open(url);
	}
  
   
}
//end useFile

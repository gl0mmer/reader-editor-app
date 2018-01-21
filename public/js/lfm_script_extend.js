
//-- Extend --------------------------------------------------------------
var  show_list = 0;

function loadContacts(ids, names){
	localStorage.setItem("in_reader", "no");                             
	files.in_contacts =true;
	files.entries = names;                                               //console.log('Entries: ',files.entries);    
	files.entrytype = Array(ids.length+1).fill('file');                        
	files.entrytype[0]='folder';                                         //console.log(files.entrytype);
	files.entries.push('+');
	files.paths = ids;      
	files.paths.push(-1);                                                //console.log(files.paths); console.log(files.entries);
	files_update();     
}
function loadMessages(messages) {                                               
	common.in_messages =true;                                            console.log('User and contact: '+user.name+' | '+user.contact_name);
	reader.messages_arr = messages;
	var text_i = messages;
	document.getElementById('hidden_text').innerHTML = text_i;
	document.getElementById('created_elements').innerHTML = '';
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
  }else{ path = '' };                                                    // Bug may occure here!!!
  $.ajax( {type: 'GET', dataType: 'text', url: 'jsonitems', cache: false, sort_type: sort_type, data: {path: path}} )
    .done(function (data) {
      var response = JSON.parse(data);
      $('#content').html(response.html);                                 
      files.entries = response.entries;                                  //console.log('entries: '+response.entries);
      files.entrytype = response.entrytype;                              //console.log('Value2: ',response.html);
      var home_path = response.path;
      files.home = home_path.substring(0,home_path.lastIndexOf('/'));   
      files.dir = response.working_dir;
      files.url = response.homedir.substring(0,response.homedir.lastIndexOf('/'));                 console.log('Homedir: ', files.url);
      $('#working_dir').val(response.working_dir);                       
      localStorage.setItem("working_dir", response.working_dir);         //console.log('loadItems Dir: '+response.working_dir);
      $('#current_dir').text(response.working_dir);
      console.log('Current working_dir : ' + $('#working_dir').val());
      setOpenFolders();                                                  //console.log('Paths: ',files.paths);	
      files_update();
    });
}

// ==================================
// ==  Ckeditor, Bootbox, preview  ==
// ==================================

function useFile(file_url) {                                             //console.log('useFile()');

	var url = file_url;                                                  //console.log('url: '+url);
  
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

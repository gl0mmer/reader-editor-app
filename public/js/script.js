var show_list;
var sort_type = 'alphabetic';
  show_list = 0;


//loadItems() ;
/*
$(document).ready(function () {
  bootbox.setDefaults({locale:lang['locale-bootbox']});
  loadFolders();
  performLfmRequest('errors')
    .done(function (data) {
      var response = JSON.parse(data);
      for (var i = 0; i < response.length; i++) {
        $('#alerts').append(
          $('<div>').addClass('alert alert-warning')
            .append($('<i>').addClass('fa fa-exclamation-circle'))
            .append(' ' + response[i])
        );
      }
    });

    $(window).on('dragenter', function(){
      $('#uploadModal').modal('show');
    });
});
*/

// ======================
// ==  Navbar actions  ==
// ======================

$('#nav-buttons a').click(function (e) {
  e.preventDefault();
});

$('#to-previous').click(function () {
  var previous_dir = getPreviousDir();
  if (previous_dir == '') return;
  goTo(previous_dir);
});

$('#add-folder').click(function () {
  bootbox.prompt(lang['message-name'], function (result) {
    if (result == null) return;
    createFolder(result);
  });
});

$('#upload').click(function () {
  $('#uploadModal').modal('show');
});

$('#upload-btn').click(function () {
  $(this).html('')
    .append($('<i>').addClass('fa fa-refresh fa-spin'))
    .append(" " + lang['btn-uploading'])
    .addClass('disabled');

  function resetUploadForm() {
    $('#uploadModal').modal('hide');
    $('#upload-btn').html(lang['btn-upload']).removeClass('disabled');
    $('input#upload').val('');
  }

  $('#uploadForm').ajaxSubmit({
    success: function (data, statusText, xhr, $form) {
      resetUploadForm();
      refreshFoldersAndItems(data);
      displaySuccessMessage(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      displayErrorResponse(jqXHR);
      resetUploadForm();
    }
  });
});


// ======================
// ==  Folder actions  ==
// ======================

$(document).on('click', '.file-item', function (e) {                     //console.log('click file'+$(this).data('id'));
  useFile($(this).data('id'));                                           //console.log('Data: '+$(this).data('id'));
});

$(document).on('click', '.folder-item', function (e) {                   //console.log('click folder');
  goTo($(this).data('id'));
});

function goTo(new_dir) {
  $('#working_dir').val(new_dir);
  loadItems();
}

function getPreviousDir() {
  var ds = '/';
  var working_dir = $('#working_dir').val();
  var last_ds = working_dir.lastIndexOf(ds);
  var previous_dir = working_dir.substring(0, last_ds);
  return previous_dir;
}

function dir_starts_with(str) {
  return $('#working_dir').val().indexOf(str) === 0;
}

function setOpenFolders() {
  var folders = $('.folder-item');

  for (var i = folders.length - 1; i >= 0; i--) {
    // close folders that are not parent
    if (! dir_starts_with($(folders[i]).data('id'))) {
      $(folders[i]).children('i').removeClass('fa-folder-open').addClass('fa-folder');
    } else {
      $(folders[i]).children('i').removeClass('fa-folder').addClass('fa-folder-open');
    }
  }
}

// ====================
// ==  Ajax actions  ==
// ====================

function performLfmRequest(url, parameter, type) {
  var data = defaultParameters();

  if (parameter != null) {
    $.each(parameter, function (key, value) {
      data[key] = value;
    });
  }

  return $.ajax({
    type: 'GET',
    dataType: type || 'text',
    url: lfm_route + '/' + url,
    data: data,
    cache: false
  }).fail(function (jqXHR, textStatus, errorThrown) {
    displayErrorResponse(jqXHR);
  });
}

function displayErrorResponse(jqXHR) {
  notify('<div style="max-height:50vh;overflow: scroll;">' + jqXHR.responseText + '</div>');
}

function displaySuccessMessage(data){
  if(data == 'OK'){
    var success = $('<div>').addClass('alert alert-success')
      .append($('<i>').addClass('fa fa-check'))
      .append(' File Uploaded Successfully.');
    $('#alerts').append(success);
    setTimeout(function () {
      success.remove();
    }, 2000);
  }
}

var refreshFoldersAndItems = function (data) {
  loadFolders();
  if (data != 'OK') {
    data = Array.isArray(data) ? data.join('<br/>') : data;
    notify(data);
  }
};

var hideNavAndShowEditor = function (data) {
  $('#nav-buttons > ul').addClass('hidden');
  $('#content').html(data);
}

function loadFolders() {
  performLfmRequest('folders', {}, 'html')
    .done(function (data) {
      $('#tree').html(data);
      loadItems();
    });
}

function loadContacts(ids, names){
	localStorage.setItem("in_reader", "no");                             
	files.in_contacts =true;
	files.entries = names;                                  //console.log(response.entries);
	files.entrytype = Array(ids.length+1).fill('file');                        
	files.entrytype[0]='folder';                                         //console.log(files.entrytype);
	files.entries.push('+');
	files.paths = ids;      
	files.paths.push(-1);                                   //console.log(files.paths);
	files_update();
}
function loadMessages(messages) {                                               
	files.in_messages =true;                                             console.log('user: '+files.username+' | '+files.contactname);
	reader.messages_arr = messages;
	var text_i = messages;
	document.getElementById('hidden_text').innerHTML = text_i;
	document.getElementById('created_elements').innerHTML = '';
	localStorage.setItem("reader_fpath", '');                       //console.log("USE");
	reader_start();
}

function loadItems() {
  $('#lfm-loader').show();
  $.ajax( {type: 'GET', dataType: 'text', url: 'jsonitems', cache: false} )
  //performLfmRequest('jsonitems', {show_list: show_list, sort_type: sort_type}, 'html')
    .done(function (data) {
      var response = JSON.parse(data);
      $('#content').html(response.html);                                 //console.log('HTML: '+response.html);	
      files.entries = response.entries;                                  //console.log(response.entries);
      files.entrytype = response.entrytype;
      files.paths = response.paths;                                      //console.log(response.paths);
      files_update();
      $('#nav-buttons > ul').removeClass('hidden');
      $('#working_dir').val(response.working_dir);                       localStorage.setItem("working_dir", response.working_dir); console.log('loadItems Dir: '+response.working_dir);
      $('#current_dir').text(response.working_dir);
      console.log('Current working_dir : ' + $('#working_dir').val());
      if (getPreviousDir() == '') {
        $('#to-previous').addClass('hide');
      } else {
        $('#to-previous').removeClass('hide');
      }
      setOpenFolders();
    })
    .always(function(){
      $('#lfm-loader').hide();
    });
}

function createFolder(folder_name) {
  performLfmRequest('newfolder', {name: folder_name})
    .done(refreshFoldersAndItems);
}

function rename(item_name) {
  bootbox.prompt({
    title: lang['message-rename'],
    value: item_name,
    callback: function (result) {
      if (result == null) return;
      performLfmRequest('rename', {
        file: item_name,
        new_name: result
      }).done(refreshFoldersAndItems);
    }
  });
}

function trash(item_name) {
  bootbox.confirm(lang['message-delete'], function (result) {
    if (result == true) {
      performLfmRequest('delete', {items: item_name})
        .done(refreshFoldersAndItems);
    }
  });
}

function cropImage(image_name) {
  performLfmRequest('crop', {img: image_name})
    .done(hideNavAndShowEditor);
}

function resizeImage(image_name) {
  performLfmRequest('resize', {img: image_name})
    .done(hideNavAndShowEditor);
}

function download(file_name) {                                           //console.log('download');
  var data = defaultParameters();
  data['file'] = file_name;
  location.href = lfm_route + '/download?' + $.param(data);
}

// ==================================
// ==  Ckeditor, Bootbox, preview  ==
// ==================================

function useFile(file_url) {                                             console.log('useFile()');
	
	
  function getUrlParam(paramName) {                                      //console.log('getUrlParam()');
    var reParam = new RegExp('(?:[\?&]|&)' + paramName + '=([^&]+)', 'i');
    var match = window.location.search.match(reParam);                   //console.log('reParam: '+reParam);
    return ( match && match.length > 1 ) ? match[1] : null;
  }

  function useTinymce3(url) {
    var win = tinyMCEPopup.getWindowArg("window");
    win.document.getElementById(tinyMCEPopup.getWindowArg("input")).value = url;
    if (typeof(win.ImageDialog) != "undefined") {
      // Update image dimensions
      if (win.ImageDialog.getImageData) {
        win.ImageDialog.getImageData();
      }

      // Preview if necessary
      if (win.ImageDialog.showPreviewImage) {
        win.ImageDialog.showPreviewImage(url);
      }
    }
    tinyMCEPopup.close();
  }

  function useTinymce4AndColorbox(url, field_name) {
    parent.document.getElementById(field_name).value = url;

    if(typeof parent.tinyMCE !== "undefined") {
      parent.tinyMCE.activeEditor.windowManager.close();
    }
    if(typeof parent.$.fn.colorbox !== "undefined") {
      parent.$.fn.colorbox.close();
    }
  }

  function useCkeditor3(url) {
    if (window.opener) {
      // Popup
      window.opener.CKEDITOR.tools.callFunction(getUrlParam('CKEditorFuncNum'), url);
    } else {
      // Modal (in iframe)
      parent.CKEDITOR.tools.callFunction(getUrlParam('CKEditorFuncNum'), url);
      parent.CKEDITOR.tools.callFunction(getUrlParam('CKEditorCleanUpFuncNum'));
    }
  }

  function useFckeditor2(url) {
    var p = url;
    var w = data['Properties']['Width'];
    var h = data['Properties']['Height'];
    window.opener.SetUrl(p,w,h);
  }

  var url = file_url;                                                    console.log('url: '+url);
  var field_name = getUrlParam('field_name');
  var is_ckeditor = getUrlParam('CKEditor');
  var is_fcke = typeof data != 'undefined' && data['Properties']['Width'] != '';
  var file_path = url.replace(route_prefix, '');

  if (window.opener || window.tinyMCEPopup || field_name || getUrlParam('CKEditorCleanUpFuncNum') || is_ckeditor) {
    if (window.tinyMCEPopup) { // use TinyMCE > 3.0 integration method
      useTinymce3(url);                                                  
    } else if (field_name) {   // tinymce 4 and colorbox
      useTinymce4AndColorbox(url, field_name);
    } else if(is_ckeditor) {   // use CKEditor 3.0 + integration method
      useCkeditor3(url);
    } else if (is_fcke) {      // use FCKEditor 2.0 integration method
      useFckeditor2(url);
    } else {                   // standalone button or other situations
      window.opener.SetUrl(url, file_path);
    }

    if (window.opener) {
      window.close();
    }
  } else {                                                               //console.log('Open with default method');
    // No editor found, open/download file using browser's default method
    //window.open(url);
    
    var type = url.substring(url.lastIndexOf('.'));                      //console.log('type: '+type);
    if (type.replace(' ','')=='.txt'){
		var text_i = $.ajax({type: "GET", url: url, async: false}).responseText;   console.log('text: '+text_i);
		
		document.getElementById('hidden_text').innerHTML = text_i;
		document.getElementById('created_elements').innerHTML = '';
		localStorage.setItem("reader_fpath", url);                       //console.log("USE");
		reader_start();
		
	}else{
		window.open(url);
	}
  }
   
}
//end useFile


function defaultParameters() {
  return {
    working_dir: $('#working_dir').val(),
    type: $('#type').val()
  };
}

function notImp() {
  notify('Not yet implemented!');
}

function notify(message) {
  bootbox.alert(message);
}

function fileView(file_url, timestamp) {
  bootbox.dialog({
    title: lang['title-view'],
    message: $('<img>')
      .addClass('img img-responsive center-block')
      .attr('src', file_url + '?timestamp=' + timestamp),
    size: 'large',
    onEscape: true,
    backdrop: true
  });
}

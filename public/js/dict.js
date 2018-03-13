
//-- symbols -------------------------------------------------------------

var symbol_nextpage1 =   '<span>xyz</span>';
var symbol_nextpage2 =   '123';
var symbol_nextpage3 =   '^ / %';

var symbol_folder     = '<svg class="ion_symbol_dir svg" viewBox="0 -150 512 712" ><path d="M213.338 96H74.666C51.197 96 32 115.198 32 138.667v234.666C32 396.802 51.197 416 74.666 416h362.668C460.803 416 480 396.802 480 373.333V186.667C480 163.198 460.803 144 437.334 144H256.006l-42.668-48z"></path></svg>';
var symbol_file       = '<svg class="ion_symbol_txt svg" viewBox="0 -200 512 812" ><path d="M288 48 H136 c-22.092 0-40 17.908-40 40 v336 c0 22.092 17.908 40 40 40 h240 c22.092 0 40-17.908 40-40 V176 L288 48z "></path></svg>';	

var symbol_enter      = '<svg viewBox="0 0 512 512" class="svg ion_symbol" ><path d="M448 71.9c-17.3-13.4-41.5-9.3-54.1 9.1L214 344.2l-99.1-107.3c-14.6-16.6-39.1-17.4-54.7-1.8-15.6 15.5-16.4 41.6-1.7 58.1 0 0 120.4 133.6 137.7 147 17.3 13.4 41.5 9.3 54.1-9.1l206.3-301.7c12.6-18.5 8.7-44.2-8.6-57.5z"></path></svg>';
var symbol_pause      = '<svg viewBox="0 0 512 512" class="svg ion_symbol"><path d="M224 435.8V76.1c0-6.7-5.4-12.1-12.2-12.1h-71.6c-6.8 0-12.2 5.4-12.2 12.1v359.7c0 6.7 5.4 12.2 12.2 12.2h71.6c6.8 0 12.2-5.4 12.2-12.2zM371.8 64h-71.6c-6.7 0-12.2 5.4-12.2 12.1v359.7c0 6.7 5.4 12.2 12.2 12.2h71.6c6.7 0 12.2-5.4 12.2-12.2V76.1c0-6.7-5.4-12.1-12.2-12.1z"></path></svg>';

var symbol_prev       = '<svg viewBox="0 0 512 512" class="svg ion_symbol"><path d="M327.3 98.9l-2.1 1.8-156.5 136c-5.3 4.6-8.6 11.5-8.6 19.2 0 7.7 3.4 14.6 8.6 19.2L324.9 411l2.6 2.3c2.5 1.7 5.5 2.7 8.7 2.7 8.7 0 15.8-7.4 15.8-16.6V112.6c0-9.2-7.1-16.6-15.8-16.6-3.3 0-6.4 1.1-8.9 2.9z"></path></svg>';
var symbol_next       = '<svg viewBox="0 0 512 512" class="svg ion_symbol"><path d="M184.7 413.1l2.1-1.8 156.5-136c5.3-4.6 8.6-11.5 8.6-19.2 0-7.7-3.4-14.6-8.6-19.2L187.1 101l-2.6-2.3C182 97 179 96 175.8 96c-8.7 0-15.8 7.4-15.8 16.6v286.8c0 9.2 7.1 16.6 15.8 16.6 3.3 0 6.4-1.1 8.9-2.9z"></path></svg>';
var symbol_up         = '<svg viewBox="0 0 512 512" class="svg ion_symbol"><path d="M413.1 327.3l-1.8-2.1-136-156.5c-4.6-5.3-11.5-8.6-19.2-8.6-7.7 0-14.6 3.4-19.2 8.6L101 324.9l-2.3 2.6C97 330 96 333 96 336.2c0 8.7 7.4 15.8 16.6 15.8h286.8c9.2 0 16.6-7.1 16.6-15.8 0-3.3-1.1-6.4-2.9-8.9z"></path></svg>';
var symbol_down       = '<svg viewBox="0 0 512 512" class="svg ion_symbol"><path d="M98.9 184.7l1.8 2.1 136 156.5c4.6 5.3 11.5 8.6 19.2 8.6 7.7 0 14.6-3.4 19.2-8.6L411 187.1l2.3-2.6c1.7-2.5 2.7-5.5 2.7-8.7 0-8.7-7.4-15.8-16.6-15.8H112.6c-9.2 0-16.6 7.1-16.6 15.8 0 3.3 1.1 6.4 2.9 8.9z"></path></svg>';

var symbol_delete	  = '<svg viewBox="0 0 512 512" class="svg ion_symbol"><path d="M498.941 93.559C490.037 84.654 478.696 80 465.875 80H168c-24.303 0-43.717 9.402-57.706 28.441L0 255.938l110.4 146.528.18.231.184.232c6.904 8.855 14.424 15.701 22.99 20.417C143.883 428.924 155.405 432 168 432h298c26.191 0 46-22.257 46-49V127c0-12.821-4.154-24.537-13.059-33.441zm-85.499 238.748a8.007 8.007 0 0 1 2.372 5.71 7.984 7.984 0 0 1-2.372 5.707l-21.823 21.905a7.973 7.973 0 0 1-5.691 2.371c-2.071 0-4.138-.785-5.695-2.371l-76.23-76.461-76.23 76.461a7.947 7.947 0 0 1-5.695 2.371 7.975 7.975 0 0 1-5.692-2.371l-21.824-21.905a7.99 7.99 0 0 1-2.373-5.707c0-2.148.846-4.2 2.373-5.71L271.098 256l-76.738-76.297c-3.146-3.153-3.146-8.273 0-11.427l21.807-21.919a8.048 8.048 0 0 1 5.696-2.357c2.152 0 4.189.847 5.691 2.357l76.448 75.533 76.447-75.533a8.006 8.006 0 0 1 5.693-2.357c2.143 0 4.179.847 5.695 2.357l21.807 21.919c3.146 3.153 3.146 8.273 0 11.427L336.904 256l76.538 76.307z"></path></svg>';
var symbol_undo 	  = '<svg viewBox="0 0 512 512" class="svg ion_symbol"><path d="M447.9 368.2c0-16.8 3.6-83.1-48.7-135.7-35.2-35.4-80.3-53.4-143.3-56.2V96L64 224l192 128v-79.8c40 1.1 62.4 9.1 86.7 20 30.9 13.8 55.3 44 75.8 76.6l19.2 31.2H448c0-10.1-.1-22.9-.1-31.8z"></path></svg>';
var symbol_redo       = '<svg viewBox="0 0 512 512" class="svg ion_symbol"><path d="M64 400h10.3l19.2-31.2c20.5-32.7 44.9-62.8 75.8-76.6 24.4-10.9 46.7-18.9 86.7-20V352l192-128L256 96v80.3c-63 2.8-108.1 20.7-143.3 56.2C60.4 285.2 64 351.5 64 368.2c.1 8.9 0 21.7 0 31.8z"></path></svg>';
var symbol_sound_on   = '<svg viewBox="0 0 512 512" class="svg ion_symbol"><path d="M64 192v128h85.334L256 431.543V80.458L149.334 192H64zm288 64c0-38.399-21.333-72.407-53.333-88.863v176.636C330.667 328.408 352 294.4 352 256zM298.667 64v44.978C360.531 127.632 405.334 186.882 405.334 256c0 69.119-44.803 128.369-106.667 147.022V448C384 428.254 448 349.257 448 256c0-93.256-64-172.254-149.333-192z"></path></svg>';
var symbol_sound_off  = '<svg viewBox="0 0 512 512" class="svg ion_symbol"><path d="M405.5 256c0 22.717-4.883 44.362-13.603 63.855l31.88 31.88C439.283 323.33 448 290.653 448 256c0-93.256-64-172.254-149-192v44.978C361 127.632 405.5 186.882 405.5 256zM256 80.458l-51.021 52.48L256 183.957zM420.842 396.885L91.116 67.157l-24 24 90.499 90.413-8.28 10.43H64v128h85.334L256 431.543V280l94.915 94.686C335.795 387.443 318 397.213 299 403.022V448c31-7.172 58.996-22.163 82.315-42.809l39.61 39.693 24-24.043-24.002-24.039-.081.083z"></path><path d="M352.188 256c0-38.399-21.188-72.407-53.188-88.863v59.82l50.801 50.801A100.596 100.596 0 0 0 352.188 256z"></path></svg>';
var symbol_mail	      = '<svg viewBox="0 0 512 512" class="svg ion_symbol"><path d="M437.332 80H74.668C51.199 80 32 99.198 32 122.667v266.666C32 412.802 51.199 432 74.668 432h362.664C460.801 432 480 412.802 480 389.333V122.667C480 99.198 460.801 80 437.332 80zM432 170.667L256 288 80 170.667V128l176 117.333L432 128v42.667z"></path></svg>';
var symbol_addcontact = '<svg viewBox="0 0 512 512" class="svg ion_symbol"><path d="M304 256c52.805 0 96-43.201 96-96s-43.195-96-96-96-96 43.201-96 96 43.195 96 96 96zm0 48c-63.598 0-192 32.402-192 96v48h384v-48c0-63.598-128.402-96-192-96zM112 224v-64H80v64H16v32h64v64h32v-64h64v-32h-64z"></path></svg>';

var symbol_prev_next  = '<svg viewBox="0 0 512 512" class="svg ion_symbol">'
                      + '<path d=" M334.7 413.1 l2.1-1.8 156.5-136 c5.3-4.6 8.6-11.5 8.6-19.2 0-7.7-3.4-14.6-8.6-19.2    L337.1 101l-2.6-2.3    C332 97     329 96     325.8 96c-8.7 0-15.8 7.4-15.8 16.6 v286.8 c0 9.2 7.1 16.6 15.8 16.6 3.3 0 6.4-1.1 8.9-2.9z"></path>'
                      + '<path d=" M177.3 98.9 l-2.1 1.8-156.5 136c-5.3 4.6-8.6 11.5-8.6 19.2 0 7.7 3.4 14.6 8.6 19.2    L174.9 411 l2.6 2.3 c2.5 1.7 5.5 2.7 8.7 2.7 8.7 0 15.8-7.4 15.8-16.6V112.6c0-9.2-7.1-16.6-15.8-16.6-3.3 0-6.4 1.1-8.9 2.9z"></path></svg>';

var symbol_prev_prev  = '<svg viewBox="0 0 512 512" class="svg ion_symbol">' 
                      + '<path d="  M127.3 98.9 l-2.1 1.8-156.5 136c-5.3 4.6-8.6 11.5-8.6 19.2 0 7.7 3.4 14.6 8.6 19.2    L124.9 411 l2.6 2.3 c2.5 1.7 5.5 2.7 8.7 2.7 8.7 0 15.8-7.4 15.8-16.6V112.6c0-9.2-7.1-16.6-15.8-16.6-3.3 0-6.4 1.1-8.9 2.9z"></path>'
                      + '<path d="  M427.3 98.9 l-2.1 1.8-156.5 136c-5.3 4.6-8.6 11.5-8.6 19.2 0 7.7 3.4 14.6 8.6 19.2    L424.9 411 l2.6 2.3 c2.5 1.7 5.5 2.7 8.7 2.7 8.7 0 15.8-7.4 15.8-16.6V112.6c0-9.2-7.1-16.6-15.8-16.6-3.3 0-6.4 1.1-8.9 2.9z"></path></svg>';

var symbol_next_next  = '<svg viewBox="0 0 512 512" class="svg ion_symbol">' 
	                  + '<path d=" M84.7 413.1 l2.1-1.8 156.5-136 c5.3-4.6 8.6-11.5 8.6-19.2 0-7.7-3.4-14.6-8.6-19.2    L87.1 101l-2.6-2.3    C82 97     79 96     75.8 96c-8.7 0-15.8 7.4-15.8 16.6 v286.8 c0 9.2 7.1 16.6 15.8 16.6 3.3 0 6.4-1.1 8.9-2.9z"></path>'
	                  + '<path d=" M334.7 413.1 l2.1-1.8 156.5-136 c5.3-4.6 8.6-11.5 8.6-19.2 0-7.7-3.4-14.6-8.6-19.2    L337.1 101l-2.6-2.3    C332 97     329 96     325.8 96c-8.7 0-15.8 7.4-15.8 16.6 v286.8 c0 9.2 7.1 16.6 15.8 16.6 3.3 0 6.4-1.1 8.9-2.9z"></path></svg>';

var symbol_up_down    = '<svg viewBox="0 0 512 512" class="svg ion_symbol">' 
	                  + '<path d="M413.1    227.3 l-1.8-2.1-136-156.5 c-4.6-5.3-11.5-8.6-19.2-8.6-7.7 0-14.6 3.4-19.2 8.6 L101  224.9 l-2.3 2.6  C97    230 96    233 96    236.2 c0 8.7 7.4 15.8 16.6 15.8 h286.8 c9.2 0 16.6-7.1 16.6-15.8 0-3.3-1.1-6.4-2.9-8.9z"></path>'
	                  + '<path d="M98.9     334.7 l1.8 2.1 136 156.5 c4.6 5.3 11.5 8.6 19.2 8.6 7.7 0 14.6-3.4 19.2-8.6  L411   337.1 l2.3-2.6 c1.7-2.5 2.7-5.5 2.7-8.7 0-8.7-7.4-15.8-16.6-15.8  H112.6  c-9.2 0-16.6 7.1-16.6 15.8 0 3.3 1.1 6.4 2.9 8.9z"></path></svg>';

var symbol_play      = '<svg viewBox="0 0 512 512" class="svg ion_symbol">' 
	                 + '<path d="M34.7 413.1 l2.1-1.8 156.5-136 c5.3-4.6 8.6-11.5 8.6-19.2 0-7.7-3.4-14.6-8.6-19.2    L37.1 101l-2.6-2.3    C32 97     29 96     25.8 96c-8.7 0-15.8 7.4-15.8 16.6 v286.8 c0 9.2 7.1 16.6 15.8 16.6 3.3 0 6.4-1.1 8.9-2.9z"></path>'
	                 + '<path d="M278 96h79v320h-79z  M415 96h79v320h-79z"></path></svg>';


var symbols_play_pause = [symbol_play, symbol_pause];
var symbols_sound = [symbol_sound_off, symbol_sound_on];

//-- messages ------------------------------------------------------------

var login_messages_en = ['The name does not exists.', 'Wrong password.', ''];
var login_messages_ru = ['Указанное имя не существует.', 'Неправильный пароль.', ''];
var newlogin_messages_en = ['The new user is added successfully.', 'The name is busy.', ''];
var newlogin_messages_ru = ['Новый аккаунт успешно создан.', 'Невозможно создать новый аккаунт. Указанное имя занято.', ''];


//-- misc ----------------------------------------------------------------

var month_names = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];

//-- button names --------------------------------------------------------


var dict_en = {
	show_fmenu      : 'menu',
	show_rmenu      : 'menu',
	show_opt        : 'opt',
	show_clickdelay : 'click delay',
	show_ffontsize  : 'font size',
	show_rfontsize  : 'font size',
	show_create     : 'create',
	show_lang       : 'lang',
	show_sound      : 'sound',
	show_bugfix     : 'bug fix',
	show_login      : 'log in',
	show_sync       : 'sync',
	show_readerzoom : 'zoom',
	show_addcontact : symbol_addcontact,
	show_mail       : symbol_mail,
	
	js_zoom         : 'zoom',
	js_fprev        : symbol_prev,
	js_fnext        : symbol_next,
	js_rprev        : symbol_prev,
	js_rnext        : symbol_next,
	ajax_enter      : symbol_enter,
	ajax_contacts   : symbol_mail,
	ajax_mailexit   : 'exit',
	ajax_readerexit : 'exit',
	
	js_copy         : 'copy',
	ajax_past       : 'past',
	ajax_rename     : 'rename',
	ajax_rm         : 'delete',
	ajax_totrash    : 'delete',
	ajax_download   : 'down- load',
	ajax_upload     : 'upload',
	ajax_newdir     : 'create dir',
	ajax_newtxt     : 'create txt',
	ajax_addcontact : 'add',
	ajax_reinit     : 'reinit files',
	js_cleancookie  : 'clean cookie',
	
	ajax_logout     : 'log out',
	ajax_signup     : 'sign up',
	ajax_signin     : 'sign in',
	ajax_maildata   : 'mail data',
	ajax_deleteuser : '',
	js_rememberme   : 'remem- ber me',
	
	show_mail       : symbol_mail,  
	show_navigate   : symbol_up_down,  
	js_edit         : 'edit',
	js_readall      : 'read all',
	js_playpause    : symbol_play,
	ajax_readerexit : 'exit',
	ajax_mailexit   : 'exit',
	ajax_refresh    : 'refresh',
	ajax_sendmail   : 'send mail',
	
	ajax_sync_past  : 'past',
	ajax_sync_rm    : 'rm',
	
	edit_create     : '',
	edit_filename   : '',
	edit_username   : 'name', 
	edit_userpass   : 'password', 
	edit_usermail   : 'email',
	edit_contactname : '',
	
	place_lang      : 'lang',
	js_lang         : ['','',  'ru','en'],
	place_delay     : 'delay',
	js_delay        : ['','',  '0.1','0.4','0.7','1.0'],
	place_fontsize  : 'Example text',
	js_ffontsize    : ['x','', '0.8','1','1.2','1.4'],
	js_rfontsize    : ['x','', '0.8','1','1.2','1.4', '2', '3'],
	js_navigate     : ['','',  'start', 'mid', 'end'],
	place_readerzoom : '',
	js_readerzoom   : ['','',  'no', 'word', 'sentence'], 
	show_editorfont : 'font size', 
	js_editorfont   : ['','lines', '5', '4', '3','2'],
	show_utterrate  : 'speech rate', 
	place_utterrate : 'Text example in speech speed menu', 
	js_utterrate    : ['x','', '0.6', '0.8', '1.0','1.2', '1.4'],
	
	alert_error     : 'Error',
	alert_guest     : 'You need registration to proceed',
	alert_nameempty  : 'Name is empty',
	alert_nameexists : 'Name exists',
	alert_newfolder  : 'New folder was created',
	alert_newtxt     : 'New text file was created',
	alert_waspasted  : 'Item was pasted',
	alert_wascopied  : 'Item was copied',
	alert_wasdeleted : 'Item was deleted',
	alert_wasrenamed : 'Item was renamed',
	alert_welcome   : "Hi! <br>This website helps people to read and write. <br><br>"
					+ "Check 'Welcome.txt' file for details. "
					+ "You will see it after closing this window. "
					+ "To open the file click on the file icon and 'check' button to the right. ",
	

}
var dict_ru = {}
var dict = dict_en;

//-- button oncklick -----------------------------------------------------

var dict_onclick = {
	show_fmenu : 'files_show_menu();',
	show_rmenu : 'reader_show_menu();',
	show_opt: 'files_show_options();',
	show_clickdelay: 'common_show_clickdelay();',
	show_ffontsize: 'files_show_fontsize();',
	show_rfontsize: 'reader_show_fontsize();',
	show_create: 'files_show_create();',
	show_lang: 'common_show_lang(1);',
	show_sound: '',
	show_bugfix: 'files_show_bugfix();',
	show_login: 'files_show_login()',
	show_sync: 'files_show_sync();',
	show_addcontact: 'files_show_addcontact();',
	
	js_zoom: 'files_set_zoom();',
	js_fprev: 'files_scroll(-2);',
	js_fnext: 'files_scroll(-1);',
	js_rprev: 'reader_play_single(0);',
	js_rnext: 'reader_play_single(1);',
	ajax_enter: 'files_ajax_enter();',
	ajax_contacts: 'files_ajax_contacts();',
	ajax_readerexit: 'reader_exit();',
	ajax_mailexit: 'files_ajax_enter(-1)',
	
	js_copy: 'files_copy();',
	ajax_past: 'files_ajax_past();',
	ajax_rename: 'files_ajax_rename();',
	ajax_totrash: 'files_ajax_totrash();',
	//ajax_totrash: 'files_ajax_delete();',
	ajax_rm: 'files_ajax_delete();',
	ajax_download: 'files_ajax_download();',
	ajax_upload: 'files_ajax_upload();',
	ajax_newdir: 'files_ajax_create(0);', 
	ajax_newtxt: 'files_ajax_create(1);', 
	ajax_addcontact: 'files_ajax_addcontact();', 
	ajax_reinit: 'files_ajax_createinit();',
	js_cleancookie: 'files_cleancookie();',
	
	edit_create  : 'files_edittext(this.id);',
	edit_filename  : 'files_edittext(this.id);',
	edit_username  : 'files_edittext(this.id);', 
	edit_userpass  : 'files_edittext(this.id);', 
	edit_usermail  : 'files_edittext(this.id);', 
	edit_contactname  : 'files_edittext(this.id);', 
	
	ajax_logout     : 'files_logout();',
	ajax_signup     : 'files_signup();',
	ajax_signin     : 'files_signin();',
	ajax_maildata   : '',
	ajax_deleteuser : '',
	js_rememberme : 'files_login_remember();',
	
	ajax_sync_past: 'files_ajax_past(1);',
	ajax_sync_rm: 'files_ajax_delete(1);',
	
	show_mail: 'reader_show_mail();',
	show_navigate: 'reader_show_navigate();',
	show_readerzoom : 'reader_show_zoomtype();',
	js_edit: 'reader_editor();',
	js_readall: 'reader_play_all();',
	js_selecttype: 'reader_set_selecttype(1,1);',
	js_playpause: 'common_play_pause();',
	js_navigate: 'reader_navigate(this.id);',
	js_readerzoom: 'reader_set_zoomtype(0,this.id);',
	ajax_refresh: 'location.reload();',
	ajax_sendmail: 'reader_ajax_send();',
	show_editorfont: 'editor_show_fontsize();',
	js_editorfont: 'editor_set_fontsize(this.id,0);',
	show_utterrate: 'common_show_utterrate();',
	js_utterrate: 'common_set_utterrate(this.id);',
		
	js_lang: 'common_set_lang(this.id)',
	js_delay : 'common_set_clickdelay(this.id);',
	js_ffontsize : 'common_set_fontsize(this.id,0);',
	js_rfontsize : 'common_set_fontsize(this.id,1);',
}

function button_html(lvl, arr, y_dim, x_dim){
	if (y_dim==undefined){ y_dim = 2; }
	if (x_dim==undefined){ x_dim = 4; }
	var class_arr = [[" ", "disabled", "symbol", "symbol disabled", "editor", "editor disabled"],
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
//-- 

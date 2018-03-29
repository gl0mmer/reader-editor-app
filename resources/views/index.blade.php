<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="description" content="Hedgehogappp.com helps people with cerebral palsy and other vision and motor skills problems to read, write and communicate. All buttons are large here, all text is playable. It contains text-reader with speech synthesis and easy scalable text, text editor, simplified file system, simplified messenger. " >
  <meta name="keywords" content="reader, editor, speech synthesis, cerebral palsy, file manager, messenger, account, user, read, write, large buttons, scalable text">
  <title>Reader-editor-messenger for serabral palsy</title>
  
  <meta http-equiv="X-UA-Compatible" content="IE=EDGE" />
  <meta name="viewport" content="width=device-width,initial-scale=1">
  
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
  <link rel="stylesheet"  href="{{ URL::to('css/common.css')}}" />
  <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
  
</head>

<body>
	<div hidden> @include('includes.login') </div>
		
	<div id='base_elements'>
		<div id='content_box' class='content_box ' align='top'> 
			...
		</div>
		<div id="zoom_box" class="text_zoom_box border">  
			<div id="zoom_text" class="text_zoom">...</div> 
		</div>
	    <div id='buttons_area' class='buttons_area'></div>
	</div>
	<div id='created_elements'></div>
	<div id='editor_base_elements'></div>
	<div id='editor_created_elements'></div>
	
	<div hidden id='tmp' > </div>
	<div hidden id='hidden_text' > </div>
	
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/lang/en.js') }}"></script> 
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/lang/ru.js') }}"></script> 
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/common_variables.js') }}"></script> 
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/common.js') }}"></script> 
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/files.js') }}"></script>
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/editor.js') }}"></script>
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/reader.js') }}"></script>
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/common_display.js') }}"></script>
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/files_display.js') }}"></script>
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/editor_display.js') }}"></script>
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/reader_display.js') }}"></script>
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/reader_parse.js') }}"></script>
    
    <script>
	files_start();
	
	contacts = []; contact_names = []; posts = [];
	user.name = "{{ $username }}";   
	user.id = "{{ Auth::user()->id }}";   
	</script>
		
	<div hidden > Messages: <br>
		@include('includes.message_block')
	</div>
	<div hidden style="position:fixed;top:50%;">		
		
		@if ($in_contacts)
			<?php $i=0; ?>
			Connection: {{ count($connections) }}<br>
			@foreach($connections as $connection)
				<script>
					contacts.push("{{ $connection }}");
					contact_names.push("{{ $names[$i] }}");
				</script>
				<?php $i+=1; ?>
			@endforeach
			<form action="{{ route('connection_add') }}" method="post">
				<input id="addcontact_name" class="form-control" type="text" name="addcontact_name" value=""  > 
				<button id="addcontact_submit" type="submit" class="btn btn-primary"> Add connection </button>
				<input type="hidden" name="_token" value="{{ Session::token() }}">
			</form>
		@endif
	
		@if ($in_messages)
			<form action="{{ route('message_create') }}" method="post">
				<textarea class="form-control" name="message" id="createmessage_text" rows="2" plaseholder="Your Post"></textarea>
				<input   name="id_to" value="{{ $id_to }}" > {{ $id_to }} </input>
				<button id="createmessage_submit" type="submit" class="btn btn-primary">Create Post</button>
				<input type="hidden" value="{{ Session::token() }}" name="_token">
			</form>
			<form action="{{ route('save_draft') }}" method="post">
				<textarea class="form-control" name="draft" id="savedraft_text" rows="2" plaseholder="Your Post"></textarea>
				<input   name="id_to" value="{{ $id_to }}" > {{ $id_to }} </input>
				<button id="savedraft_submit" type="submit" class="btn btn-primary">Save Draft</button>
				<input type="hidden" value="{{ Session::token() }}" name="_token">
			</form>
			@foreach($posts as $post)
				<script>
					posts.push(["{{ $post->id }}", "{{ $post->user_id }}", "{{ $post->created_at }}",  "{{ $post->message }}"]);
				</script>
			@endforeach
		@endif
		
		
		<div id="add-folder" class="btn btn-primary"> Add folder </div> 
		<form action="{{ route('unisharp.lfm.upload') }}" role='form' id='uploadForm' name='uploadForm' method='post' enctype='multipart/form-data' class="dropzone">
			<div class="form-group" id="attachment">
			  
			  <div class="controls text-center">
				<div class="input-group" style="width: 100%">
				  <a class="btn btn-primary" id="upload-button">{{ trans('laravel-filemanager::lfm.message-choose') }}</a>
				</div>
			  </div>
			</div>
			<input type='hidden' name='working_dir' id='working_dir'>
			<input type='hidden' name='type' value='{{ request("type") }}'>
			<input type='hidden' name='_token' value='{{csrf_token()}}'>
		</form>
	</div>
	
	
	
  <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min.js"></script>
  <script language=JavaScript type="text/javascript" src="{{ URL::to('js/plugins/jquery.foggy.min.js') }}"></script>
  <script>
    var route_prefix = "{{ url('/') }}";
    var lfm_route = "{{ url(config('lfm.url_prefix', config('lfm.prefix'))) }}";
    var lang = {!! json_encode(trans('laravel-filemanager::lfm')) !!};
  </script>
  <script>{!! \File::get(base_path('vendor/unisharp/laravel-filemanager/public/js/script.js')) !!}</script>
  <script>{!! \File::get(base_path('vendor/unisharp/laravel-filemanager/public/js/dropzone.min.js')) !!}</script>
  <script>{!! \File::get(base_path('public/js/lfm_script_extend.js')) !!}</script>
 
  
	@if ($create=='yes')
	<script>              
		performLfmRequest('newfolder', {name: 'trash'});
		$.ajax( {type: 'GET', dataType: 'text', url: 'create_init', cache: false} )
		.done(refreshFoldersAndItems('OK'));
	</script>
	@elseif ($in_messages)
		<script>
			reader.draft = '{{ $draft }}';                               //console.log('Draft: '+reader.draft);
			user.contact_name = '{{ $contactname }}';
			user.contact_id = '{{ $id_to }}';
			loadMessages(posts);
		</script>
	@elseif ($in_contacts)
		<script>
			loadContacts(contacts, contact_names);
		</script>
	@else
		<script>
			loadItems();
		</script>
	@endif
	<script>
	    Dropzone.options.uploadForm = {
	      paramName: "upload[]", // The name that will be used to transfer the file
	      uploadMultiple: false,
	      parallelUploads: 5,
	      clickable: '#upload-button',
	      dictDefaultMessage: 'Or drop files here to upload',
	      init: function() {
			fff = "{{ lcfirst(str_singular(request('type'))) == 'image' ? implode(',', config('lfm.valid_image_mimetypes')) : implode(',', config('lfm.valid_file_mimetypes')) }}";
	        maxfff = ({{ lcfirst(str_singular(request('type'))) == 'image' ? config('lfm.max_image_size') : config('lfm.max_file_size') }} / 1000);
	        var _this = this; // For the closure
	        this.on("addedfile", function(file) { refreshFoldersAndItems('OK'); });
	        this.on('success', function(file, response) {                console.log('RESP: ',response, fff, maxfff);
	          
	          if(response != 'OK'){   console.log('RESP: ',response);
	            this.defaultOptions.error(file, response.join('\n'));
	          }  
	      });
	      },
	      acceptedFiles: "{{ lcfirst(str_singular(request('type'))) == 'image' ? implode(',', config('lfm.valid_image_mimetypes')) : implode(',', config('lfm.valid_file_mimetypes')) }}",
	      maxFilesize: ({{ lcfirst(str_singular(request('type'))) == 'image' ? config('lfm.max_image_size') : config('lfm.max_file_size') }} / 1000)
	    }
	</script>

</body>
</html>

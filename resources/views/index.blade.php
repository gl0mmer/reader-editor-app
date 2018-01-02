<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=EDGE" />
  <meta name="viewport" content="width=device-width,initial-scale=1">

  <!-- Chrome, Firefox OS and Opera -->
  <meta name="theme-color" content="#75C7C3">
  <!-- Windows Phone -->
  <meta name="msapplication-navbutton-color" content="#75C7C3">
  <!-- iOS Safari -->
  <meta name="apple-mobile-web-app-status-bar-style" content="#75C7C3">

  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
  <style>{!! \File::get(base_path('vendor/unisharp/laravel-filemanager/public/css/lfm.css')) !!}</style>
  {{-- Use the line below instead of the above if you need to cache the css. --}}
  {{-- <link rel="stylesheet" href="{{ asset('/vendor/laravel-filemanager/css/lfm.css') }}"> --}}
  <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.css">
  
  
  <link rel="stylesheet"  href="{{ URL::to('css/common.css')}}" />
  <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
  
</head>

<body>
	<div> @include('includes.login') </div>
		
	<div id='base_elements'>
		<div id='content_box' class='text_scroll_box' style='position:fixed;height:73%;top:0%;' align='top'> 
			...
		</div>
		<div id="zoom_box" class="text_zoom_box">  
			<div id="zoom_text" class="text_zoom">...</div> 
		</div>
	    <div id='buttons_area' class='buttons_area'></div>
	</div>
	<div id='created_elements'></div>
	<div id='editor_base_elements'></div>
	<div id='editor_created_elements'></div>
	
	<div hidden id='hidden_files_nentry' ></div>
	<div hidden id='hidden_files_arr' ></div>	
	
	<div hidden id='hidden_text_parsed' > </div>
	<div hidden id='hidden' > </div>
	<div hidden id='tmp' > </div>
	<div hidden id='hidden_fname' > </div>
	<div hidden id='hidden_text' > </div>
	
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/common_variables.js') }}"></script> 
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/common.js') }}"></script> 
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/files.js') }}"></script>
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/editor.js') }}"></script>
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/reader.js') }}"></script>

	
	
    <div hidden class="container-fluid" id="wrapper">
        <div id="alerts"></div>
        <div id="content"></div>
	   	      
    </div>
    
    <script>
	files_start();
	contacts = [-1];
	contact_names = ['..'];
	posts = [];
	files.in_contacts = false;
	files.in_messages = false;
	files.username = "{{ $username }}";   
	files.userid = "{{ Auth::user()->id }}";   
	</script>
	
	
	<div hidden > Messages: <br>
		@include('includes.message_block')
	</div>
	<div hidden style="position:fixed;top:50%;">
		<a id="show_home" href="{{ route('home') }}">Show home</a> 
		<a id="show_contacts" href="{{ route('contacts') }}">Show connections</a> 
		@if ($in_contacts)
			<?php $i=0; ?>
			Connection: {{ count($connections) }}<br>
			@foreach($connections as $connection)
				<a id="contact_{{ $connection }}" href="{{ route('messages', ['name'=> $connection] ) }}">  {{ $connection }}</a> |
				<script>
					contacts.push("{{ $connection }}");
					contact_names.push("{{ $names[$i] }}");
				</script>
				<?php $i+=1; ?>
			@endforeach
			<form action="{{ route('connection_add') }}" method="post">
				<input class="form-control" type="text" name="name"  > 
				<button type="submit" class="btn btn-primary"> Add connection </button>
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
				<p>  {{ $post->message }} </p>
				<!-- <div class="info">Posted by {{ $post->user->first_name }} on {{ $post->created_at }}, to {{ $post->user_id_to }}</div> -->
				<div>Posted by {{ $post->user_id }} on {{ $post->created_at }}, to {{ $post->user_id_to }}</div>
				<div>
					<a href="#">Edit</a> |
					<a href="{{ route('message_delete', ['post_id'=> $post->id]) }}">Delete</a> 
				</div>
				<script>
					posts.push(["{{ $post->id }}", "{{ $post->user_id }}", "{{ $post->created_at }}",  "{{ $post->message }}"]);
				</script>
			@endforeach
		@endif
	</div>
	
	
	<div hidden style="position:fixed;top:80%;">
		
		<div id="add-folder" class="btn btn-primary"> Add folder </div> 
			
		<form action="{{ route('reader') }}" method="get"style="position:absolute;top:0;width:50%;left:0;">
			<input  type='hidden'  name='file_text' id='goreader_filetext' value='some text'> 
			<button id="goreader_submit" type="submit" class="btn btn-primary"> Reader </button>
			<input type="hidden" name="_token" value="{{ Session::token() }}">
		</form>
		
	   
	    <form action="{{ route('create') }}" role='form' id='createForm' name='createForm' method='post' enctype='multipart/form-data' >
	            <input               name='file_name' id='create_filename'>Fname</input>
	            <input               name='file_text' id='create_filetext'>Text</input>
	            <input type='hidden' name='working_dir' id='working_dir'>
	            <input type='hidden' name='type' id='type' value='{{ request("type") }}'>
	            <input type='hidden' name='_token' value='{{csrf_token()}}'>
	            <button id='create_submit' type="submit" class="btn btn-primary">Create</button>
	    </form>
	    
	    
	    <form action="{{ route('copy') }}" role='form' id='copyForm' name='copyForm' method='post' enctype='multipart/form-data' >
	            <input               name='copy_path' id='copy_path'>Path</input>
	            <input type='hidden' name='working_dir' id='working_dir'>
	            <input type='hidden' name='type' id='type' value='{{ request("type") }}'>
	            <input type='hidden' name='_token' value='{{csrf_token()}}'>
	            <button id='copy_submit' type="submit" class="btn btn-primary">Copy</button>
	    </form>
	    
	    <form action="{{ route('update') }}" role='form' id='updateForm' name='updateForm' method='post' enctype='multipart/form-data' >
	            <input               name='file_name' id='update_filename'>Fname</input>
	            <input               name='file_text' id='update_filetext'>Text</input>
	            <input type='hidden' name='working_dir' id='working_dir'>
	            <input type='hidden' name='type' id='type' value='{{ request("type") }}'>
	            <input type='hidden' name='_token' value='{{csrf_token()}}'>
	            <button id="update_submit" type="submit" class="btn btn-primary">Update</button>
	    </form>
	
		<form action="{{ route('unisharp.lfm.upload') }}" role='form' id='uploadForm' name='uploadForm' method='post' enctype='multipart/form-data' class="dropzone">
			<div class="form-group" id="attachment">
			  
			  <div class="controls text-center">
				<div class="input-group" style="width: 100%">
				  <a class="btn btn-primary" id="upload-button">{{ trans('laravel-filemanager::lfm.message-choose') }}</a>
				</div>
			  </div>
			</div>
			<input type='hidden' name='working_dir' id='working_dir'>
			<input type='hidden' name='type' id='type' value='{{ request("type") }}'>
			<input type='hidden' name='_token' value='{{csrf_token()}}'>
		</form>
	
	</div>
	
	
	
  <div id="lfm-loader"></div>

  <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
  <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min.js"></script>
   <script language=JavaScript type="text/javascript" src="{{ URL::to('js/plugins/jquery.foggy.min.js') }}"></script>
  <script>
    var route_prefix = "{{ url('/') }}";
    var lfm_route = "{{ url(config('lfm.url_prefix', config('lfm.prefix'))) }}";
    var lang = {!! json_encode(trans('laravel-filemanager::lfm')) !!};
  </script>
  <script>{!! \File::get(base_path('public/js/script.js')) !!}</script>
 
  
	@if ($create=='yes')
	<script>
		performLfmRequest('newfolder', {name: 'mail'})
		.done(refreshFoldersAndItems); 
	</script>
	@endif
	@if ($in_messages)
		<script>
			reader.draft = '{{ $draft }}';                               //console.log('Draft: '+reader.draft);
			files.contactname = '{{ $contactname }}';
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
	  /*
    Dropzone.options.uploadForm = {
      paramName: "upload[]", // The name that will be used to transfer the file
      uploadMultiple: false,
      parallelUploads: 5,
      clickable: '#upload-button',
      dictDefaultMessage: 'Or drop files here to upload',
      init: function() {
        var _this = this; // For the closure
        this.on("addedfile", function(file) { refreshFoldersAndItems('OK'); });
        this.on('success', function(file, response) {
          
          if(response != 'OK'){
            this.defaultOptions.error(file, response.join('\n'));
          }
          
      });
      },
      acceptedFiles: "{{ lcfirst(str_singular(request('type'))) == 'image' ? implode(',', config('lfm.valid_image_mimetypes')) : implode(',', config('lfm.valid_file_mimetypes')) }}",
      maxFilesize: ({{ lcfirst(str_singular(request('type'))) == 'image' ? config('lfm.max_image_size') : config('lfm.max_file_size') }} / 1000)
    
    }
    */
  </script>
</body>
</html>


Forms:<br>	
		
@if ($in_contacts)
    Connection: {{ count($connections) }}<br>
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


Messages: <br>

@if(count('errors')>0)
	<div class="row">
		<div class="col-md-5 error">
			<ul>
				@foreach($errors->all() as $error)
					<li> {{ $error }} </li>
					<script> 
						console.log("PHP Error: "+"{{ $error }}" ); 
						files.php_errors.push( "{{ $error }}" );
					</script>
				@endforeach
			</ul>
		</div>
	</div>	
@endif

<script>
	console.log("PHP_MSG_____: "+"{{ $msg }}" );  
	console.log("PHP_UNREAD__: "+"{{ $unread }}" );  
	console.log("PHP_USERNAME: "+"{{ $username }}" );  
</script>
@if(Session::has('msg'))
	<div class="row">
		<div class="col-md-5 success">
			{{ Session::get('msg') }}
			<script> 
				console.log("PHP Message: "+"{{ Session::get('msg') }}" );
				files.php_messages.push( "{{ Session::get('msg') }}"  );
			</script>
		</div>
	</div>	
@endif

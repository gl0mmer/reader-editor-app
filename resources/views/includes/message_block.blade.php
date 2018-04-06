Messages: <br>

@if(count('errors')>0)
	@foreach($errors->all() as $error)
		<script> 
			console.log("PHP Error: "+"{{ $error }}" ); 
			files.php_errors.push( "{{ $error }}" );
		</script>
	@endforeach
@endif

<script>
	console.log("PHP_MSG_____: "+"{{ $msg }}" );  
	console.log("PHP_UNREAD__: "+"{{ $unread }}" );  
	console.log("PHP_USERNAME: "+"{{ $username }}" );  
</script>
@if(Session::has('msg'))
	<script> 
		console.log("PHP Message: "+"{{ Session::get('msg') }}" );
		files.php_messages.push( "{{ Session::get('msg') }}"  );
	</script>
@endif

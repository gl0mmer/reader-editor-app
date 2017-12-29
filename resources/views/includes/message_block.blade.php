@if(count('errors')>0)
	<div class="row">
		<div class="col-md-5 error">
			<ul>
				@foreach($errors->all() as $error)
					<li> {{ $error }} </li>
				@endforeach
			</ul>
		</div>
	</div>	
@endif

@if(Session::has('msg'))
	<div class="row">
		<div class="col-md-5 success">
			{{ Session::get('msg') }}
		</div>
	</div>	
@endif

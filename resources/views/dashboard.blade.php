@extends('layouts.master')

@section('body')
	@if (Auth::user())
		<h3> Username: {{Auth::user()->first_name}} </h3>
	@endif
	
	@include('includes.message_block')
	<a href="{{ route('logout') }}">Logout</a> | 
	<a href="{{ route('message_delete_all') }}">Delete all</a> | 
	<a href="{{ route('contacts') }}">Show connections</a> 
	
	
	<div class="col-md-10">
		@foreach($connections as $connection)
			<a href="{{ route('messages', ['name'=> $connection] ) }}">  {{ $connection }}</a> |
		@endforeach
	</div>
	<br><br>
	<div class="col-md-6">
	<form action="{{ route('connection_add') }}" method="post">
		<div class="form-group {{ $errors->has('add_connection') ? 'has-error' : '' }}">
			<input class="form-control" type="text" name="name"  > 
		</div>
		<button type="submit" class="btn btn-primary"> Add connection </button>
		<input type="hidden" name="_token" value="{{ Session::token() }}">
	</form>
	</div>
	
	<section class="row new-post">
		<div class="col-md-1"></div>
		<div class="col-md-6">
			<header> <h3> What do you have to say </h3> </header>
			<form action="{{ route('message_create') }}" method="post">
				<div class="form-group">
					<textarea class="form-control" name="message" id="new-post" rows="5" plaseholder="Your Post"></textarea>
				</div>
				<input   name="id_to" value="{{ $id_to }}" > {{ $id_to }} </input>
				<button type="submit" class="btn btn-primary">Create Post</button>
				<input type="hidden" value="{{ Session::token() }}" name="_token">
			</form>
		</div>
	</section>
	<section class="row posts">
		<div class="col-md-1"></div>
		<div class="col-md-10">
			<header> <h3> What other say </h3> </header>
			@foreach($posts as $post)
				<article class="post">
					<p>  {{ $post->message }} </p>
					<!-- <div class="info">Posted by {{ $post->user->first_name }} on {{ $post->created_at }}, to {{ $post->user_id_to }}</div> -->
					<div class="info">Posted by {{ $post->user_id }} on {{ $post->created_at }}, to {{ $post->user_id_to }}</div>
					<div class="interaction">
						<a href="#">Like</a> |
						<a href="#">Dislike</a> |
						<a href="#">Edit</a> |
						<a href="{{ route('message_delete', ['post_id'=> $post->id]) }}">Delete</a> 
					</div>
				</article>
			@endforeach
		</div>
	</section>
	<!--
	<iframe src="/laravel-filemanager" style="width: 100%; height: 500px; overflow: hidden; border: none;"></iframe>
	-->
@endsection

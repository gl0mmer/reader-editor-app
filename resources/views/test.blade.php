@extends('layouts.master')

@section('title')
	test !
@endsection

@section('body')
	
	<div hidden > Messages: <br>
		@include('includes.message_block')
	</div>
	
	Content
	<iframe src="/laravel-filemanager" style="width: 100%; height: 100vw; overflow: hidden; border: none;"></iframe>

@endsection


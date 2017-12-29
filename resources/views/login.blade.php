@extends('layouts.master')

@section('title')
	Welcome!
@endsection

@section('body')
	<script language=JavaScript type="text/javascript" src="{{ URL::to('js/welcome.js') }}"></script> 
	
	@include('includes.header')
	@include('includes.message_block')
	
	@if (Auth::user())
	<h3> Username: {{Auth::user()->first_name}} </h3>
	@endif
	
	@include('includes.login')
	
	
	<button id="login_test" onclick="login_test();" class="btn btn-primary"> login </button>
	
@endsection


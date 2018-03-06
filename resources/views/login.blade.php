@extends('layouts.master')

@section('title')
	Welcome!
@endsection

@section('body')
	
	@include('includes.header')
	@include('includes.message_block')
	
	@if (Auth::user())
	<h3> Username: {{Auth::user()->first_name}} </h3>
	@endif
	
	@include('includes.login')
	
	
	<script>
		function login_test(){
			console.log('Test welcome');
			document.getElementById('signin_username').value = 'guest';
			document.getElementById('signin_password').value = 'guest';
			document.getElementById('signin_submit').click();
		}
	</script>
	<button id="login_test" onclick="login_test();" class="btn btn-primary"> login </button>
	
@endsection


<div hidden class="row new-post" >
	<div class="col-md-3">
	</div>	

	<div class="col-md-3">
		<h3> Sign Up </h3>
		<form action="{{ route('signup') }}" method="post">
			<div class="form-group {{ $errors->has('email') ? 'has-error' : '' }}">
				<label for="email"> Your E-Mail </label>
				<input class="form-control" type="text" name="email" id="signup_email" value="{{ Request::old('email') }}"> 
			</div>
			<div class="form-group {{ $errors->has('first_name') ? 'has-error' : '' }}">
				<label for="first_name"> First Name </label>
				<input class="form-control" type="text" name="first_name" id="signup_username" value="{{ Request::old('first_name') }}"> 
			</div>
			<div class="form-group {{ $errors->has('password') ? 'has-error' : '' }}">
				<label for="password"> Password </label>
				<input class="form-control" type="password" name="password" id="signup_password" value="{{ Request::old('password') }}"> 
			</div>
			<button id="signup_submit" type="submit" class="btn btn-primary"> Submit </button>
			<input type="hidden" name="_token" value="{{ Session::token() }}">
		</form>
	</div>
	<div class="col-md-3">
		<h3> Sign In </h3>
		<form action="{{ route('signin') }}" method="post">
			<div class="form-group {{ $errors->has('first_name') ? 'has-error' : '' }}">
				<label for="first_name"> User name </label>
				<input class="form-control" type="text" name="first_name" id="signin_username" value="{{ Request::old('first_name') }}"> 
			</div>
			<div class="form-group {{ $errors->has('password') ? 'has-error' : '' }}">
				<label for="password"> PAssword </label>
				<input class="form-control" type="password" name="password" id="signin_password" value="{{ Request::old('password') }}"> 
			</div>
			<button id="signin_submit" type="submit" class="btn btn-primary"> Submit </button>
			<input type="hidden" name="_token" value="{{ Session::token() }}">
		</form>
	</div>
	
	<a id='logout_submit' href="{{ route('logout') }}">Logout</a>
</div>

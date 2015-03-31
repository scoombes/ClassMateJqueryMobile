function loginValidations()
{
	$("#login-form").validate(
	{
		submitHandler: handleLoginForm,
		errorPlacement: errorLocation,
		rules:
		{
			email:
			{
				required: true,
				email: true
			},
			password:
			{
				required: true
			}
		},
		messages:
		{
			email:
			{
				required: "Enter a an email address",
				email: "Enter a valid email address"
			},
			password:
			{
				required: "Enter password"
			}
		},
	});
}

function registerValidations() {
	$("#signup-form").validate(
	{
		submitHandler: handleSignupForm,
		errorPlacement: errorLocation,
		rules:
		{
			signupemail:
			{
				required: true,
				email: true
			},
			signuppassword:
			{
				required: true
			},
			confirmsignuppassword:
			{
				required: true,
				equalTo: "#signup-password"
			},
			signupfname:
			{
				required: true
			},
			signuplname:
			{
				required: true
			}
		},
		messages:
		{
			signupemail:
			{
				required: "Enter an email address",
				email: "Eneter a valid email address"
			},
			signuppassword:
			{
				required: "Enter a password"
			},
			confirmsignuppassword:
			{
				required: "Confirm password",
				equalTo: "Passwords don't match"
			},
			signupfname:
			{
				required: "Enter your First Name"
			},
			signuplname:
			{
				required: "Enter your Last Name"
			}
		}
	});
}


//template function for validations
function Validations() {
	$("#").validate( 
	{
		submitHandler: handleLoginForm,
		errorPlacement: errorLocation,
		rules:
		{
			
		},
		messages:
		{
			
		},
	});
}

//use this to correct location of error message
function errorLocation(error, element)
{
	error.appendTo(element.parent().next());
}
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
function addCourseValidations() {
	$("#add-course-form").validate( 
	{
		//change submit handler
		submitHandler: handleAddCourse,
		rules:
		{
			"course-code": {
				required: true
			},
			"course-section": {
				required: true
			},
			"course-name": {
				required: true
			},
			"semester": {
				required: true
			},
			"course-year": {
				required: true
			},
			"teacher-name": {
				required: true
			}
		},
		messages:
		{
			"course-code": {
				required: "Please enter the course code"
			},
			"course-section": {
				required: "Please enter the section"
			},
			"course-name": {
				required: "Please enter the course name"
			},
			"semester": {
				required: "Please select a semester"
			},
			"course-year": {
				required: "Please enter the year"
			},
			"teacher-name": {
				required: "Please enter the teacher's name"
			}
		},
	});
}


//template function for validations
function Validations() {
	$("#").validate( 
	{
		//change submit handler
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
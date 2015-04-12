/* validation.js
 *		Holds all of the validation settings for various forms
 *
 * 		Sean Coombes - 3/25/15 js file created
 */ 

 //Validation for the login page.
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
		}
	});
}

//Validation for the register page
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

//create course validations
function addCourseValidations() {
	$("#add-course-form").validate( 
	{
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
		}
	});
}

//validation rules for creating an event
function createEventValidations() {
	$.validator.addMethod("regex", function(value, element, regexpr) {          
				return regexpr.test(value);
				});
	$("#create-event").validate( 
	{
		submitHandler: handleCreateEvent,
		errorPlacement: errorLocation,
		rules:
		{
			eventname:
			{
				required: true
			},
			eventcourse:
			{
				required: true
			},
			eventdue:
			{
				required: true,
				date: true
			},
			eventtime:
			{
				required: function()
				{
					return $("#eventtype").val() != "1";
				},
				regex: /^([01]\d|2[0-3]):?([0-5]\d)$/
			}

		},
		messages:
		{
			
			eventname:
			{
				required: "The name of the event is required"
			},
			eventcourse:
			{
				required: "Select the course of the event"
			},
			eventdue:
			{
				required: "A due date for event is required",
				date: "Improper date format"
			},
			eventtime:
			{
				required: "A time must be entered",
				regex: "improper time format"
			}
		}
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
			
		}
	});
}

//use this to correct location of error message
function errorLocation(error, element)
{
	error.appendTo(element.parent().next());
}

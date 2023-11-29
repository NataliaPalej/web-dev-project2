// Rot URL for RESTful API
var loginURL = 'http://localhost/Assessment/Sprint2/api';
var userURL = 'http://localhost/Assessment/Sprint2/api/user';
var currentUser;

/*************************
 *                       *
 *     COMMON METHODS    *
 *                       *
 ************************/
var loginUser = function (email, password) {
    $.ajax({
        type: 'GET',
        url: loginURL + '/authenticate',
        contentType: 'application/json',
        data: { email: email, password: password },
        success: function (data, textStatus, jqXHR) {
            console.log("Success Data:", data);
            // If status 200 user auth and can be redirected to home.html
            if (jqXHR.status === 200) {
                console.log("Login successful!");
                sessionStorage.setItem('loggedInUser', JSON.stringify(data));
                window.location.href = 'home.html';
            } else {
                console.log("error : loginUser() ", textStatus, jqXHR.status);
                alert("An error occurred during login. Please try again.");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error : loginUser() ", textStatus, errorThrown);
            alert("error : Invalid email or password. Please try again.");
        }
    });
};




// Function to fetch user details from the server
var fetchUserDetails = function () {
    // Check if the user is logged in
    var loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        // Make an AJAX request to fetch user details
        $.ajax({
            type: 'GET',
            url: '/api/user/' + loggedInUser.userID, // Adjust the endpoint as needed
            dataType: 'json',
            success: function (userDetails) {
                console.log('Fetched User Details:', userDetails);
                // Now you can use userDetails to update your UI or do other operations
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error fetching user details:', textStatus, errorThrown);
            }
        });
    }
};

// LOGOUT button
var logoutBtn = function () {
    console.log("logoutBtn() : called");
    window.location.href = "logout.html";
};








/************************
 *                      *
 *     USER METHODS     * 
 *                      *
 ************************/
// ADD user
var addUser = function () {
    console.log("addUser() : called");
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: userURL,
        dataType: "json",
        data: formToJSON(),
        success: function (data, textStatus, jqXHR) {
            console.log("success : User added");
            //$('#btnDelete').show();
            $('#userID').val(data.id);
            findAll();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error : addUser(): " + textStatus);
        }
    })
}

// GET all users
var getUsers = function () {
    $.ajax({
        type: 'GET',
        url: userURL,
        dataType: 'json',
        // call renderList to display all rows from db
        success: renderUsers
    });
};

// Render details for ALL users
var renderUsers = function (data) {
    console.log("renderUsers() loading...");
    var list = data.users;
    $.each(list, function (index, users) {
        $('#table_body').append(
            '<tr><td>' + users.userID +
            '</td><td>' + users.username +
            '</td><td>' + users.password +
            '</td><td>' + users.firstName +
            '</td><td>' + users.lastName +
            '</td><td>&euro;' + users.address +
            '</td><td>' + users.phoneNo +
            '</td><td>' + users.email +
            '</td><td><img src="pics/' + users.image + '" alt="' + users.firstName + '" width="100" height="100"></td></tr>'
        );
    });
    console.log("success : renderUsers() loaded");
    $('#usersTable').dataTable();   // dataTable() will render in the same format as products with search field
};

// Function to auto-populate update form with user details
// Render details for one user
var renderUser = function (users) {
    console.log("renderUser() : called");
    $('#userID').val(users.userID);
    $('#username').val(users.username);
    $('#password').val(users.password);
    $('#firstName').val(users.firstName);
    $('#lastName').val(users.lastName);
    $('#address').val(users.address);
    $('#phoneNo').val(users.phoneNo);
    $('#email').val(users.email);
    console.log("renderUser() : Fetching images");

    if (users.image) {
        $('#image').attr('src', 'pics/' + users.image);
    } else {
        // Set default image if there is an issue with the corresponding one
        console.log("error: renderUser() couldn't get an image");
        $('#image').attr('src', 'pics/default.jpg');
    }
    console.log("renderUser(): " + users);
    // Return the updated user details
    return users;

};


// UPDATE user with email
var updateUser = function () {
    console.log("updateUser() : called");
    $.ajax({
        type: 'PUT',
        contentType: "application/json",
        url: userURL + '/' + loggedInUser.email,
        data: formToJSON(),
        success: function (data, textStatus, jqXHR) {
            console.log("success : User updated " + $('#email'.val()));
            alert("success : User updated " + $('#email'.val()));
            renderUser(loggedInUser.email);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error : updateUser(): " + textStatus);
        }
    });
};

// DELETE user
var deleteUser = function () {
    console.log("deleteUser() : called");
    console.log("User to delete: " + userURL + "/" + $('#userID').val());

    $.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        url: userURL + '/' + $('#userID').val(),
        success: function (data, textStatus, jqXHR) {
            console.log("success : User " + $('#userID').val + " deleted.");
            alert("success : User " + $('#userID').val + "was deleted.");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error : deleteUser() " + textStatus);
            alert("error : deleteUser() " + textStatus);
            findAll();
        }
    });
};


// Serialize user form fields into JSON
var userToJSON = function () {
    var userID = $('#userID').val();
    return JSON.stringify({
        "userID": userID == "" ? null : userID,
        "username": $('#username').val(),
        "password": $('#password').val(),
        "firstName": $('#firstName').val(),
        "lastName": $('#lastName').val(),
        "address": $('#address').val(),
        "phoneNo": $('#phoneNo').val(),
        "email": $('#email').val(),
        "image": $('#picture').attr('src')
    });
};


// Function to auto-populate update form with user details
var populateUpdateForm = function () {
    // Check if the user is logged in
    var loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    console.log(loggedInUser)

    if (loggedInUser) {
        // Fetch user details from the server using AJAX
        $.ajax({
            type: 'GET',
            url: userURL + '/' + loggedInUser.userID, // Adjust the URL accordingly
            dataType: "json",
            success: function (data) {
                console.log("Success fetching user details:", data);

                // Set the form field values
                $('#username').val(data.username);
                $('#password').val(data.password);
                $('#firstName').val(data.firstName);
                $('#lastName').val(data.lastName);
                $('#address').val(data.address);
                $('#phoneNo').val(data.phoneNo);
                $('#email').val(data.email);
                console.log("data.firstName : " + data.firstName);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("Error fetching user details: ", textStatus, errorThrown);
            }
        });
    } else {
        alert("User Not Logged In.");
        console.log("error: populateUpdateForm() User not logged in");
    }
};





$(document).ready(function () {


    /************************
     *                      *
     *     USER BUTTONS     *
     *                      *
     ************************/

    $('#btnLogin').click(function (e) {
        e.preventDefault();

        // Retrieve email and password from login page
        var email = $('#email').val();
        var password = $('#password').val();

        // Call the loginUser function
        loginUser(email, password);
    });

    // LOGOUT button
    $('#logoutBtn').click(function () {
        logoutBtn();
        return false;
    });

    // Open the logout modal when the button is clicked
    $('#openLogoutModal').click(function () {
        console.log("success : openLogoutModal clicked")
        $('#logoutModal').modal('show');
    });

    // Nothing to delete in initial state 
    $('#btnDelete').hide();




    // Show/hide update form - user account
    $("#showFormBtn").click(function () {
        $("#btnUpdateForm").toggle(function () {
            if ($(this).is(":visible")) {
                console.log("showFormBtn: called");

                // Populate and log user details
                populateUpdateForm();
            }
        });
    });

    // SAVE user button
    $('#btnSaveUser').click(function () {
        if ($('#userID').val() == '') {
            updateUser();
        } else {
            console.log("error : #btnSaveUser")
        }
        return false;
    });

    // DELETE user
    $('#btnDeleteUser').click(function () {
        deleteUser();
        return false;
    });

});
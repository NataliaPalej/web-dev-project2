// Rot URL for RESTful API
var rootURL = 'http://localhost/Assessment/Sprint2/api/makeup';
var apiURL = 'http://localhost/Assessment/Sprint2/api';
var currentProduct;




/*************************
 * 
 *        LOGIN   
 * 
 ************************/
var loginUser = function (email, password) {
    $.ajax({
        type: 'GET',
        url: apiURL + '/authenticate',
        contentType: 'application/json',
        data: JSON.stringify({ email: email, password: password }),
        success: function (data, textStatus, jqXHR) {
            // Redirect to home.html upon successful login
            window.location.href = 'home.html';
            console.log("success : loginUser() " + email);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error : loginUser() " + textStatus);
        }
    });
};




/***************************
 * 
 *     PRODUCT METHODS
 * 
 **************************/

// Search product name
var search=function(productSearch){
    // if empty, show all
    if(productSearch == ''){
        findAll();
    } else {
        // else find by name
        findByName(productSearch);
    }
}

// GET all
var findAll=function(){
    $.ajax({
        type: 'GET',
        url: rootURL,
        dataType: 'json',
        // call renderList to display all rows from db
        success: renderList
    });
};

// GET by ID
var findById=function(id){
    console.log("findById() " + id + " : called");
    $.ajax({
        type: 'GET',
        url: rootURL + '/' + id,
        dataType: "json",
        success: function(data){
            $('#btnDelete').show();
            console.log("success : findById()" + data.name);
            currentProduct = data;
            renderDetails(currentProduct);
        }
    });
};

// GET by name
var findByName=function(productSearch){
    console.log("findByName() " + productSearch + " : called");
    $.ajax({
        type: 'GET',
        url: rootURL + '/searchByName/' + productSearch,
        dataType: "json",
        success: function(data){
            $('#btnDelete').show();
            console.log("success : findByName()" + data.name);
            currentProduct = data;
            renderDetails(currentProduct);
        }
    });
};

// GET by category
var findByCategory=function(productSearch){
    console.log("findByCategory() " + productSearch + " : called");
    $.ajax({
        type: 'GET',
        url: rootURL + '/searchByCategory/' + category,
        dataType: "json",
        success: function(data){
            $('#btnDelete').show();
            console.log("success : findByCategory()" + data.name);
            currentProduct = data;
            renderDetails(currentProduct);
        }
    });
};

// GET by company
var findByCompany=function(productSearch){
    console.log("findByCompany() " + productSearch + " : called");
    $.ajax({
        type: 'GET',
        url: rootURL + '/searchByCompany/' + company,
        dataType: "json",
        success: function(data){
            $('#btnDelete').show();
            console.log("success : findByCompany()" + data.name);
            currentProduct = data;
            renderDetails(currentProduct);
        }
    });
};

// ADD new product
var newProduct=function () {
    console.log("newProduct() : called")
	$('#btnDelete').hide();
	currentProduct = {};
    // Display empty form
	renderDetails(currentProduct);
};

// ADD new product with formToJSON to parse into JSON
var addProduct=function (){
    console.log("addProduct() : called");
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: rootURL,
        dataType: "json",
        data: formToJSON(),
        success: function(data, textStatus, jqXHR){
            console.log("success : Product added");
            $('#btnDelete').show();
            $('#productID').val(data.id);
            findAll();
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("error : addProduct(): " + textStatus);
        }
    })
}

// DELETE with ID
var deleteProduct=function(){
    console.log("deleteProduct() : called");
    console.log("Product to delete: " + rootURL + "/" + $('#productID').val());

    $.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        url: rootURL + '/' + $('#productID').val(),
        success: function(data, textStatus, jqXHR) {
            console.log("success : Product " + $('#productID').val + " deleted.");
            alert("success : Product " + $('#productID').val + "was deleted.");
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("error : deleteProduct() " + textStatus);
            alert("error : DeleteProduct() " + textStatus);
            findAll();
        }
    });
};

// Update product by ID
var updateProduct=function(){
    console.log("updateProduct() : called");
    $.ajax({
        type: 'PUT',
        contentType: "application/json",
        url: rootURL + '/' + $('#productID'.val()),
        data: formToJSON(),
        success: function(data, textStatus, jqXHR) {
            console.log("success : Product updated " + $('#productID'.val()));
            alert("success : Product updated " + $('#productID'.val()));  
            findAll();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("error : updateProduct(): " + textStatus);
        }
    });
};

// Render details for ALL products
var renderList = function (data) {
    console.log("renderList() loading...");
    var list = data.products;
    $.each(list, function (index, products) {
        $('#productsBody').append(
            '<tr><td>' + products.productID +
            '</td><td>' + products.productName +
            '</td><td>' + products.productCategory +
            '</td><td>' + products.productDescription +
            '</td><td>' + products.company +
            '</td><td>&euro;' + products.price +
            '</td><td>' + products.stock +
            '</td><td>' + products.onSale +
            '</td><td>' + products.discontinued +
            '</td><td><img src="pics/' + products.picture + '" alt="' + products.productName + '" width="100" height="100"></td></tr>'
        );
    });
    console.log("success : renderList() loaded");
    $('#productTable').dataTable();
};

// Render details for searched product
var renderDetails=function(products){
    console.log("renderDetails() : called");
    $('#productID').val(products.productID);
    $('#productName').val(products.productName);
    $('#productCategory').val(products.productCategory);
    $('#productDescription').val(products.productDescription);
    $('#company').val(products.company);
    $('#price').val(products.price);
    $('#stock').val(products.stock);
    $('#onSale').val(products.onSale);
    $('#discontinued').val(products.discontinued);
    console.log("renderDetails() : Fetching images");

    if (products.picture) {
        $('#picture').attr('src', 'pics/' + products.picture);
    } else {
        // Set default image if there is issue with corresponding one
        $('#picture').attr('src', 'pics/default.jpg');
    }
};

// Serialize form fields into JSON
var formToJSON = function() {
    var productID = $('#productID').val();
    return JSON.stringify({
        "productID": productID == "" ? null : productID,
        "productName" : $('#productName').val(),
        "productCategory" : $('#productCategory').val(),
        "productDescription" : $('#productDescription').val(),
        "company" : $('#company').val(),
        "price" : $('#price').val(),
        "stock" : $('#stock').val(),
        "onSale" : $('#onSale').val(),
        "discontinued" : $('#discontinued').val(),
        "picture" : $('#picture').attr('src')
    });
};



/************************
 * 
 *     USER METHODS 
 * 
 ************************/
// ADD user
var addUser=function (){
    console.log("addUser() : called");
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: rootURL,
        dataType: "json",
        data: formToJSON(),
        success: function(data, textStatus, jqXHR){
            console.log("success : User added");
            //$('#btnDelete').show();
            $('#userID').val(data.id);
            findAll();
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("error : addUser(): " + textStatus);
        }
    })
}

// GET all users
var getUsers=function(){
    $.ajax({
        type: 'GET',
        url: rootURL,
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

// Render details for one user
var renderUser=function(users){
    console.log("renderDetails() : called");
    $('#userID').val(users.userID);
    $('#username').val(users.username);
    $('#password').val(users.password);
    $('#firstName').val(users.firstName);
    $('#lastName').val(users.lastName);
    $('#address').val(users.address);
    $('#phoneNo').val(users.phoneNo);
    $('#email').val(users.email);
    console.log("renderDetails() : Fetching images");

    if (users.image) {
        $('#image').attr('src', 'pics/' + users.image);
    } else {
        // Set default image if there is issue with corresponding one
        console.log("error: renderUser() couldnt get an image")
        $('#image').attr('src', 'pics/default.jpg');
    }
};


// UPDATE user with ID
var updateUser=function(){
    console.log("updateUser() : called");
    $.ajax({
        type: 'PUT',
        contentType: "application/json",
        url: rootURL + '/' + $('#userID'.val()),
        data: formToJSON(),
        success: function(data, textStatus, jqXHR) {
            console.log("success : User updated " + $('#userID'.val()));
            alert("success : User updated " + $('#userID'.val()));  
            findAll();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("error : updateUser(): " + textStatus);
        }
    });
};

// DELETE user
var deleteUser=function(){
    console.log("deleteUser() : called");
    console.log("User to delete: " + rootURL + "/" + $('#userID').val());

    $.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        url: rootURL + '/' + $('#userID').val(),
        success: function(data, textStatus, jqXHR) {
            console.log("success : User " + $('#userID').val + " deleted.");
            alert("success : User " + $('#userID').val + "was deleted.");
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("error : deleteUser() " + textStatus);
            alert("error : deleteUser() " + textStatus);
            findAll();
        }
    });
};





/*****************************
 * 
 *      COMMON METHODS
 * 
 *****************************/


// LOGOUT button
var logoutBtn = function() {
    console.log("logoutBtn() : called");
    window.location.href = "logout.html";
};








/*****************************
 * 
 *      WHEN DOM IS READY 
 * 
 *****************************/
$(document).ready(function(){

    $('#btnLogin').click(function (e) {
        e.preventDefault();

        // Retrieve email and password from login page
        var email = $('#email').val();
        var password = $('#password').val();

        // Call the loginUser function
        loginUser(email, password);
    });







    // Nothing to delete in initial state 
    $('#btnDelete').hide();



    /**************************
     * 
     *     PRODUCT BUTTONS
     * 
     *************************/
    // Search button ????
    $('#btnSearch').click(function(){
        search($('#searchName').val());
        return false;
    });

    // Call SEARCH on demand button
	$('#productName').keypress(function(e){
		if(e.which == 13) {
			search($('#productName').val());
			e.preventDefault();
			return false;
	    }
	});

    // Find By ID button
    $('#productList a').on("click",function() {
		findById($(this).data('identity'));
	});
    $(document).on("click", '#productList a', function(){findById(this.id);});


    // ADD button
    $('#btnAddProduct').click(function(){
        newProduct();
        return false;
    });

    // SAVE button
    $('#btnSaveProduct').click(function(){
        if ($('#productID').val() == ''){
            addProduct();
        } else {
            updateProduct();        
        }   
        return false;
    });

     // DELETE button
     $('#btnDeleteProduct').click(function(){
        deleteProduct();
        return false;
    });





    /************************
     * 
     *     USER BUTTONS
     * 
     ************************/

    // Show/hide update form - user account
    $("#showFormBtn").click(function () {
        console.log("showFormBtn : called");
        $("#btnUpdateForm").toggle();
    });

     // SAVE user button
     $('#btnSaveUser').click(function(){
        if ($('#userID').val() == ''){
            updateUser();
        } else {
            console.log("error : #btnSaveUser")        
        }   
        return false;
    });

    // DELETE user
    $('#btnDeleteUser').click(function(){
        deleteUser();
        return false;
    });




    /**********************
     * 
     *   COMMON BUTTONS
     * 
     **********************/
    // LOGOUT button
    $('#logoutBtn').click(function(){
        logoutBtn();
        return false;
    });

    // Reset the form to empty fields
    $('#productID').val("");
    $('#productName').val("");
    $('#productCategory').val("");
    $('#productDescription').val("");
    $('#company').val("");
    $('#price').val("");
    $('#stock').val("");
    $('#onSale').val("");
    $('#discontinued').val("");
    $('#picture').attr('src', "");

    // Call findAll method
    findAll();

    

    
});


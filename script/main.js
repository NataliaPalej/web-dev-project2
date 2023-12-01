// Rot URL for RESTful API
var rootURL = 'http://localhost/Assessment/Sprint2/api/makeup';
var loginURL = 'http://localhost/Assessment/Sprint2/api';
var userURL = 'http://localhost/Assessment/Sprint2/api/user';
var currentProduct;

// LOGIN logic
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
                sessionStorage.setItem('loggedInUser', data);
                window.location.href = 'index.html';
                var loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
                console.log("Logged in user details:", loggedInUser);
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

// LOGOUT button
var logoutBtn = function () {
    console.log("logoutBtn() : called");
    sessionStorage.clear();
    console.log("logoutBtn() : session cleared");
    window.location.href = "logout.html";
};

// REGISTER button
var registerBtn = function () {
    console.log("success : registerBtn() : called");
    window.location.href = "register.html";
    resetUserDetails();
    console.log("success : resetUserDetails() called")
}

/****************************************************************************************************/
// GET all
var findAll = function () {
    $.ajax({
        type: 'GET',
        url: rootURL,
        dataType: 'json',
        // call renderList to display all rows from db
        success: renderList
    });
};

// GET by
var getProduct = function (id) {
    console.log("success :findById() called\tSearch for: " + id);
    console.log(rootURL + '/' + id);
    $.ajax({
        type: 'GET',
        url: rootURL + '/' + id,
        dataType: "json",
        success: function (product) {
            console.log(JSON.stringify(product))
            renderProductToUpdate(product); 
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Couldn't findById()\n" + textStatus + "\n" + errorThrown);
            alert("Couldn't findById()\n" + textStatus + "\n" + errorThrown);
        }
    });
};

// Render details for one product in your HTML form
var renderProductToUpdate = function (product) {
    console.log("renderProductToUpdate: called");
    $('#updateProductID').text(product.productID);
    $("#updateName").val(product.productName);
    $("#updateCategory").val(product.productCategory);
    $("#updateDescription").val(product.productDescription);
    $("#updateCompany").val(product.company);
    $("#updatePrice").val(product.price);
    $("#updateStock").val(product.stock);
    $("#updateOnSale").val(product.onSale);
    $("#updateDiscontinued").val(product.discontinued);
    $('#pictureView').attr('src', 'pics/products/' + product.picture);
    $('#pictureInput').val(product.picture);
};

var findByName = function (productName) {
    console.log("success : findByName() called\tSearch for: " + productName);
    console.log("success : findByName() called\tSearch for: " + rootURL + '/searchByName/' + productName);
    $.ajax({
        type: 'GET',
        url: rootURL + '/searchByName/' + productName,
        dataType: "json",
        contentType: 'application/json',
        success: function (data) {
            console.log("Searched product:");
            console.log(data);
            console.log("success : findByName() " + data.productName);
            // Storing product info in currentProduct
            currentProduct = data;
            renderFindByName();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error : findByName()\n" + textStatus + " \n" + errorThrown);
        }
    });
};

var renderFindByName = function () {
    console.log("renderFindByName() : called");
    // Loop through the list to fetch product details
    currentProduct.forEach((element) => processProduct(element));
};

function processProduct(element) {
    console.log("myFunction() product name : " + element.productName);
    $('#productID').text(element.productID);
    $('#productName').text(element.productName);
    $('#productCategoy').text(element.productCategory);
    $('#productDescription').text(element.productDescription);
    $('#company').text(element.company);
    $('#price').text("\u20ac" + element.price);
    $('#stock').text(element.stock);
    $('#onSale').text(element.onSale);
    $('#discontinued').text(element.discontinued);
    console.log("myFunction() : Fetching product images");
    if (element.picture) {
        $('#picture').attr('src', 'pics/products/' + element.picture);
    } else {
        // Set default image if there is an issue with the corresponding one
        $('#picture').attr('src', 'pics/products/default.jpg');
    }
}

// GET by category
var findByCategory = function (productSearch) {
    console.log("findByCategory() " + productSearch + " : called");
    $.ajax({
        type: 'GET',
        url: rootURL + '/searchByCategory/' + productSearch,
        dataType: "json",
        success: renderCategoryList
    });
};

// Render details for findByCategory
var renderCategoryList = function (data) {
    console.log(data);
    console.log("renderList() loading...");
    $.each(data, function (index, product) {
        var row = $('<tr>');
        row.append('<td>' + product.productID + '</td>');
        row.append('<td style="font-size: 14px;">' + product.productName + '</td>');
        row.append('<td>' + product.productCategory + '</td>');

        // Create Description column with accordion to show text when pressed
        var descriptionColumn = $('<td style="font-size: 11px;">');
        descriptionColumn.append(
            '<a class="btn btn-link" data-toggle="collapse" href="#descriptionAccordion' + index + '" role="button" aria-expanded="false" aria-controls="descriptionAccordion' + index + '">Show Description</a>'
        );
        descriptionColumn.append(
            '<div class="collapse description-accordion" id="descriptionAccordion' + index + '">' + product.productDescription + '</div>'
        );
        row.append(descriptionColumn);

        row.append('<td>' + product.company + '</td>');
        row.append('<td>&euro;' + product.price + '</td>');
        row.append('<td>' + product.stock + '</td>');
        row.append('<td>' + product.onSale + '</td>');
        row.append('<td>' + product.discontinued + '</td>');
        row.append('<td><img src="pics/products/' + product.picture + '" alt="' + product.productName + '" width="100" height="100"></td>');
        console.log("products " + product.productName);
        console.log(row);
        // Append the row to the tbody
        $('#findByCategoryBody').append(row);
    });

    console.log("success : renderList() loaded");
    $('#findByCategoryTable').dataTable();
};

// GET by company
var findByCompany = function (productSearch) {
    console.log("findByCompany() " + productSearch + " : called");
    console.log(rootURL + '/searchByCompany/' + productSearch)
    $.ajax({
        type: 'GET',
        url: rootURL + '/searchByCompany/' + productSearch,
        dataType: 'json',
        success: renderCompanyList
    });
};

// Render details for findByCompany
var renderCompanyList = function (data) {
    console.log(data);
    console.log("renderList() loading...");
    $.each(data, function (index, product) {
        var row = $('<tr>');
        row.append('<td>' + product.productID + '</td>');
        row.append('<td style="font-size: 14px;">' + product.productName + '</td>');
        row.append('<td>' + product.productCategory + '</td>');

        // Create Description column with accordion to show text when pressed
        var descriptionColumn = $('<td style="font-size: 11px;">');
        descriptionColumn.append(
            '<a class="btn btn-link" data-toggle="collapse" href="#companyAccordion' + index + '" role="button" aria-expanded="false" aria-controls="companyAccordion' + index + '">Show Description</a>'
        );
        descriptionColumn.append(
            '<div class="collapse description-accordion" id="companyAccordion' + index + '">' + product.productDescription + '</div>'
        );
        row.append(descriptionColumn);

        row.append('<td>' + product.company + '</td>');
        row.append('<td>&euro;' + product.price + '</td>');
        row.append('<td>' + product.stock + '</td>');
        row.append('<td>' + product.onSale + '</td>');
        row.append('<td>' + product.discontinued + '</td>');
        row.append('<td><img src="pics/products/' + product.picture + '" alt="' + product.productName + '" width="100" height="100"></td>');
        console.log("products " + product.productName);
        console.log(row);
        // Append the row to the tbody
        $('#findByCompanyBody').append(row);
    });

    console.log("success : renderList() loaded");
    $('#findByCompanyTable').dataTable();
};

// ADD new product with formToJSON to parse into JSON
var addProduct = function () {
    console.log("addProduct() : called");
    var requestData = productToJSON();
    console.log(rootURL);
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: rootURL,
        dataType: "json",
        data: JSON.stringify(requestData),
        success: function (textStatus, jqXHR) {
            console.log("success : addProduct()\nProduct " + requestData.productName + " added successfully.");
            alert("success : addProduct()\nProduct " + requestData.productName + " added successfully.");
            clearProductTable();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("error : addProduct()\nrequestData() details:\n" + requestData);
            console.log("Type of requestData(): " + typeof (requestData));
            alert("error : addProduct() when adding product" + textStatus + "\n" + errorThrown);
            console.log("error : addProduct()\n" + textStatus + " \n" + errorThrown);
        }
    });
};

var clearProductTable = function () {
    console.log("success : resetUserDetails() called")
    $('#inputName').val("");
    $('#inputCategory').val("");
    $('#inputDescription').val("");
    $('#inputCompany').val("");
    $('#inputPrice').val("");
    $('#inputStock').val("");
    $('#inputDiscontinued').val("");
    $('#inputOnSale').val("");
    $('#inputPicture').val("");
}

// GET product to delete
var getProductToDelete = function (id) {
    console.log("success :findById() called\tSearch for: " + id);
    console.log(rootURL + '/' + id);
    $.ajax({
        type: 'GET',
        url: rootURL + '/' + id,
        dataType: "json",
        success: function (product) {
            console.log(JSON.stringify(product))
            renderProductToDelete(product); 
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Couldn't findById()\n" + textStatus + "\n" + errorThrown);
            alert("Couldn't findById()\n" + textStatus + "\n" + errorThrown);
        }
    });
};

// Render details for one product in your HTML form
var renderProductToDelete = function (product) {
    console.log("renderProductToUpdate: called");
    $('#deleteProductID').text(product.productID);
    $("#deleteName").text(product.productName);
    $("#deleteeCategory").text(product.productCategory);
    $("#deleteDescription").text(product.productDescription);
    $("#deleteCompany").text(product.company);
    $("#deletePrice").text(product.price);
    $("#deleteStock").text(product.stock);
    $("#deleteOnSale").text(product.onSale);
    $("#deleteDiscontinued").text(product.discontinued);
    $('#deletePicture').attr('src', 'pics/products/' + product.picture);
};

// DELETE product
var deleteProduct = function (id) {
    console.log("deleteProduct() : called");
    console.log("Product to delete: " + id);
    console.log(rootURL + '/' + id)

    $.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        url: rootURL + '/' + id,
        success: function (data, textStatus, jqXHR) {
            console.log("success : Product " + id + " deleted.");
            alert("success : Product " + id + " deleted.\nYou will be redirected to Admin page.");
            window.location.href = "admin.html";
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error : deleteProduct() " + textStatus);
            alert("error : DeleteProduct() " + textStatus);
        }
    });
};

// Function to get product data from form fields
var getProductToUpdate = function () {
    return {
        productID: $('#updateProductID').text(),
        productName: $("#updateName").val(),
        productCategory: $("#updateCategory").val(),
        productDescription: $("#updateDescription").val(),
        company: $("#updateCompany").val(),
        price: $("#updatePrice").val(),
        stock: $("#updateStock").val(),
        onSale: $("#updateOnSale").val(),
        discontinued: $("#updateDiscontinued").val(),
        picture: $('#pictureInput').val()
    };
};

// Update product by ID
var updateProduct = function () {
    var productToUpdate = getProductToUpdate();
    console.log("updateProduct() : called" + productToUpdate.productID);
    console.log(rootURL + '/' + productToUpdate.productID);
    $.ajax({
        type: 'PUT',
        contentType: "application/json",
        url: rootURL + '/' + productToUpdate.productID,
        data: JSON.stringify(productToUpdate),
        success: function (data, textStatus, jqXHR) {
            console.log("success : Product updated " + productToUpdate.productID);
            alert("success : Product updated " + productToUpdate.productID + " " + productToUpdate.productName);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error : updateProduct(): " + textStatus);
            alert("error : updateProduct(): " + textStatus + "\n" + errorThrown);
        }
    });
};

// Render details for ALL products
var renderList = function (data) {
    console.log("renderList() loading...");
    var list = data.products;
    $.each(list, function (index, products) {
        var row = $('<tr>');
        row.append('<td>' + products.productID + '</td>');
        row.append('<td style="font-size: 14px;">' + products.productName + '</td>');
        row.append('<td>' + products.productCategory + '</td>');

        // Create Description column with accordion to show text when pressed
        var descriptionColumn = $('<td style="font-size: 11px;">');
        descriptionColumn.append(
            '<a class="btn btn-link" data-toggle="collapse" href="#descriptionAccordion' + index + '" role="button" aria-expanded="false" aria-controls="descriptionAccordion' + index + '">Show Description</a>'
        );
        descriptionColumn.append(
            '<div class="collapse description-accordion" id="descriptionAccordion' + index + '">' + products.productDescription + '</div>'
        );
        row.append(descriptionColumn);

        row.append('<td>' + products.company + '</td>');
        row.append('<td>&euro;' + products.price + '</td>');
        row.append('<td>' + products.stock + '</td>');
        row.append('<td>' + products.onSale + '</td>');
        row.append('<td>' + products.discontinued + '</td>');
        row.append('<td><img src="pics/products/' + products.picture + '" alt="' + products.productName + '" width="100" height="100"></td>');

        // Append the row to the tbody
        $('#productsBody').append(row);
    });

    console.log("success : renderList() loaded");
    $('#productTable').dataTable();
};

// Render details for findByCategory/findByCompany product
var renderDetails = function (product) {
    console.log("renderDetails() : called");
    $('#productID').val(product.productID);
    $('#productName').val(product.productName);
    $('#productCategory').val(product.productCategory);
    $('#productDescription').val(product.productDescription);
    $('#company').val(product.company);
    $('#price').val(product.price);
    $('#stock').val(product.stock);
    $('#onSale').val(product.onSale);
    $('#discontinued').val(product.discontinued);
    console.log("renderDetails() : Fetching product images");
    if (product.picture) {
        $('#picture').attr('src', 'pics/products/' + product.picture);
    } else {
        // Set default image if there is issue with corresponding one
        $('#picture').attr('src', 'pics/products/default.jpg');
    }
};

// Serialize form fields into JSON
var productToJSON = function () {
    // Construct the JSON object using jQuery's .val() method
    var productData = {
        "productName": $('#inputName').val(),
        "productCategory": $('#inputCategory').val(),
        "productDescription": $('#inputDescription').val(),
        "company": $('#inputCompany').val(),
        "price": $('#inputPrice').val(),
        "stock": $('#inputStock').val(),
        "onSale": $('#inputOnSale').val(),
        "discontinued": $('#inputDiscontinued').val(),
        "picture": $('#inputPicture').val(),
    };
    // Convert price and stock to numbers
    productData.price = parseFloat(productData.price);
    productData.stock = parseInt(productData.stock, 10);

    var newProduct = productData;
    console.log("success : productToJSON() called.");
    //alert(JSON.stringify(newProduct));
    return newProduct;
};

// Serialize form fields into JSON
var formToJSON = function () {
    var productID = $('#productID').val();
    return JSON.stringify({
        "productID": productID == "" ? null : productID,
        "productName": $('#productName').val(),
        "productCategory": $('#productCategory').val(),
        "productDescription": $('#productDescription').val(),
        "company": $('#company').val(),
        "price": $('#price').val(),
        "stock": $('#stock').val(),
        "onSale": $('#onSale').val(),
        "discontinued": $('#discontinued').val(),
        "picture": $('#picture').val()
    });
};

/****************************************************************************************************/
// ADD user
var addUser = function () {
    console.log("addUser() : called");
    var requestData = registerToJSON();
    
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: userURL,
        dataType: "json",
        data: JSON.stringify(requestData),
        success: function (textStatus, jqXHR) {
            console.log("success : addUser()\nUser " + requestData.firstName + " " + requestData.lastName + " added successfully.");
            alert("success : addUser()\nUser " + requestData.firstName + " " + requestData.lastName + " added successfully.");
            window.location.href = "login.html";
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Type of requestData(): " + typeof(requestData));
            alert("error : addUser() when adding user\n" + textStatus + "\n" + errorThrown);
            console.log("error : addUser()\n" + textStatus + " \n" + errorThrown);
        }
    });
};

// GET user
var getUser = function () {
    var loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    $.ajax({
        type: 'GET',
        url: userURL + '/' + loggedInUser.userID,
        data: userToJSON(),
        // call renderList to display all rows from db
        success: renderUser
    });
};

// Render details for one user in settings.html
var renderUser = function (data) {
    var loggedInUser = JSON.parse(data);
    console.log("renderUser() : called");
    console.log("renderUser() : " + loggedInUser);
    console.log("renderUser() typeof : " + typeof (loggedInUser));
    console.log(loggedInUser.userID + " " + loggedInUser.username);

    // Auto populate user details into the input fields in settings.html page
    $('#image').attr('src', 'pics/users/' + loggedInUser.image);
    $('#userID').text(loggedInUser.userID);
    $('#username').val(loggedInUser.username);
    $('#email').val(loggedInUser.email);
    $('#password').val(loggedInUser.password);
    $('#firstName').val(loggedInUser.firstName);
    $('#lastName').val(loggedInUser.lastName);
    $('#address').val(loggedInUser.address);
    $('#phoneNo').val(loggedInUser.phoneNo);
    $('#picture').val(loggedInUser.image);

    console.log("success : renderUser() loaded");
};

// UPDATE user by ID
var updateUser = function () {
    var loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    console.log("updateUser(id) : called");
    $.ajax({
        type: 'PUT',
        contentType: "application/json",
        url: userURL + '/' + loggedInUser.userID,
        data: userToJSON(),
        success: function (data, textStatus, jqXHR) {
            console.log("success : updateUser()\n User "+ loggedInUser.userID + " " + loggedInUser.firstName + " updated successfully ");
            alert("success : updateUser()\nUser " + loggedInUser.userID + " " + loggedInUser.firstName + " updated successfully " );
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error : updateUser()\n " + textStatus);
            alert("error : updateUser(id)\n " + textStatus + "\n" + errorThrown);
        }
    });
};

// RESET table rows for user
var resetUserDetails = function () {
    console.log("success : resetUserDetails() called")
    $('#username').val("");
    $('#password').val("");
    $('#email').val("");
    $('#firstName').val("");
    $('#lastName').val("");
    $('#address').val("");
    $('#phoneNo').val("");
    $('#picture').attr('src', "");
}

// DELETE user
var deleteUser = function () {
    var loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    console.log("deleteUser() : called");
    console.log("deleteUser()\nUser to delete API: " + userURL + "/" + loggedInUser.userID);

    $.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        url: userURL + '/' + loggedInUser.userID,
        success: function (data, textStatus, jqXHR) {
            console.log("success : deleteUser() \nUser " + loggedInUser.userID + " " + loggedInUser.firstName + " deleted.");
            alert("success : deleteUser() \nUser " + loggedInUser.userID + " " + loggedInUser.firstName + " was deleted.\nYou will be redirected to login page now.");
            window.location.href = 'login.html';
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error : deleteUser() " + textStatus);
            alert("error : deleteUser() " + textStatus + "\n" + errorThrown);
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
        "image": $('#picture').val(),
    });
};

// Register serialize user form fields into JSON
var registerToJSON = function () {
    // Construct the JSON object with the image data
    var userData = {
        //"userID": $('#userID').val(),
        "username": $('#username').val(),
        "password": $('#password').val(),
        "firstName": $('#firstName').val(),
        "lastName": $('#lastName').val(),
        "address": $('#address').val(),
        "phoneNo": $('#phoneNo').val(),
        "email": $('#email').val(),
        "image": $('#image').val(),
    };
    var newUser = userData;
    return newUser;
};


/**********************    DOM     READY    **********************************/
$(document).ready(function () {

    // LOGIN
    $('#btnLogin').click(function (e) {
        console.log("btnLogin clicked");
        // Prevent the default behavior, gives more control over what is happening after btn clicked
        e.preventDefault();

        // Retrieve email and password from login page
        var email = $('#email').val();
        var password = $('#password').val();

        // Call the loginUser function
        loginUser(email, password);
        console.log("success : btnLogin() \n Email: " + email + "\tPassword: " + password);
    });

    // REGISTER user
    $('#registerBtn').click(function (e) {
        console.log("registerBtn clicked");
        e.preventDefault();
        registerBtn();
    });

    // Call findAll and getUser method
    try {
        findAll();
    } catch (error) {
        console.log("Couldnt  load findAll() products yet.");
    }
    try {
        getUser();
    } catch (error) {
        console.log("Couldnt  load getUser() details yet.");
    }

    // BACK button
    $('#backBtn').click(function () {
        console.log("logoutBtn clicked");
        history.back();
    });

    // LOGOUT button
    $('#logoutBtn').click(function () {
        console.log("logoutBtn clicked");
        logoutBtn();
    });

    // Open the logout modal when the button is clicked
    $('#openLogoutModal').click(function () {
        console.log("openLogoutModal clicked")
        $('#logoutModal').modal('show');
    });

    // Add click event listener to the Description cells
    $('#productTable tbody').on('click', 'td:nth-child(4)', function () {
        // Toggle the collapse state of corresponding accordion content
        $(this).closest('tr').find('.description-accordion').collapse('toggle');
    });

    // ADD user
    $('#addUser').click(function (e) {
        e.preventDefault()
        console.log("#addUser : clicked");
        addUser();
    });

    // UPDATE user
    $('#updateUser').click(function () {
        console.log("#updateUser : clicked");
        updateUser();
    });

    // DELETE user
    $('#openDeleteModal').click(function () {
        // Show the delete confirmation modal
        console.log("openDeleteModal clicked")
        $('#deleteModal').modal('show');
    });

    // Event handler for confirm delete button in the modal
    $('#deleteUserBtn').click(function () {
        // Delete user when confirmed
        deleteUser();
    });

    /****************************************************************************************************/

    // SEARCH product to update
    $('#searchProductBtn').click(function () {
        console.log("#searchProductBtn clicked")
        // Get the product ID
        var productID = $('#productID').val();

        // Perform the search logic here (e.g., check if the product exists)
        if (productID != null || productID !== '') {
            console.log("searchProductBtn : product to update " + productID);
            $('#updateProductForm').show();
        } else {
            alert("error : searchProductBtn()\nProduct " + productID + " doesn't exist.");
            console.log("error : searchProductBtn() " + productID + " doesn't exist.");
        }
    });

    // SEARCH product to delete
    $('#searchProductToDelete').click(function () {
        console.log("#searchProductToDelete clicked")
        $('#deleteProductForm').show()

        // Get the product ID
        var productToDelete = $('#productToDelete').val();
        getProductToDelete(productToDelete);

        if (productToDelete != null || productToDelete !== '') {
            console.log("searchProductToDelete : product to delete " + productToDelete);
            
            $('#deleteProduct').click(function () {
                deleteProduct(productToDelete);
            })
        } else {
            alert("error : searchProductToDelete()\nProduct " + productToDelete + " doesn't exist.");
            console.log("error : searchProductToDelete " + productToDelete + " doesn't exist.");
        }
    });

    // SEARCH product BY
    $('#searchByName').click(function () {
        $('#companyInput').val("");
        $('#categoryInput').val("");
        console.log("#searchByName clicked")
        // Get the product name
        var productName = $('#productInput').val();

        if (productName != null || productName !== '') {
            $('#searchByNameTab').show();
            findByName(productName);
            $('#productInput').val("");
        } else {
            alert("error : searchByName()\nProduct " + productName + " doesn't exist.");
            console.log("error : searchByName " + productName + " doesn't exist.");
        }
    });

    // Function to clear the table
    function clearTable(tabId) {
        $(tabId).find('tbody').empty();
    }

    $('#searchByCategory').click(function () {
        $('#productInput').val("");
        $('#companyInput').val("");
        $('#searchByCompanyTab').hide();
        console.log("#searchByCategory clicked")
        // Clear the table
        clearTable('#searchByCategoryTab');
        // Get the product category
        var category = $('#categoryInput').val();

        if (category != null || category !== '') {
            console.log("searchByCategory : " + category);
            $('#searchByCategoryTab').show();
            findByCategory(category);
            $('#categoryInput').val("");
        } else {
            alert("error : searchByCategory()\nProduct " + category + " doesn't exist.");
            console.log("error : searchByCategory " + category + " doesn't exist.");
        }
    });

    $('#searchByCompany').click(function () {
        $('#productInput').val("");
        $('#categoryInput').val("");
        $('#searchByCompanyTab').hide();
        console.log("#searchByCompany clicked")
        // Clear the table
        clearTable('#searchByCompanyTab');
        // Get the product company name
        var company = $('#companyInput').val();

        if (company != null || company !== '') {
            console.log("searchByCompany : " + company);
            $('#searchByCompanyTab').show();
            findByCompany(company);
            $('#companyInput').val("");
        } else {
            alert("error : searchByCompany()\nProduct " + company + " doesn't exist.");
            console.log("error : searchByCategory " + company + " doesn't exist.");
        }
    });

    // ADD product
    $('#addProduct').click(function (e) {
        e.preventDefault()
        console.log("#addProduct : clicked");
        addProduct();
    });

    // GET product to update
    $('#searchProductBtn').click(function () {
        console.log("#searchProductBtn : clicked");
        var productID = $("#productIDInput").val();
        getProduct(productID);
    });    

    // UPDATE product
    $('#updateProduct').click(function () {
        console.log("#updateProduct : clicked");
        updateProduct();
    });
});
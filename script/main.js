// Rot URL for RESTful API
var rootURL = 'http://localhost/Assessment/Sprint2/api/makeup';
var currentProduct;

// Search product name
var search=function(productSearch){
    if(productSearch == ''){
        findAll();
    } else {
        findByName(productSearch);
    }
}

// GET all
var findAll=function(){
    $.ajax({
        type: 'GET',
        url: rootURL,
        dataType: 'json',
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
        $('#table_body').append(
            '<tr><td>' + products.productID +
            '</td><td>' + products.productName +
            '</td><td>' + products.productCategory +
            '</td><td>' + products.productDescription +
            '</td><td>' + products.company +
            '</td><td>' + products.price +
            '</td><td>' + products.stock +
            '</td><td>' + products.onSale +
            '</td><td>' + products.discontinued +
            '</td><td>' + products.picture + '</td></tr>'
        );
    });
    console.log("success : renderList() loaded");
    $('#table_id').dataTable();
};

// Render details for searched product
var renderDetails=function(products){
    console.log("renderDetails() : called");
    $('#productID').val(products.id);
    $('#productName').val(products.productName);
    $('#productCategory').val(products.productCategory);
    $('#productDescription').val(products.productDescription);
    $('#company').val(products.company);
    $('#price').val(products.price);
    $('#stock').val(products.stock);
    $('#onSale').val(products.onSale);
    $('#discontinued').val(products.discontinued);
    console.log("renderDetails() : Fetching images")
    $('#picture').attr('src', 'pics/' + products.picture);
};

// Serialize form fields into JSON
var formToJSON = function() {
    var productID = $('#productID').val();
    return JSON.stringify({
        "id": productID == "" ? null : productID,
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

// When DOM is ready
$(document).ready(function(){
    // Nothing to delete in initial state 
    $('#btnDelete').hide();

    // Search button
    $('#btnSearch').click(function(){
        search($('#searchName').val());
        return false;
    });

    // Call SEARCH
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
    $('#btnAdd').click(function(){
        newProduct();
        return false;
    });

    // SAVE/UPDATE button
    $('#btnSave').click(function(){
        if ($('#productID').val() == ''){
            addProduct();
        } else {
            updateProduct();        
        }   
        return false;
    });

    // DELETE button
    $('#btnDelete').click(function(){
        deleteProduct();
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

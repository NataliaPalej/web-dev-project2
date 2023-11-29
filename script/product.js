// Rot URL for RESTful API
var rootURL = 'http://localhost/Assessment/Sprint2/api/makeup';
var currentProduct;

/***************************
 *                         *
 *     PRODUCT METHODS     *
 *                         *
 **************************/

// Search product name
var search = function (productSearch) {
    // if empty, show all
    if (productSearch == '') {
        findAll();
    } else {
        // else find by name
        findByName(productSearch);
    }
}

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

// GET by ID
var findById = function (id) {
    console.log("findById() " + id + " : called");
    $.ajax({
        type: 'GET',
        url: rootURL + '/' + id,
        dataType: "json",
        success: function (data) {
            $('#btnDelete').show();
            console.log("success : findById()" + data.name);
            currentProduct = data;
            renderDetails(currentProduct);
        }
    });
};

// GET by name
var findByName = function (productSearch) {
    console.log("findByName() " + productSearch + " : called");
    $.ajax({
        type: 'GET',
        url: rootURL + '/searchByName/' + productSearch,
        dataType: "json",
        success: function (data) {
            $('#btnDelete').show();
            console.log("success : findByName()" + data.name);
            currentProduct = data;
            renderDetails(currentProduct);
        }
    });
};

// GET by category
var findByCategory = function (productSearch) {
    console.log("findByCategory() " + productSearch + " : called");
    $.ajax({
        type: 'GET',
        url: rootURL + '/searchByCategory/' + category,
        dataType: "json",
        success: function (data) {
            $('#btnDelete').show();
            console.log("success : findByCategory()" + data.name);
            currentProduct = data;
            renderDetails(currentProduct);
        }
    });
};

// GET by company
var findByCompany = function (productSearch) {
    console.log("findByCompany() " + productSearch + " : called");
    $.ajax({
        type: 'GET',
        url: rootURL + '/searchByCompany/' + company,
        dataType: "json",
        success: function (data) {
            $('#btnDelete').show();
            console.log("success : findByCompany()" + data.name);
            currentProduct = data;
            renderDetails(currentProduct);
        }
    });
};

// ADD new product
var newProduct = function () {
    console.log("newProduct() : called")
    $('#btnDelete').hide();
    currentProduct = {};
    // Display empty form
    renderDetails(currentProduct);
};

// ADD new product with formToJSON to parse into JSON
var addProduct = function () {
    console.log("addProduct() : called");
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: rootURL,
        dataType: "json",
        data: formToJSON(),
        success: function (data, textStatus, jqXHR) {
            console.log("success : Product added");
            $('#btnDelete').show();
            $('#productID').val(data.id);
            findAll();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error : addProduct(): " + textStatus);
        }
    })
}

// DELETE with ID
var deleteProduct = function () {
    console.log("deleteProduct() : called");
    console.log("Product to delete: " + rootURL + "/" + $('#productID').val());

    $.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        url: rootURL + '/' + $('#productID').val(),
        success: function (data, textStatus, jqXHR) {
            console.log("success : Product " + $('#productID').val + " deleted.");
            alert("success : Product " + $('#productID').val + "was deleted.");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error : deleteProduct() " + textStatus);
            alert("error : DeleteProduct() " + textStatus);
            findAll();
        }
    });
};

// Update product by ID
var updateProduct = function () {
    console.log("updateProduct() : called");
    $.ajax({
        type: 'PUT',
        contentType: "application/json",
        url: rootURL + '/' + $('#productID').val(),
        data: formToJSON(),
        success: function (data, textStatus, jqXHR) {
            console.log("success : Product updated " + $('#productID'.val()));
            alert("success : Product updated " + $('#productID'.val()));
            findAll();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error : updateProduct(): " + textStatus);
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
        row.append('<td><img src="pics/' + products.picture + '" alt="' + products.productName + '" width="100" height="100"></td>');

        // Append the row to the tbody
        $('#productsBody').append(row);
    });

    console.log("success : renderList() loaded");
    $('#productTable').dataTable();
};

// Render details for searched product
var renderDetails = function (products) {
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
        "picture": $('#picture').attr('src')
    });
};




// Bootstrap accordion to display Description when clicked on it
$(document).ready(function () {
    // Add a click event listener to the Description cells
    $('#productTable tbody').on('click', 'td:nth-child(4)', function () {
        // Toggle the collapse state of corresponding accordion content
        $(this).closest('tr').find('.description-accordion').collapse('toggle');
    });
});








$(document).ready(function () {

    /*************************
     *                        *  
     *     PRODUCT BUTTONS    *
     *                        *
     *************************/
    // Search button ????
    $('#btnSearch').click(function () {
        search($('#searchName').val());
        return false;
    });

    // Call SEARCH on demand button
    $('#productName').keypress(function (e) {
        if (e.which == 13) {
            search($('#productName').val());
            e.preventDefault();
            return false;
        }
    });

    // Find By ID button
    $('#productList a').on("click", function () {
        findById($(this).data('identity'));
    });
    $(document).on("click", '#productList a', function () { findById(this.id); });


    // ADD button
    $('#btnAddProduct').click(function () {
        newProduct();
        return false;
    });

    // SAVE button
    $('#btnSaveProduct').click(function () {
        if ($('#productID').val() == '') {
            addProduct();
        } else {
            updateProduct();
        }
        return false;
    });

    // DELETE button
    $('#btnDeleteProduct').click(function () {
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

<?php
function getProducts() {
	if (isset($_GET['sort'])){
		$col=$_GET['sort'];
	}
	else{
		$col="productID";
	}
	$query = "SELECT * FROM products ORDER BY "."$col";
	try {
	global $db;
		$products = $db->query($query);  
		$products = $products->fetchAll(PDO::FETCH_ASSOC);
		header("Content-Type: application/json", true);
		echo '{"products": ' . json_encode($products) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"message":"Products database empty","details":"' . $e->getMessage() . '"}}'; 
	}
}

function getProduct($productID) {
	$query = "SELECT * FROM products WHERE productID = '$productID'";
    try {
		global $db;
		$products = $db->query($query);  
		$product = $products->fetch(PDO::FETCH_ASSOC);
        header("Content-Type: application/json", true);
        echo json_encode($product);
    } catch(PDOException $e) {
        echo '{"error":{"message":"Product ID doesnt exist.","details":"' . $e->getMessage() . '"}}';
    }
}

function findByName($productName) {
	$query = "SELECT * FROM products WHERE productName LIKE '%$productName%' ORDER BY productID";
	global $db;
	try {
		// Prep the query to be executed
		$products = $db->query($query);
		// Get product(s) that match the input
        $product = $products->fetchAll(PDO::FETCH_ASSOC);
        header("Content-Type: application/json", true);
		// If product doesn't exist, display message
		// === checks if values AND their data types are equal
		if (count($product) === 0) {
			echo json_encode(["Error" => "Product not found, try again."]);
		} else {
			echo json_encode($product);
		}
    } catch(PDOException $e) {
        echo '{"error":{"message":"Product doesnt exist.","details":"' . $e->getMessage() . '"}}';
    }
}

function findByCompany($company) {
	$query = "SELECT * FROM products WHERE company LIKE '%$company' ORDER BY productID";
    try {
		global $db;
		$products = $db->query($query);  
		$product = $products->fetchAll(PDO::FETCH_ASSOC);
        header("Content-Type: application/json", true);
        echo json_encode($product);
    } catch(PDOException $e) {
        echo '{"error":{"message":"Company doesnt exist.","details":"' . $e->getMessage() . '"}}';
    }
}

function findByCategory($productCategory) {
	$query = "SELECT * FROM products WHERE productCategory LIKE '%$productCategory%' ORDER BY productID";
	try {
		global $db;
		$products = $db->query($query);  
		$product = $products->fetchAll(PDO::FETCH_ASSOC);
        header("Content-Type: application/json", true);
        echo json_encode($product);
    } catch(PDOException $e) {
        echo '{"error":{"message":"Category doesnt exist.","details":"' . $e->getMessage() . '"}}';
    }
}

// Insert new product 
function addProduct(){
	global $app;
	$request = $app->request();
	$products = json_decode($request->getBody());
	$productName = $products->productName;
	$productCategory = $products->productCategory;
	$productDescription = $products->productDescription;
	$company = $products->company;
	$price = $products->price;
	$stock = $products->stock;
	$onSale = $products->onSale;
	$discontinued = $products->discontinued;
	$query = "INSERT INTO products 
          (productName, productCategory, productDescription, company, price, stock, onSale, discontinued) 
          VALUES 
          ('$productName', '$productCategory', '$productDescription', '$company', '$price', '$stock', '$onSale', '$discontinued')";
	
	try {
		global $db;
		$db->exec($query);
		$products->productID = $db->lastInsertId();
		$app->response->headers->set('Content-Type', 'application/json');
		echo '{"Success":{"message": "Product successfully added."}}';
		echo json_encode($products);
	} catch (PDOException $e) {
		$app->response->headers->set('Content-Type', 'application/json');
		echo '{"error":{"message":"Could not add product.","details":"' . $e->getMessage() . '"}}';
	}
}

// Update product by ID
function updateProduct($productID) {
	global $db;
	global $app;
	
	$request = $app->request();
	$products = json_decode($request->getBody());
	$productName = $products->productName;
	$productCategory = $products->productCategory;
	$productDescription = $products->productDescription;
	$company = $products->company;
	$price = $products->price;
	$stock = $products->stock;
	$onSale = $products->onSale;
	$discontinued = $products->discontinued;
	// Update the product in the database
    $query = "UPDATE products SET
              productName = '$productName',
              productCategory = '$productCategory',
              productDescription = '$productDescription',
              company = '$company',
              price = $price,
              stock = $stock,
              onSale = '$onSale',
              discontinued = '$discontinued'
              WHERE productID = $productID";
	
	try{
		// Prepare statement 
		$result = $db->prepare($query);
		$result->execute();
		$app->response->headers->set('Content-Type', 'application/json');
		echo '{"Success":{"message": "Product updated successfully."}}';	
	} catch (PDOException $e){
		$app->response->headers->set('Content-Type', 'application/json');
		echo '{"error":{"message":"Could not update product.","details":"' . $e->getMessage() . '"}}';
	}
}

// Delete product by productID
function deleteProduct($productID){
	global $db;
	$query = "DELETE FROM products WHERE productID = $productID";
	try {
		echo '{"Success":{"message": "Product with ID ' . $productID . ' successfully deleted."}}';
		$db->exec($query);
	} catch (PDOException $e){
		echo '{"error":{"message":"Could not delete product.","details":"' . $e->getMessage() . '"}}';
	}
}


/**
---------------------
---- USERS TABLE ----
---------------------
**/
function getUsers(){
	if (isset($_GET['sort'])){
		$col=$_GET['sort'];
	}
	else{
		$col="userID";
	}
	$query = "SELECT * FROM users ORDER BY "."$col";
	try {
	global $db;
		$users = $db->query($query);  
		$users = $users->fetchAll(PDO::FETCH_ASSOC);
		header("Content-Type: application/json", true);
		echo '{"users": ' . json_encode($users) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"message":"Users database empty.","details":"' . $e->getMessage() . '"}}';
	}
}

function getUser($userID){
	$query = "SELECT * FROM users WHERE userID = '$userID'";
    try {
		global $db;
		$users = $db->query($query);  
		$user = $users->fetch(PDO::FETCH_ASSOC);
        header("Content-Type: application/json", true);
        echo json_encode($user);
    } catch(PDOException $e) {
        echo '{"error":{"message":"User ID doesnt exist.","details":"' . $e->getMessage() . '"}}';
    }
}

function searchByName($firstName){
	$query = "SELECT * FROM users WHERE firstName LIKE '%$firstName%' ORDER BY userID";
	global $db;
	try {
		$users = $db->query($query);
        $user = $users->fetchAll(PDO::FETCH_ASSOC);
        header("Content-Type: application/json", true);
		if (count($user) === 0) {
			echo json_encode(["Error" => "User not found."]);
		} else {
			echo json_encode($user);
		}
    } catch(PDOException $e) {
        echo '{"error":{"message":"Name doesnt exist.","details":"' . $e->getMessage() . '"}}';
    }
}

function addUser(){
	global $app;
	global $db;
	$request = $app->request();
	$users = json_decode($request->getBody());
	$username = $users->username;
	$password = $users->password;
	$firstName = $users->firstName;
	$lastName = $users->lastName;
	$address = $users->address;
	$phoneNo = $users->phoneNo;
	$email = $users->email;
	$query = "INSERT INTO users 
          (username, password, firstName, lastName, address, phoneNo, email) 
          VALUES 
          ('$username', '$password', '$firstName', '$lastName', '$address', '$phoneNo', '$email')";
	
	try {
		$db->exec($query);
		$users->userID = $db->lastInsertId();
		$app->response->headers->set('Content-Type', 'application/json');
		echo '{"Success":{"message": "User added successfully."}}';
		echo json_encode($users);
	} catch (PDOException $e) {
		$app->response->headers->set('Content-Type', 'application/json');
		echo '{"error":{"message":"Could not add user.","details":"' . $e->getMessage() . '"}}';
	}
}

function updateUser($userID){
	global $app;
	global $db;
	$request = $app->request();
	$users = json_decode($request->getBody());
	$username = $users->username;
	$password = $users->password;
	$firstName = $users->firstName;
	$lastName = $users->lastName;
	$address = $users->address;
	$phoneNo = $users->phoneNo;
	$email = $users->email;
	$query = "UPDATE users SET
          username = '$username', 
		  password = '$password', 
		  firstName = '$firstName', 
		  lastName = '$lastName', 
		  address = '$address', 
		  phoneNo = '$phoneNo', 
		  email = '$email'
		  WHERE userID = $userID";
	
	try{
		$result = $db->prepare($query);
		$result->execute();
		$app->response->headers->set('Content-Type', 'application/json');
		echo '{"Success":{"message": "User updated successfully."}}';	
	} catch (PDOException $e){
		$app->response->headers->set('Content-Type', 'application/json');
		echo '{"error":{"message":"Could not update user.","details":"' . $e->getMessage() . '"}}';
	}
}

function deleteUser($userID) {
	global $db;
	$query = "DELETE FROM users WHERE userID = $userID";
	try {
		echo '{"Success":{"message": "User with ID ' . $userID . ' successfully deleted."}}';
		$db->exec($query);
	} catch (PDOException $e){
		echo '{"error":{"message":"User could not be deleted.","details":"' . $e->getMessage() . '"}}';
	}
}

?>
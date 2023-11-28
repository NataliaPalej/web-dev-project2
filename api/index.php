<?php
require 'Slim/Slim.php';
require 'makeup_db.php';
require 'database.php';
use Slim\Slim;
\Slim\Slim::registerAutoloader();

$app = new Slim();

/**
makeupInventory table CRUD
**/
$app->get('/makeup', 'getProducts');
$app->get('/makeup/:id',  'getProduct');
// Search product by name/category/company route
$app->get('/makeup/searchByName/:query', 'findByName');
$app->get('/makeup/searchByCategory/:query', 'findByCategory');
$app->get('/makeup/searchByCompany/:query', 'findByCompany');
// Add product route 
$app->post('/makeup', 'addProduct');
// Update product route
$app->put('/makeup/:productID', 'updateProduct');
// Delete product route
$app->delete('/makeup/:productID', 'deleteProduct');


/**
users table CRUD
**/
$app->get('/user', 'getUsers');
$app->get('/user/:id',  'getUser');
$app->get('/user/:query', 'searchByName');
$app->post('/user', 'addUser');
$app->put('/user/:userID', 'updateUser');
$app->delete('/user/:userID', 'deleteUser');


/**
login
**/
$app->get('/authenticate', 'authenticateUser');;
/**
get user by email for update purposes
**/
$app->get('/user/:email', 'getUserByEmail');



$app->run();
?>




<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection details
$host = 'localhost'; // Replace with your database host
$dbname = 'GuhuzaSignUp'; // Replace with your database name
$username = 'root'; // Replace with your database username
$password = ''; // Replace with your database password

// Create a connection to the database
try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    // Set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Check if the form is submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve form data
    $username = $_POST['username'];
    $address = $_POST['address'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmPassword'];
    $terms = isset($_POST['terms']) ? 1 : 0; // Check if terms are accepted

    // Validate form data (server-side validation)
    $errors = [];

    if (empty($username)) {
        $errors[] = "Username is required.";
    }
    if (empty($address)) {
        $errors[] = "Address is required.";
    }
    if (empty($phone)) {
        $errors[] = "Phone number is required.";
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format.";
    }
    if (empty($password)) {
        $errors[] = "Password is required.";
    }
    if ($password !== $confirmPassword) {
        $errors[] = "Passwords do not match.";
    }
    if (!$terms) {
        $errors[] = "You must accept the terms and conditions.";
    }

    // If there are no errors, proceed to insert data into the database
    if (empty($errors)) {
        // Hash the password for security
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Prepare SQL query to insert data into the database
        $sql = "INSERT INTO users (username, address, phone, email, password, terms_accepted) 
                VALUES (:username, :address, :phone, :email, :password, :terms)";
        $stmt = $conn->prepare($sql);

        // Bind parameters to the query
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':terms', $terms);

        // Execute the query
        try {
            $stmt->execute();
            // Redirect to a success page or display a success message
            header("Location: login.html");
            exit();
        } catch (PDOException $e) {
            $errors[] = "Error: " . $e->getMessage();
        }
    }

    // If there are errors, display them
    if (!empty($errors)) {
        foreach ($errors as $error) {
            echo "<div class='error-message'>$error</div>";
        }
    }
}
?>
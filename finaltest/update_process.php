<?php
session_start();
require_once 'db_connect.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized access']);
    exit();
}

$user_id = $_SESSION['user_id'];
$response = ['status' => 'error', 'message' => ''];

try {
    $name = filter_input(INPUT_POST, 'newName', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $email = filter_input(INPUT_POST, 'newEmail', FILTER_SANITIZE_EMAIL);
    $phone = filter_input(INPUT_POST, 'newPhone', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $password = $_POST['newPassword'] ?? '';
    $profile_pic = '';

    // CSRF Protection
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        throw new Exception("Invalid CSRF token.");
    }

    // File Upload Handling
    if (!empty($_FILES['newProfilePic']['name'])) {
        $uploadDir = 'uploads/profiles/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $fileName = uniqid() . '_' . basename($_FILES['newProfilePic']['name']);
        $targetPath = $uploadDir . $fileName;

        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        $fileExtension = strtolower(pathinfo($_FILES['newProfilePic']['name'], PATHINFO_EXTENSION));

        if (!in_array($fileExtension, $allowedExtensions)) {
            throw new Exception('Invalid file type. Only JPG, PNG, and GIF are allowed.');
        }

        if (move_uploaded_file($_FILES['newProfilePic']['tmp_name'], $targetPath)) {
            $profile_pic = $targetPath;
        } else {
            throw new Exception('Failed to upload profile picture.');
        }
    }

    // Prepare SQL query
    $sql = "UPDATE users SET name = :name, email = :email, phone = :phone";
    $params = [
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone,
        ':id' => $user_id
    ];

    if (!empty($profile_pic)) {
        $sql .= ", profile_pic = :profile_pic";
        $params[':profile_pic'] = $profile_pic;
    }

    if (!empty($password)) {
        if (strlen($password) < 6) {
            throw new Exception("Password must be at least 6 characters long.");
        }
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $sql .= ", password = :password";
        $params[':password'] = $hashedPassword;
    }

    $sql .= " WHERE id = :id";

    $stmt = $pdo->prepare($sql);
    if ($stmt->execute($params)) {
        $_SESSION['user_name'] = $name;
        $_SESSION['user_email'] = $email;

        $response['status'] = 'success';
        $response['message'] = 'Profile updated successfully';
        if (!empty($profile_pic)) {
            $response['profile_pic'] = $profile_pic;
        }
    } else {
        throw new Exception('Failed to update profile');
    }
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
exit();
?>

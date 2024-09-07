<?php
include 'database.php';

$nama = $_POST['id'];
$usia = $_POST['gender'];

$sql = "INSERT INTO smktelkom (id, Gender) VALUES ('', 'cowo')";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $nama, $usia);

if ($stmt->execute()) {
    echo "Data berhasil ditambahkan";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>

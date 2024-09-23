<?php
include 'database.php';

// Ambil data dari request yang dikirim melalui POST
$data = json_decode(file_get_contents("php://input"));

if(isset($data->name) && isset($data->nominal) && isset($data->bayar)) {
    $name = $conn->real_escape_string($data->name);
    $nominal = $conn->real_escape_string($data->nominal);
    $bayar = $conn->real_escape_string($data->bayar);

    // Query untuk memasukkan data ke tabel
    $sql = "UPDATE `september2024` SET `nominal` = '$nominal', `bayar` = '$bayar' WHERE `september2024`.`nama` = '$name'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "New record created successfully"]);
    } else {
        echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
    }
} else {
    echo json_encode(["error" => "Invalid input"]);
}

// Tutup koneksi
$conn->close();
?>

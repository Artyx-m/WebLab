<?php

$config = parse_ini_file(__DIR__ . "/config/parametrs.ini", true);

if ($config === false) {
    die("Не найден файл с параметрами");
}

$db = $config["db"];

try {
    $dsn = "mysql:host={$db['host']};port={$db['port']};dbname={$db['name']};charset={$db['charset']}";
    $pdo = new PDO($dsn, $db["login"], $db["password"]);
} catch (PDOException $exception) {
    echo "Ошибка подключения к БД: " . $exception->getMessage();
    die();
}

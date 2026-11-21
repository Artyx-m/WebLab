<?php
require __DIR__ . "/db.php";

$limit = 10;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 10;

$stmt = $pdo->prepare("SELECT id, name, path, description, price FROM material ORDER BY id ASC LIMIT :limit OFFSET :offset");
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($items as $item) {
    echo '<a class="ad-card" href="detail.php?id=' . (int)$item['id'] . '">';
    echo '<img class="ad-card-image" src="' . htmlspecialchars($item['path']) . '" alt="' . htmlspecialchars($item['name']) . '" loading="lazy">';
    echo '<strong class="ad-card-price">' . htmlspecialchars($item['price']) . '</strong>';
    echo '<span class="ad-card-title">' . htmlspecialchars($item['name']) . '</span>';
    echo '</a>';
}
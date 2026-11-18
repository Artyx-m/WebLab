<?php
require __DIR__ . "/db.php";

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$stmt = $pdo->prepare("SELECT id, name, path, description FROM material WHERE id = :id");
$stmt->execute(['id' => $id]);
$item = $stmt->fetch(PDO::FETCH_ASSOC);

// Страховка от ошибки 404
if (!$item) {
    $item = $pdo->query("SELECT id, name, path, description FROM material LIMIT 1")->fetch(PDO::FETCH_ASSOC);
}
?>
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title><?= htmlspecialchars($item['name']) ?> — ЛГТУ</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="styles-fix.css">
</head>
<body>
  <main class="page-shell">
    <header class="site-header" aria-label="Главное меню">
      <div class="header-top">
        <div class="header-brand">
          <img src="assets/logo-icon.svg" alt="Иконка" class="brand-icon">
          <img src="assets/logo-text.svg" alt="Объявления" class="brand-text">
        </div>
        <div class="header-auth-actions" id="headerAuthActions">
          <button class="auth-btn" data-open-modal="register">Регистрация</button>
          <button class="auth-btn" data-open-modal="login">Вход</button>
        </div>
        <div class="header-user-state" id="headerUserState" hidden>
          <span id="headerGreeting">Константин</span>
          <button type="button" id="logoutButton">Выход</button>
        </div>
      </div>
      <img src="assets/divider.svg" alt="" class="header-divider-img">
    </header>

    <section class="detail-wrap" id="detail">
      <div class="detail-layout">
        <img class="detail-image" src="<?= htmlspecialchars($item['path']) ?>" alt="<?= htmlspecialchars($item['name']) ?>">
        <div>
          <h1 class="subpage-title"><?= htmlspecialchars($item['name']) ?></h1>
          <p class="detail-description"><?= nl2br(htmlspecialchars($item['description'] ?? '')) ?></p>
          <p id="authorPhone"></p>
          <button class="submit-button" id="respond">Откликнуться на объявление</button>
          <p class="form-status" id="respondStatus" aria-live="polite"></p>
        </div>
      </div>
    </section>
    <p><a class="text-link" href="index.php">← К объявлениям</a></p>

    <footer class="site-footer">
      <picture>
        <source media="(max-width: 599px)" srcset="assets/footer-mobile.svg">
        <source media="(max-width: 1024px)" srcset="assets/footer-tablet.svg">
        <img src="assets/footer-desktop.svg" alt="">
      </picture>
    </footer>
  </main>

  <div class="modal-backdrop" id="modalBackdrop" hidden>
    <section class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <button class="modal-close" id="closeModal" aria-label="Закрыть">×</button>
      <div class="modal-tabs" role="tablist" aria-label="Учётная запись">
        <button class="modal-tab active" data-tab="register" role="tab">Регистрация</button>
        <button class="modal-tab" data-tab="login" role="tab">Авторизация</button>
      </div>
      <h2 id="modalTitle" class="visually-hidden">Регистрация</h2>
      
      <form id="registerForm" class="account-form">
        <input name="name" autocomplete="name" placeholder="Ваше имя" required pattern="[А-Яа-яЁё\s-]+">
        <div class="form-row">
          <input name="email" type="email" autocomplete="email" placeholder="Email" required>
          <input name="phone" type="tel" autocomplete="tel" placeholder="Мобильный телефон" required pattern="[+0-9()\s-]{10,20}">
        </div>
        <div class="form-row">
          <input name="password" type="password" autocomplete="new-password" placeholder="Пароль" minlength="6" required>
          <input name="confirmPassword" type="password" autocomplete="new-password" placeholder="Повторите пароль" minlength="6" required>
        </div>
        <label class="consent"><input type="checkbox" name="consent" required><span>Согласен на обработку персональных данных</span></label>
        <button class="submit-button" type="submit">Зарегистрироваться</button>
      </form>
      
      <form id="loginForm" class="account-form" hidden>
        <div class="form-row">
          <input name="email" type="email" autocomplete="email" placeholder="Email" required>
          <input name="password" type="password" autocomplete="current-password" placeholder="Пароль" required>
        </div>
        <button class="submit-button" type="submit">Войти</button>
      </form>
      <p class="form-status" id="formStatus" aria-live="polite"></p>
    </section>
  </div>

  <script src="app.js"></script>
  <script>
    document.getElementById('respond')?.addEventListener('click', () => {
      const user = JSON.parse(sessionStorage.getItem('lgtuDemoUser_v3') || 'null');
      const status = document.getElementById('respondStatus');
      const phone = document.getElementById('authorPhone');
      if (!user) {
        status.textContent = 'Для отклика войдите или зарегистрируйтесь.';
        return;
      }
      if (phone) phone.textContent = 'Телефон автора: +7 900 123-45-67';
      status.textContent = 'Отклик сохранён.';
    });
  </script>
</body>
</html>
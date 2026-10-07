const products = [
  ["Дракон. Рейвен","3 590 ₽",0],
  ["Толстовка \"Распальцовка\"","4 900 ₽",1],
  ["Механические часы Победа - ИЛ 2.","12 000 ₽",2],
  ["iPhone 13 512GB","79 990 ₽",3],
  ["ТВ Тумба Дуро","67 850 ₽",4],
  ["Филадельфия манго","620 ₽",5],
  ["Свеча «Рорсот»","790 ₽",6],
  ["Ремешок для ключей Оранжко - рыжий...","1 590 ₽",7],
  ["Футболка «Это пройдет»","1 500 ₽",8],
  ["Таежная цветущая","700 ₽",9],
  ["Чехол для AirPods в цвете Lavande...","3 590 ₽",10],
  ["Футболка \"Тот, кому не нужно счастье\"...","1 400 ₽",11],
  ["Утка на велосипед в шлеме","690 ₽",12],
  ["Ремешок для AppleWatch из Novonappa...","7 990 ₽",13],
  ["Менажница \"Микки\" из кедра...","690 ₽",14]
];

const demoUser = {
  name: "Константин",
  email: "konstantin@example.com",
  phone: "+7 (999) 123-45-67",
  password: "Konstantin123"
};

const demoAd = {
  title: "Дракон. Рейвен",
  description: "Подходит для паспорта и автодокументов. Натуральная кожа и высокопрочный пластик. Изделие изготовлено из кожи сорта краст.",
  price: "3 590 ₽"
};

let shown = 10;

function render() {
  const root = document.getElementById('cards');
  if (!root) return;
  root.innerHTML = products.slice(0, shown).map((p, i) => `
    <article class="ad-card" data-product="${i}" tabindex="0" role="button" aria-label="${p[0]}, ${p[1]}">
      <img class="product-card-image" src="assets/generated_cards/card_${p[2]}.png" alt="${p[0]}">
    </article>
  `).join('');
  const more = document.getElementById('loadMore');
  if (more) more.style.display = shown < products.length ? 'block' : 'none';
}
function openModal(which) {
  const id = which === 'login' ? 'loginModal' : which === 'register' ? 'registerModal' : which;
  const el = document.getElementById(id);
  if (!el) return;
  closeModals();
  el.classList.add('open');
  el.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModals() {
  document.querySelectorAll('.modal').forEach(m => {
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
  });
  document.body.style.overflow = '';
}

function fillLogin(form) {
  if (!form) return;
  form.email.value = demoUser.email;
  form.password.value = demoUser.password;
}

function fillRegister(form) {
  if (!form) return;
  form.name.value = demoUser.name;
  form.email.value = demoUser.email;
  form.phone.value = demoUser.phone;
  form.password.value = demoUser.password;
  form.password2.value = demoUser.password;
  form.agree.checked = true;
}

function fillAd(form) {
  if (!form) return;
  form.title.value = demoAd.title;
  form.description.value = demoAd.description;
  form.price.value = demoAd.price;
  const preview = document.getElementById('adPreview');
  if (preview) preview.classList.add('filled');
}

function updateHeader() {
  const nav = document.getElementById('headerNav');
  if (!nav) return;
  if (localStorage.getItem('demoLogged_v4') === '1') {
    nav.innerHTML = `
      <span class="welcome">Добро пожаловать, Константин</span>
      <button class="exit-btn" type="button" aria-label="Выход">Выход</button>
    `;
  } else {
    nav.innerHTML = `
      <a href="#" data-open="register">Регистрация</a>
      <a href="#" data-open="login">Вход</a>
    `;
  }
}

function publishAd() {
  const form = document.getElementById('adForm');
  const error = document.getElementById('adError');
  if (!form) return;
  if (!form.title.value || !form.description.value || !form.price.value) {
    error.textContent = 'Заполните объявление.';
    fillAd(form);
    return;
  }
  error.textContent = '';
  closeModals();
  openModal('successModal');
}

document.addEventListener('click', (e) => {
  const open = e.target.closest('[data-open]');
  if (open) {
    e.preventDefault();
    openModal(open.dataset.open);
    return;
  }

  const sw = e.target.closest('[data-switch]');
  if (sw) {
    e.preventDefault();
    openModal(sw.dataset.switch);
    return;
  }

  if (e.target.matches('[data-close]') || e.target.classList.contains('modal')) {
    closeModals();
    return;
  }

  const card = e.target.closest('.ad-card');
  if (card) {
    // Детальная страница для демонстрации макета карточки.
    window.location.href = 'detail.html';
    return;
  }

  if (e.target.id === 'newAdBtn') {
    if (localStorage.getItem('demoLogged_v4') !== '1') {
      openModal('login');
    } else {
      openModal('adModal');
    }
    return;
  }

  if (e.target.closest('#adPreview')) {
    fillAd(document.getElementById('adForm'));
    return;
  }

  if (e.target.id === 'backToAds') {
    closeModals();
    return;
  }

  if (e.target.classList.contains('exit-btn')) {
    localStorage.removeItem('demoLogged_v4');
    updateHeader();
    return;
  }
});

document.addEventListener('focusin', (e) => {
  const form = e.target.closest('form');
  if (!form) return;
  if (form.id === 'loginForm') fillLogin(form);
  if (form.id === 'registerForm') fillRegister(form);
  if (form.id === 'adForm') fillAd(form);
});

document.addEventListener('submit', (e) => {
  if (e.target.id === 'loginForm') {
    e.preventDefault();
    fillLogin(e.target);
    localStorage.setItem('demoLogged_v4', '1');
    closeModals();
    updateHeader();
  }

  if (e.target.id === 'registerForm') {
    e.preventDefault();
    fillRegister(e.target);
    localStorage.setItem('demoLogged_v4', '1');
    closeModals();
    updateHeader();
  }

  if (e.target.id === 'adForm') {
    e.preventDefault();
    publishAd();
  }
});

const more = document.getElementById('loadMore');
if (more) {
  more.addEventListener('click', () => {
    shown = Math.min(shown + 5, products.length);
    render();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModals();
});

updateHeader();
render();

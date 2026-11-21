function getUser(){try{return JSON.parse(sessionStorage.getItem('lgtuDemoUser_v3')||'null')}catch{return null}}
function renderHeader(){
  const user=getUser();
  const state=document.getElementById('headerUserState');
  const actions=document.getElementById('headerAuthActions');
  const greeting=document.getElementById('headerGreeting');
  document.body.classList.toggle('logged-in',!!user);
  if(state){ state.hidden=!user; if(user&&greeting) greeting.textContent=user.name||'Константин'; }
  if(actions){ actions.style.display = user ? 'none' : 'flex'; }
}
renderHeader();

// УВЕДОМЛЕНИЕ О ПУБЛИКАЦИИ
if(new URLSearchParams(location.search).get('published')==='1'){
  const toast=document.createElement('div');
  toast.className='publish-success-toast';
  toast.setAttribute('role','status');
  toast.setAttribute('aria-live','polite');
  toast.innerHTML='<div class="publish-success-toast-icon" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M10 25l9 9L38 14" fill="none" stroke="white" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="publish-success-toast-text">Ваше объявление опубликовано</div>';
  document.body.appendChild(toast);
  history.replaceState(null,'',location.pathname+location.hash);
  
  // 1500 миллисекунд = 1,5 секунды
  setTimeout(()=>{toast.classList.add('is-hiding');setTimeout(()=>toast.remove(),120);},1500);
}

document.getElementById('logoutButton')?.addEventListener('click',()=>{sessionStorage.removeItem('lgtuDemoUser_v3');renderHeader();});

// Кнопка "Показать ещё"
const grid = document.getElementById('cardsGrid');
const moreBtn = document.getElementById('loadMore');
const loadStatus = document.getElementById('loadStatus');
let offset = grid ? grid.querySelectorAll('.ad-card').length : 0;

moreBtn?.addEventListener('click', async () => {
  if (!grid) return;
  moreBtn.disabled = true;
  if(loadStatus) loadStatus.textContent = 'Загрузка...';
  try {
    const res = await fetch(`api.php?offset=${offset}`);
    const html = await res.text();
    if (html.trim()) {
      grid.insertAdjacentHTML('beforeend', html);
      offset += 10;
      if(loadStatus) loadStatus.textContent = '';
    } else {
      if(loadStatus) loadStatus.textContent = 'Больше объявлений нет.';
      moreBtn.style.display = 'none';
    }
  } catch(e) {
    if(loadStatus) loadStatus.textContent = 'Ошибка загрузки.';
  } finally {
    moreBtn.disabled = false;
  }
});

// Модалки
const backdrop=document.getElementById('modalBackdrop'),
      registerForm=document.getElementById('registerForm'),
      loginForm=document.getElementById('loginForm'),
      formStatus=document.getElementById('formStatus');
const tabs=[...document.querySelectorAll('[data-tab]')];

function setTab(which){
  if(!registerForm||!loginForm)return;
  const isReg=which==='register';
  registerForm.hidden=!isReg;
  loginForm.hidden=isReg;
  tabs.forEach(t=>{
    const active=t.dataset.tab===which;
    t.classList.toggle('active',active);
    t.setAttribute('aria-selected',String(active));
  });
  const title=document.getElementById('modalTitle');
  if(title)title.textContent=isReg?'Регистрация':'Авторизация';
  if(formStatus)formStatus.textContent='';
}
function openModal(which){
  if(!backdrop)return;
  backdrop.hidden=false;
  setTab(which);
  document.body.style.overflow='hidden';
}
function closeModal(){
  if(!backdrop)return;
  backdrop.hidden=true;
  document.body.style.overflow='';
}
document.querySelectorAll('[data-open-modal]').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.openModal)));
tabs.forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
document.getElementById('closeModal')?.addEventListener('click',closeModal);
backdrop?.addEventListener('click',e=>{if(e.target===backdrop)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

function validPhone(value){const digits=String(value||'').replace(/\D/g,'');return digits.length>=10&&digits.length<=15&&/^\+?[0-9()\s-]+$/.test(String(value||''));}
function validateAccountForm(form){
  let ok=true;
  form.querySelectorAll('input:not([type=checkbox])').forEach(input=>{
    let valid=input.value.trim()!=='';
    if(input.type==='email')valid=valid&&/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
    if(input.name==='phone')valid=valid&&validPhone(input.value);
    if(input.name==='password')valid=valid&&input.value.length>=6;
    if(input.name==='name')valid=valid&&/^[А-Яа-яЁё\s-]+$/.test(input.value.trim());
    input.classList.toggle('field-error',!valid);
    if(!valid)ok=false;
  });
  if(form===registerForm){
    const pass=form.elements.namedItem('password'),confirm=form.elements.namedItem('confirmPassword'),consent=form.elements.namedItem('consent');
    if(pass&&confirm&&pass.value!==confirm.value){confirm.classList.add('field-error');ok=false;}
    if(consent&&!consent.checked){consent.classList.add('field-error');ok=false;}
  }
  return ok;
}
document.querySelectorAll('.account-form input').forEach(input=>input.addEventListener('input',()=>{
  const form=input.closest('.account-form');
  let valid=input.value.trim()!=='';
  if(input.type==='email')valid=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
  if(input.name==='phone')valid=validPhone(input.value);
  if(input.name==='password')valid=input.value.length>=6;
  if(input.name==='confirmPassword')valid=input.value===form.elements.namedItem('password')?.value;
  input.classList.toggle('field-error',!valid);
  if(input.name==='password'&&form===registerForm){
    const confirm=form.elements.namedItem('confirmPassword');
    if(confirm?.value)confirm.classList.toggle('field-error',confirm.value!==input.value);
  }
}));
registerForm?.addEventListener('submit',e=>{
  e.preventDefault();
  if(!validateAccountForm(registerForm))return;
  const d=new FormData(registerForm), pass=String(d.get('password')||'');
  if(/^\d+$/.test(pass)){formStatus.textContent='';registerForm.querySelector('[name=password]')?.classList.add('field-error');return;}
  const user={name:d.get('name')||'Константин',email:d.get('email'),phone:d.get('phone')};
  sessionStorage.setItem('lgtuDemoUser_v3',JSON.stringify(user));
  renderHeader();
  formStatus.textContent='Регистрация выполнена.';
  setTimeout(closeModal,600);
});
loginForm?.addEventListener('submit',e=>{
  e.preventDefault();
  if(!validateAccountForm(loginForm))return;
  const d=new FormData(loginForm), email=String(d.get('email')||'');
  const old=getUser();
  
  const name=old?.name||(email.toLowerCase()==='demo@lgtu.ru'?'Константин':(email.split('@')[0]||'Константин'));
  
  sessionStorage.setItem('lgtuDemoUser_v3',JSON.stringify({name,email,phone:old?.phone||'+7 900 123-45-67'}));
  renderHeader();
  formStatus.textContent='Вход выполнен.';
  setTimeout(closeModal,600);
});

const regName=registerForm?.querySelector('[name=name]');
regName?.addEventListener('focus',()=>{
  const values={name:'Константин',email:'konstantin@example.ru',phone:'+7 900 123-45-67',password:'Demo123',confirmPassword:'Demo123'};
  for(const [name,value] of Object.entries(values)){
    const input=registerForm.elements.namedItem(name);
    if(input&&!input.value)input.value=value;
  }
  const consent=registerForm.elements.namedItem('consent');
  if(consent)consent.checked=true;
},{once:true});
const loginEmail=loginForm?.querySelector('[name=email]');
loginEmail?.addEventListener('focus',()=>{
  const email=loginForm.elements.namedItem('email'), password=loginForm.elements.namedItem('password');
  if(email&&!email.value)email.value='demo@lgtu.ru';
  if(password&&!password.value)password.value='Demo123';
},{once:true});

const initialModal=new URLSearchParams(location.search).get('modal');
if(initialModal==='register'||initialModal==='login')openModal(initialModal);

document.querySelector('.add-link')?.addEventListener('click',event=>{
  if(!getUser()){
    event.preventDefault();
    sessionStorage.setItem('lgtuNextAfterAuth','add');
    openModal('login');
    if(formStatus)formStatus.textContent='Чтобы опубликовать объявление, сначала войдите в аккаунт.';
  }
});
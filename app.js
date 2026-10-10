const products = [
 {id:1,title:'Дракон. Рейвен',price:'3 590 ₽',numericPrice:3590,description:'',image:'assets/product-final-01.jpg'},
 {id:2,title:'Толстовка «Распальцовка»',price:'4 900 ₽',numericPrice:4900,description:'',image:'assets/product-final-02.jpg'},
 {id:3,title:'Механические часы Победа — ИЛ 2',price:'12 000 ₽',numericPrice:12000,description:'',image:'assets/product-final-03.jpg'},
 {id:4,title:'iPhone 13 512GB',price:'79 990 ₽',numericPrice:79990,description:'',image:'assets/product-final-04.jpg'},
 {id:5,title:'ТВ Тумба Дуро',price:'67 850 ₽',numericPrice:67850,description:'',image:'assets/product-final-05.jpg'},
 {id:6,title:'Филадельфия манго',price:'620 ₽',numericPrice:620,description:'',image:'assets/product-final-06.jpg'},
 {id:7,title:'Свеча «Попкорн»',price:'790 ₽',numericPrice:790,description:'',image:'assets/product-final-07.jpg'},
 {id:8,title:'Ремешок для ключей Орино — рыжий',price:'1 590 ₽',numericPrice:1590,description:'',image:'assets/product-final-08.jpg'},
 {id:9,title:'Футболка «Это продлится»',price:'1 500 ₽',numericPrice:1500,description:'',image:'assets/product-final-09.jpg'},
 {id:10,title:'Таёжная цветущая',price:'700 ₽',numericPrice:700,description:'',image:'assets/product-final-10.jpg'},
 {id:11,title:'Чехол для AirPods',price:'3 590 ₽',numericPrice:3590,description:'',image:'assets/product-final-11.jpg'},
 {id:12,title:'Футболка «Тот, кому не нужно счастье»',price:'1 400 ₽',numericPrice:1400,description:'',image:'assets/product-final-12.jpg'},
 {id:13,title:'Утка на велосипед в шлеме',price:'690 ₽',numericPrice:690,description:'',image:'assets/product-final-13.jpg'},
 {id:14,title:'Ремешок для Apple Watch',price:'7 990 ₽',numericPrice:7990,description:'',image:'assets/product-final-14.jpg'},
 {id:15,title:'Менажница «Микки» из кедра',price:'690 ₽',numericPrice:690,description:'',image:'assets/product-final-15.jpg'}
];
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

localStorage.removeItem('lgtuDemoUser_v3');
function getUser(){try{return JSON.parse(sessionStorage.getItem('lgtuDemoUser_v3')||'null')}catch{return null}}
function renderHeader(){
 const user=getUser(), state=document.getElementById('headerUserState'), greeting=document.getElementById('headerGreeting');
 document.body.classList.toggle('logged-in',!!user);
 if(state){state.hidden=!user;if(user&&greeting)greeting.textContent=`Здравствуйте, ${user.name||'Константин'}`;}
}
renderHeader();

if(new URLSearchParams(location.search).get('published')==='1'){
 const toast=document.createElement('div');
 toast.className='publish-success-toast';
 toast.setAttribute('role','status');
 toast.setAttribute('aria-live','polite');
 toast.innerHTML='<div class="publish-success-toast-icon" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M10 25l9 9L38 14" fill="none" stroke="white" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="publish-success-toast-text">Ваше объявление опубликовано</div>';
 document.body.appendChild(toast);
 history.replaceState(null,'',location.pathname+location.hash);
 setTimeout(()=>{toast.classList.add('is-hiding');setTimeout(()=>toast.remove(),120);},750);
}
document.getElementById('logoutButton')?.addEventListener('click',()=>{sessionStorage.removeItem('lgtuDemoUser_v3');renderHeader();});
const grid=document.getElementById('cardsGrid');
const more=document.getElementById('loadMore');
const loadStatus=document.getElementById('loadStatus');
let shown=0;
function savedAds(){try{return JSON.parse(localStorage.getItem('lgtuPublishedAds')||'[]')}catch{return []}}
const builtInByTitle=new Map(products.map(p=>[p.title.trim().toLocaleLowerCase('ru-RU'),p]));
function allAds(){const saved=savedAds().filter(ad=>{const base=builtInByTitle.get(String(ad.title||'').trim().toLocaleLowerCase('ru-RU'));const image=String(ad.image||'');/* Remove stale duplicate records from earlier versions that referenced missing image files. Keep genuinely uploaded images. */return !(base && !image.startsWith('data:'));}).sort((a,b)=>Number(b.id)-Number(a.id)).map(ad=>({...ad,id:ad.id||('saved-'+Date.now()),price:`${Number(ad.price).toLocaleString('ru-RU')} ₽`,image:ad.image||'assets/product-final-01.jpg',description:ad.description||''}));return [...saved,...products]}
function cardHtml(p){const fallback=builtInByTitle.get(String(p.title||'').trim().toLocaleLowerCase('ru-RU'))?.image||'assets/product-final-01.jpg';return `<a class="ad-card" href="detail.html?id=${encodeURIComponent(p.id)}"><img class="ad-card-image" src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" onerror="this.onerror=null;this.src='${fallback}'"><strong class="ad-card-price">${esc(p.price)}</strong><span class="ad-card-title">${esc(p.title)}</span></a>`}
function batchSize(){return window.innerWidth<=599?4:(window.innerWidth<=1024?6:10)}
function renderFirstBatch(){if(!grid)return;const all=allAds();shown=Math.min(batchSize(),all.length);grid.innerHTML=all.slice(0,shown).map(cardHtml).join('');}
function showMore(){if(!grid)return;const all=allAds();const next=Math.min(shown+batchSize(),all.length);if(next===shown){if(loadStatus)loadStatus.textContent='Больше объявлений пока нет.';return;}grid.insertAdjacentHTML('beforeend',all.slice(shown,next).map(cardHtml).join(''));shown=next;if(loadStatus)loadStatus.textContent='';}
if(grid){renderFirstBatch();window.addEventListener('resize',()=>{const oldCount=shown;renderFirstBatch();if(oldCount>shown){const all=allAds();grid.insertAdjacentHTML('beforeend',all.slice(shown,oldCount).map(cardHtml).join(''));shown=oldCount;}});}
more?.addEventListener('click',showMore);

const addListingLink=document.querySelector('.add-link');
addListingLink?.addEventListener('click',event=>{if(!getUser()){event.preventDefault();sessionStorage.setItem('lgtuNextAfterAuth','add');openModal('login');if(formStatus)formStatus.textContent='Чтобы опубликовать объявление, сначала войдите в аккаунт.';}});


const backdrop=document.getElementById('modalBackdrop'), registerForm=document.getElementById('registerForm'), loginForm=document.getElementById('loginForm'), formStatus=document.getElementById('formStatus');
const tabs=[...document.querySelectorAll('[data-tab]')];
function setTab(which){if(!registerForm||!loginForm)return;const isReg=which==='register';registerForm.hidden=!isReg;loginForm.hidden=isReg;tabs.forEach(t=>{const active=t.dataset.tab===which;t.classList.toggle('active',active);t.setAttribute('aria-selected',String(active));});const title=document.getElementById('modalTitle');if(title)title.textContent=isReg?'Регистрация':'Авторизация';if(formStatus)formStatus.textContent='';}
function openModal(which){if(!backdrop)return;backdrop.hidden=false;setTab(which);document.body.style.overflow='hidden';}
function closeModal(){if(!backdrop)return;backdrop.hidden=true;document.body.style.overflow='';}
document.querySelectorAll('[data-open-modal]').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.openModal)));
tabs.forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
document.getElementById('closeModal')?.addEventListener('click',closeModal);
backdrop?.addEventListener('click',e=>{if(e.target===backdrop)closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
registerForm?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(registerForm), pass=String(d.get('password')||'');if(pass!==String(d.get('confirmPassword')||'')){formStatus.textContent='Пароли не совпадают.';return;}if(pass.length<6||/^\d+$/.test(pass)){formStatus.textContent='Пароль должен содержать не менее 6 символов и не состоять только из цифр.';return;}if(!d.get('consent')){formStatus.textContent='Необходимо согласие на обработку персональных данных.';return;}const user={name:d.get('name')||'Константин',email:d.get('email'),phone:d.get('phone')};sessionStorage.setItem('lgtuDemoUser_v3',JSON.stringify(user));renderHeader();formStatus.textContent='Регистрация выполнена.';if(new URLSearchParams(location.search).get('next')==='add'||sessionStorage.getItem('lgtuNextAfterAuth')==='add'){sessionStorage.removeItem('lgtuNextAfterAuth');setTimeout(()=>location.href='add.html',250);}else setTimeout(closeModal,600);});
loginForm?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(loginForm),email=String(d.get('email')||'');if(!email||!d.get('password')){formStatus.textContent='Заполните все поля.';return;}const old=getUser();const name=old?.name||(email.toLowerCase()==='demo@lgtu.ru'?'Константин':(email.split('@')[0]||'Константин'));sessionStorage.setItem('lgtuDemoUser_v3',JSON.stringify({name,email,phone:old?.phone||'+7 900 123-45-67'}));renderHeader();formStatus.textContent='Вход выполнен.';if(new URLSearchParams(location.search).get('next')==='add'||sessionStorage.getItem('lgtuNextAfterAuth')==='add'){sessionStorage.removeItem('lgtuNextAfterAuth');setTimeout(()=>location.href='add.html',250);}else setTimeout(closeModal,600);});

const regName=registerForm?.querySelector('[name=name]');
regName?.addEventListener('focus',()=>{
 const values={name:'Константин',email:'konstantin@example.ru',phone:'+7 900 123-45-67',password:'Demo123',confirmPassword:'Demo123'};
 for(const [name,value] of Object.entries(values)){const input=registerForm.elements.namedItem(name);if(input&&!input.value)input.value=value;}
 const consent=registerForm.elements.namedItem('consent');if(consent)consent.checked=true;
},{once:true});
const loginEmail=loginForm?.querySelector('[name=email]');
loginEmail?.addEventListener('focus',()=>{
 const email=loginForm.elements.namedItem('email'),password=loginForm.elements.namedItem('password');
 if(email&&!email.value)email.value='demo@lgtu.ru';
 if(password&&!password.value)password.value='Demo123';
},{once:true});
const initialModal=new URLSearchParams(location.search).get('modal');if(initialModal==='register'||initialModal==='login')openModal(initialModal);

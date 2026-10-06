const ads = [
  {id:12,title:"Городской велосипед",price:"35 000 ₽",cat:"Спорт",type:"sport",img:"assets/product-1.svg"},
  {id:11,title:"Ноутбук для работы",price:"72 000 ₽",cat:"Техника",type:"tech",img:"assets/product-2.svg"},
  {id:10,title:"Диван в хорошем состоянии",price:"18 500 ₽",cat:"Дом",type:"home",img:"assets/product-3.svg"},
  {id:9,title:"Автомобиль Kia Rio",price:"1 250 000 ₽",cat:"Авто",type:"auto",img:"assets/product-4.svg"},
  {id:8,title:"Беспроводные наушники",price:"8 900 ₽",cat:"Техника",type:"tech",img:"assets/product-2.svg"},
  {id:7,title:"Письменный стол",price:"12 000 ₽",cat:"Дом",type:"home",img:"assets/product-3.svg"},
  {id:6,title:"Шоссейный велосипед",price:"54 000 ₽",cat:"Спорт",type:"sport",img:"assets/product-1.svg"},
  {id:5,title:"Toyota Corolla",price:"1 680 000 ₽",cat:"Авто",type:"auto",img:"assets/product-4.svg"},
  {id:4,title:"Монитор 27 дюймов",price:"21 000 ₽",cat:"Техника",type:"tech",img:"assets/product-2.svg"},
  {id:3,title:"Кресло для дома",price:"9 500 ₽",cat:"Дом",type:"home",img:"assets/product-3.svg"},
  {id:2,title:"Фитнес-трекер",price:"4 200 ₽",cat:"Спорт",type:"sport",img:"assets/product-1.svg"},
  {id:1,title:"Комплект шин",price:"28 000 ₽",cat:"Авто",type:"auto",img:"assets/product-4.svg"}
];

let shown = 8;

function renderAds(list=ads) {
  const wrap=document.querySelector("#cards");
  if(!wrap) return;
  const visible=list.slice(0,shown);
  wrap.innerHTML=visible.map(a=>`
    <article class="card">
      <a href="detail.html?id=${a.id}"><img class="card__image" src="${a.img}" alt="${a.title}"></a>
      <div class="card__body">
        <div class="card__meta">${a.cat}</div>
        <a class="card__title" href="detail.html?id=${a.id}">${a.title}</a>
        <div class="price">${a.price}</div>
      </div>
    </article>`).join("");
  const count=document.querySelector("#resultsCount");
  if(count) count.textContent=`Показано ${visible.length} из ${list.length}`;
  const more=document.querySelector("#loadMore");
  if(more) more.style.display=visible.length<list.length?"inline-flex":"none";
}
function filteredAds(){
  const q=(document.querySelector("#searchInput")?.value||"").trim().toLowerCase();
  const cat=document.querySelector("#categorySelect")?.value||"all";
  return ads.filter(a=>(cat==="all"||a.type===cat)&&(!q||a.title.toLowerCase().includes(q)||a.cat.toLowerCase().includes(q)));
}
document.addEventListener("DOMContentLoaded",()=>{
  renderAds();
  document.querySelector("#loadMore")?.addEventListener("click",()=>{shown+=4;renderAds(filteredAds())});
  document.querySelector("#searchButton")?.addEventListener("click",()=>{shown=8;renderAds(filteredAds())});
  document.querySelector("#searchInput")?.addEventListener("keydown",e=>{if(e.key==="Enter"){shown=8;renderAds(filteredAds())}});
  document.querySelectorAll("[data-modal]").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.modal)));
  document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",closeAll));
  document.querySelectorAll("[data-switch]").forEach(b=>b.addEventListener("click",()=>{closeAll();openModal(b.dataset.switch)}));
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAll()});

  const login=document.querySelector("#loginForm");
  login?.addEventListener("submit",e=>{
    e.preventDefault();
    if(!login.checkValidity()){login.reportValidity();return}
    console.log("Данные формы входа:",Object.fromEntries(new FormData(login)));
    alert("Демонстрация верстки: данные формы выведены в консоль.");
    closeAll();
  });
  const reg=document.querySelector("#registerForm");
  reg?.addEventListener("submit",e=>{
    e.preventDefault();
    const p=reg.querySelector('[name="password"]'), p2=reg.querySelector('[name="password2"]');
    const err=document.querySelector("#registerError");
    if(!reg.checkValidity()){reg.reportValidity();return}
    if(p && p2 && p.value!==p2.value){err.textContent="Пароли не совпадают.";return}
    if(p && /^\d+$/.test(p.value)){err.textContent="Пароль не может состоять только из цифр.";return}
    if(err) err.textContent="";
    console.log("Данные формы регистрации:",Object.fromEntries(new FormData(reg)));
    alert("Демонстрация верстки: данные формы выведены в консоль.");
    closeAll();
  });
  document.querySelector("#listingForm")?.addEventListener("submit",e=>{
    e.preventDefault();
    if(!e.currentTarget.checkValidity()){e.currentTarget.reportValidity();return}
    console.log("Данные объявления:",Object.fromEntries(new FormData(e.currentTarget)));
    alert("Демонстрационная форма: объявление готово к отправке на сервер.");
  });
});
function openModal(id){const m=document.getElementById(id);if(!m)return;m.classList.add("is-open");m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeAll(){document.querySelectorAll(".modal.is-open").forEach(m=>{m.classList.remove("is-open");m.setAttribute("aria-hidden","true")});document.body.style.overflow=""}

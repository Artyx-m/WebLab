const detailItems=[
['Дракон. Рейвен','3 590 ₽','Подходит для паспорта и автодокументов. Натуральная кожа и высокопрочный пластик.\n\nИзделие изготовлено из кожи сорта краст. Это кожа как она есть. Без покрытия и обработки, с естественным рисунком (мерея) или без него. Текстура чаще всего ярко выражена. Краст проходит барабанное крашение со специальным режимом, называемом сквозным прокрасом. Можно не бояться, что окрашенная лицевая сторона отслоится или потрескается. Поверхность может иметь мелкие дефекты небольшие отклонения в цвете по полотну кожи, точки, складки, шрамы.\n\nРучная работа. Точная копия невозможна!\n\nЦвет изделия в реальности может отличаться от цвета на фото. Это связано с обработкой фото и особенностями отображения цветов на разных экранах.\n\nБарельеф: Дракон\nЦвет кожи: Черный\nФормат: Обложка для документов','assets/product-final-01.jpg'],
['Толстовка «Распальцовка»','4 900 ₽','','assets/product-final-02.jpg'],
['Механические часы Победа — ИЛ 2','12 000 ₽','','assets/product-final-03.jpg'],
['iPhone 13 512GB','79 990 ₽','','assets/product-final-04.jpg'],
['ТВ Тумба Дуро','67 850 ₽','','assets/product-final-05.jpg'],
['Филадельфия манго','620 ₽','','assets/product-final-06.jpg'],
['Свеча «Попкорн»','790 ₽','','assets/product-final-07.jpg'],
['Ремешок для ключей Орино — рыжий','1 590 ₽','','assets/product-final-08.jpg'],
['Футболка «Это продлится»','1 500 ₽','','assets/product-final-09.jpg'],
['Таёжная цветущая','700 ₽','','assets/product-final-10.jpg'],
['Чехол для AirPods','3 590 ₽','','assets/product-final-11.jpg'],
['Футболка «Тот, кому не нужно счастье»','1 400 ₽','','assets/product-final-12.jpg'],
['Утка на велосипед в шлеме','690 ₽','','assets/product-final-13.jpg'],
['Ремешок для Apple Watch','7 990 ₽','','assets/product-final-14.jpg'],
['Менажница «Микки» из кедра','690 ₽','','assets/product-final-15.jpg']
];
const id=new URLSearchParams(location.search).get('id');
let p=detailItems[0];
try{const saved=JSON.parse(localStorage.getItem('lgtuPublishedAds')||'[]').find(ad=>String(ad.id)===String(id));if(saved)p=[saved.title,`${Number(saved.price).toLocaleString('ru-RU')} ₽`,saved.description||'',saved.image||'assets/product-final-01.jpg'];else if(id&&/^\d+$/.test(id)&&Number(id)>0&&Number(id)<=detailItems.length)p=detailItems[Number(id)-1];}catch{}
const wrap=document.getElementById('detail');
wrap.innerHTML=`<div class="detail-layout"><img class="detail-image" src="${p[3]}" alt="${p[0]}"><div><h1 class="subpage-title">${p[0]}</h1><p class="detail-price">${p[1]}</p>${p[2]?`<p class="detail-description">${p[2]}</p>`:''}<p id="authorPhone"></p><button class="submit-button" id="respond">Откликнуться на объявление</button><p class="form-status" id="respondStatus" aria-live="polite"></p></div></div>`;
const signedInUser=JSON.parse(sessionStorage.getItem('lgtuDemoUser_v3')||'null');
if(signedInUser)document.getElementById('authorPhone').textContent='Телефон автора: +7 900 123-45-67';
document.getElementById('respond').addEventListener('click',()=>{const user=JSON.parse(sessionStorage.getItem('lgtuDemoUser_v3')||'null');const status=document.getElementById('respondStatus');const phone=document.getElementById('authorPhone');if(!user){status.textContent='Для отклика войдите или зарегистрируйтесь.';return;}if(phone)phone.textContent='Телефон автора: +7 900 123-45-67';status.textContent='Отклик сохранён в демонстрационном режиме.';});

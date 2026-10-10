try { if (!sessionStorage.getItem('lgtuDemoUser_v3')) { location.replace('index.html?modal=login&next=add'); } } catch { location.replace('index.html?modal=login&next=add'); }
const addForm=document.getElementById('addForm');
const photoInput=document.getElementById('photo');
const photoPreview=document.getElementById('photoPreview');
const photoField=document.getElementById('photoField');
const titleInput=addForm?.elements.namedItem('title');
const priceInput=addForm?.elements.namedItem('price');
const descriptionInput=addForm?.elements.namedItem('description');
const publishButton=addForm?.querySelector('[type=submit]');
let chosenImage='assets/product-final-01.jpg';
function updatePublishState(){if(publishButton)publishButton.disabled=!(titleInput?.value.trim()&&priceInput?.value&&descriptionInput?.value.trim()&&chosenImage);}
function showDefaultListing(){
 if(!titleInput?.value.trim())titleInput.value='Дракон. Рейвен';
 if(!priceInput?.value)priceInput.value='3590';
 if(!descriptionInput?.value.trim())descriptionInput.value='Подходит для паспорта и автодокументов. Натуральная кожа и высокопрочный пластик.\n\nИзделие изготовлено из кожи сорта краст. Это кожа как она есть. Без покрытия и обработки, с естественным рисунком (мерея) или без него. Текстура чаще всего ярко выражена. Краст проходит барабанное крашение со специальным режимом, называемом сквозным прокрасом. Можно не бояться, что окрашенная лицевая сторона отслоится или потрескается. Поверхность может иметь мелкие дефекты небольшие отклонения в цвете по полотну кожи, точки, складки, шрамы.\n\nРучная работа. Точная копия невозможна!\n\nЦвет изделия в реальности может отличаться от цвета на фото. Это связано с обработкой фото и особенностями отображения цветов на разных экранах.\n\nБарельеф: Дракон\nЦвет кожи: Черный\nФормат: Обложка для документов';
 chosenImage='assets/product-final-01.jpg';
 photoPreview.src=chosenImage;
 photoField?.classList.add('has-photo');
 updatePublishState();
}
titleInput?.addEventListener('focus',showDefaultListing,{once:true});
for(const input of [titleInput,priceInput,descriptionInput])input?.addEventListener('input',updatePublishState);
photoInput?.addEventListener('change',()=>{const file=photoInput.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{chosenImage=String(reader.result);photoPreview.src=chosenImage;photoField?.classList.add('has-photo');updatePublishState();};reader.readAsDataURL(file);});
addForm?.addEventListener('submit',e=>{
 e.preventDefault();
 const d=new FormData(addForm);
 const key='lgtuPublishedAds';
 const ads=JSON.parse(localStorage.getItem(key)||'[]');
 ads.unshift({id:Date.now(),title:String(d.get('title')||''),price:String(d.get('price')||''),description:String(d.get('description')||''),image:chosenImage});
 localStorage.setItem(key,JSON.stringify(ads));
 
 location.href='index.html?published=1';
});

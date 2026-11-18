const gifts = [
 {id:1,name:"Розовая луна",emoji:"🌙",price:"⭐ 150",type:"popular",rarity:"Популярный",desc:"Нежный подарок с лунным сиянием. Отличный способ добавить немного магии в коллекцию."},
 {id:2,name:"Космический мишка",emoji:"🧸",price:"⭐ 250",type:"rare",rarity:"Редкий",desc:"Милый космический спутник для самой уютной коллекции."},
 {id:3,name:"Кристальное сердце",emoji:"💎",price:"⭐ 500",type:"rare",rarity:"Эпический",desc:"Сверкающий символ внимания и особенного момента."},
 {id:4,name:"Золотая звезда",emoji:"🌟",price:"⭐ 100",type:"popular",rarity:"Популярный",desc:"Маленькая звезда, которая добавит блеска любому профилю."},
 {id:5,name:"Весенний букет",emoji:"💐",price:"⭐ 180",type:"season",rarity:"Сезонный",desc:"Яркий сезонный подарок с весенним настроением."},
 {id:6,name:"Сладкая конфета",emoji:"🍬",price:"⭐ 75",type:"popular",rarity:"Обычный",desc:"Небольшой сладкий знак внимания."},
 {id:7,name:"Королевская корона",emoji:"👑",price:"⭐ 750",type:"rare",rarity:"Легендарный",desc:"Подарок для тех, кто любит выделяться."},
 {id:8,name:"Праздничный шар",emoji:"🎈",price:"⭐ 120",type:"season",rarity:"Сезонный",desc:"Пусть в коллекции всегда будет повод для праздника."}
];
const $=s=>document.querySelector(s);
let activeFilter="all", favorites=new Set(), selectedBadge="✦ Creator", avatarData=null;
const profile={name:"Giftly User",handle:"@giftly_user",bio:"",badge:"✦ Creator",avatar:"https://images.unsplash.com/photo-1535713875002-d1d0cf37718e?w=160&h=160&fit=crop&crop=faces"};
const tg=window.Telegram?.WebApp;
if(tg){tg.ready();tg.expand();if(tg.initDataUnsafe?.user){const u=tg.initDataUnsafe.user;profile.name=[u.first_name,u.last_name].filter(Boolean).join(" ")||profile.name;profile.handle=u.username?"@"+u.username:profile.handle;}}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300)}
function render(){
 const q=$("#search").value.toLowerCase();
 const list=gifts.filter(g=>(activeFilter==="all"||g.type===activeFilter)&&(g.name.toLowerCase().includes(q)||g.desc.toLowerCase().includes(q)));
 $("#giftGrid").innerHTML=list.length?list.map(g=>`<article class="gift-card" data-id="${g.id}"><button class="heart ${favorites.has(g.id)?"saved":""}" data-fav="${g.id}" aria-label="В избранное">${favorites.has(g.id)?"♥":"♡"}</button><div class="gift-visual"><span class="gift-emoji">${g.emoji}</span></div><h3>${g.name}</h3><div class="gift-sub">Цифровой подарок</div><div class="gift-foot"><span class="price">${g.price}</span><span class="rarity">${g.rarity}</span></div></article>`).join(""):`<p class="gift-sub">Ничего не найдено. Попробуй другой запрос.</p>`;
 $("#favCount").textContent=favorites.size;
}
function syncProfile(){ $("#miniName").textContent=profile.name;$("#miniHandle").textContent=profile.handle+" · профиль";$("#miniAvatar").src=profile.avatar;$("#avatarPreview").src=profile.avatar;const line=$("#miniName").parentElement;line.querySelector(".badge").textContent=profile.badge;line.querySelector(".badge").className="badge "+(profile.badge.includes("VIP")?"vip":profile.badge.includes("Verified")?"verified":"creator");}
function openModal(id){$("#"+id).classList.add("open")}
function closeModal(id){$("#"+id).classList.remove("open")}
$("#giftGrid").addEventListener("click",e=>{const fav=e.target.closest("[data-fav]");if(fav){const id=Number(fav.dataset.fav);favorites.has(id)?favorites.delete(id):favorites.add(id);render();return;}const card=e.target.closest("[data-id]");if(card){const g=gifts.find(x=>x.id===Number(card.dataset.id));$("#giftDetailContent").innerHTML=`<div class="detail-emoji">${g.emoji}</div><span class="eyebrow">${g.rarity.toUpperCase()}</span><h2>${g.name}</h2><p class="detail-copy">${g.desc}</p><p class="price">${g.price}</p><button class="primary-btn full" id="detailFav">♡ Добавить в избранное</button>`;$("#detailFav").onclick=()=>{favorites.add(g.id);render();closeModal("giftModal");toast("Добавлено в избранное");};openModal("giftModal");}});
$("#filters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;activeFilter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));render();});
$("#search").addEventListener("input",render);
$("#exploreBtn").onclick=()=>$("#catalog").scrollIntoView({behavior:"smooth"});
$("#showFavorites").onclick=()=>{activeFilter="all";$("#search").value="";document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter==="all"));render();$("#giftGrid").innerHTML=[...favorites].map(id=>gifts.find(g=>g.id===id)).filter(Boolean).map(g=>`<article class="gift-card"><div class="gift-visual"><span class="gift-emoji">${g.emoji}</span></div><h3>${g.name}</h3><div class="gift-foot"><span class="price">${g.price}</span><span class="rarity">В избранном</span></div></article>`).join("")||'<p class="gift-sub">Пока здесь пусто — нажми ♡ на понравившемся подарке.</p>';$("#catalog").scrollIntoView({behavior:"smooth"});};
function edit(){ $("#nameInput").value=profile.name;$("#handleInput").value=profile.handle;$("#bioInput").value=profile.bio;selectedBadge=profile.badge;document.querySelectorAll(".badge-option").forEach(b=>b.classList.toggle("selected",b.dataset.badge===selectedBadge));openModal("profileModal");}
$("#openProfile").onclick=edit;$("#editProfile").onclick=edit;
document.querySelectorAll(".badge-option").forEach(b=>b.onclick=()=>{selectedBadge=b.dataset.badge;document.querySelectorAll(".badge-option").forEach(x=>x.classList.toggle("selected",x===b));});
$("#avatarFile").onchange=e=>{const file=e.target.files[0];if(!file)return;if(file.size>2*1024*1024){toast("Выбери изображение до 2 МБ");return;}const reader=new FileReader();reader.onload=()=>{avatarData=reader.result;$("#avatarPreview").src=avatarData;};reader.readAsDataURL(file);};
$("#saveProfile").onclick=()=>{profile.name=$("#nameInput").value.trim()||"Giftly User";let h=$("#handleInput").value.trim()||"@giftly_user";profile.handle=h.startsWith("@")?h:"@"+h;profile.bio=$("#bioInput").value.trim();profile.badge=selectedBadge;if(avatarData)profile.avatar=avatarData;syncProfile();closeModal("profileModal");toast("Профиль обновлён!");};
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>closeModal(b.dataset.close));
document.querySelectorAll(".modal-backdrop").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("open");}));
$("#donateBtn").onclick=()=>{if(tg?.initData){toast("Платежи Stars подключим через бота");}else{toast("Открой Giftly в Telegram — здесь пока демо");}};
syncProfile();render();

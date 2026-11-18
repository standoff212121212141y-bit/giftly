const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

const dialog = document.getElementById('giftDialog');
const title = document.getElementById('dialogTitle');
const toast = document.getElementById('toast');
let currentGift = '';
const favorites = new Set();

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}

document.querySelectorAll('.details').forEach(button => {
  button.addEventListener('click', () => {
    currentGift = button.dataset.gift;
    title.textContent = currentGift;
    document.getElementById('favoriteBtn').textContent =
      favorites.has(currentGift) ? '♥ В избранном' : '♡ В избранное';
    dialog.showModal();
  });
});

document.getElementById('closeDialog').addEventListener('click', () => dialog.close());
document.getElementById('favoriteBtn').addEventListener('click', () => {
  if (favorites.has(currentGift)) {
    favorites.delete(currentGift);
    showToast('Удалено из избранного');
  } else {
    favorites.add(currentGift);
    showToast('Добавлено в избранное');
  }
  document.getElementById('favoriteBtn').textContent =
    favorites.has(currentGift) ? '♥ В избранном' : '♡ В избранное';
});

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(item => item.classList.remove('active'));
    chip.classList.add('active');
    const category = chip.dataset.category;
    document.querySelectorAll('.gift-card').forEach(card => {
      card.hidden = category !== 'Все' && card.dataset.category !== category;
    });
  });
});

document.getElementById('filterBtn').addEventListener('click', () => showToast('Фильтры появятся в следующей версии'));
document.getElementById('favNav').addEventListener('click', () => showToast(`В избранном: ${favorites.size}`));
document.getElementById('profileNav').addEventListener('click', () => showToast('Профиль появится в следующей версии'));

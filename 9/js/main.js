import {photoGallery, renderThumbnails, thumbnail} from './thumbnails.js';
import {openBigPicture} from './full-picture.js';

renderThumbnails();

thumbnail.addEventListener('click', (evt) => {
  const parentPicture = evt.target.closest('.picture'); // Один обработчик на родительском контейнере .pictures (делегирование)
  if (!parentPicture) {
    return; // Защита от кликов по пустому месту между миниатюрами
  }
  evt.preventDefault(); // Предотвращаем переход по ссылке, иначе получим http://localhost:3000/#
  const clickedPhotoId = Number(parentPicture.dataset.id); // При клике обработчик находит элемент <li class="picture"> через closest('.picture') и читает его dataset.id
  const targetThumb = photoGallery.find((photo) => photo.id === clickedPhotoId); // По data-id находим миниатюру в массиве photoGallery
  if (!targetThumb) {
    return; // Защита от случая, если targetThumb === undefined
  }
  openBigPicture(targetThumb); // Передаём данные в функцию открытия модального окна
});

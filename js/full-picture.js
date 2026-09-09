import { isEscapeKey } from './utils.js';

const COUNT_STEP = 5;
let shownCommentsCount = 0;
let currentPhoto = null; // Текущий объект фотографии, открытой в полноразмерном окне - он нужен, чтобы обработчик кнопки "Загрузить ещё" знал, из какого массива брать следующие комментарии
const bigPictureContent = document.querySelector('.big-picture'); // всё содержимое окна с картинкой
const bigPictureCloseElement = bigPictureContent.querySelector('.big-picture__cancel'); // кнопка закрытия окна
const bigPicture = bigPictureContent.querySelector('img'); // сама полноразмерная картинка в DOM
const bigPictureLikes = bigPictureContent.querySelector('.likes-count');
const bigPictureCommentsTotal = bigPictureContent.querySelector('.social__comment-total-count');
const bigPictureCommentsShown = bigPictureContent.querySelector('.social__comment-shown-count');
const bigPictureDescription = bigPictureContent.querySelector('.social__caption');
const commentsLoader = bigPictureContent.querySelector('.comments-loader'); // текст "Загрузить ещё"
const bigPictureComments = bigPictureContent.querySelector('.social__comments'); // список комментариев
const commentTemplate = bigPictureComments.querySelector('.social__comment');

// Функция возвращает часть массива комментариев от индекса from до to (не включая to)
const getCommentsSlice = (comments, from, to) => comments.slice(from, to);

const renderPhotoComments = (comments) => { // comments — массив комментариев текущего фото (передаётся из showComments или onCommentsLoaderClick)
  const fragment = document.createDocumentFragment();
  comments.forEach(({ avatar, name, message }) => { // деструктуризация массива comments
    const comment = commentTemplate.cloneNode(true);
    comment.querySelector('.social__picture').src = avatar;
    comment.querySelector('.social__picture').alt = name;
    comment.querySelector('.social__text').textContent = message;
    fragment.appendChild(comment);
  });
  bigPictureComments.appendChild(fragment);
};

const renderBigPicture = (photo) => {
  bigPicture.src = photo.url;
  bigPictureLikes.textContent = photo.likes;
  bigPictureDescription.textContent = photo.description;
};

const showComments = (photo) => {
  bigPictureComments.innerHTML = '';
  currentPhoto = photo;
  const totalCount = photo.comments.length;
  const initialCount = Math.min(COUNT_STEP, totalCount);
  renderPhotoComments(getCommentsSlice(photo.comments, 0, initialCount));
  shownCommentsCount = initialCount;
  bigPictureCommentsTotal.textContent = totalCount;
  bigPictureCommentsShown.textContent = initialCount;
  if (initialCount >= totalCount) { // Учитывает оба случая: totalCount <=5 и totalCount >=30
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const openBigPicture = (photo) => {
  document.body.classList.add('modal-open');
  bigPictureContent.classList.remove('hidden');
  document.addEventListener('keydown', onBigPictureKeydown);
  renderBigPicture(photo);
  showComments(photo);
};

const closeBigPicture = () => {
  bigPictureContent.classList.add('hidden');
  document.removeEventListener('keydown', onBigPictureKeydown);
  document.body.classList.remove('modal-open');
  shownCommentsCount = 0;
};

function onBigPictureKeydown (evt) { // Объявлена декларативно, иначе возникала бы ошибка "функция вызвана до её объявления"
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
}

const onCommentsLoaderClick = () => { // Обработчик кнопки "Загрузить ещё"
  if (!currentPhoto) {
    return; // Если currentPhoto не установлена (окно закрыто или ошибка) - выходим из обработчика, чтобы избежать ошибки
  }
  const total = currentPhoto.comments.length;
  const newCount = Math.min(shownCommentsCount + COUNT_STEP, total);
  if (shownCommentsCount < newCount) {
    renderPhotoComments(getCommentsSlice(currentPhoto.comments, shownCommentsCount, newCount));
    shownCommentsCount = newCount;
    bigPictureCommentsShown.textContent = newCount;
    if (newCount >= total) { // Учитывает оба случая: total <=5 и total >=30
      commentsLoader.classList.add('hidden');
    }
  }
};

const onBigPictureCloseClick = () => closeBigPicture();

commentsLoader.addEventListener('click', onCommentsLoaderClick);

bigPictureCloseElement.addEventListener('click', onBigPictureCloseClick);

export { openBigPicture };

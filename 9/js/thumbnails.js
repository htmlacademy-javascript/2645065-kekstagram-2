import {createPhotosGallery} from './data.js';

const thumbnail = document.querySelector('.pictures');
const thumbnailTemplate = document.querySelector('#picture').content.querySelector('.picture');
const photoGallery = createPhotosGallery();

const createThumbnail = (photo) => {
  const photoThumbnail = thumbnailTemplate.cloneNode(true);
  const pictureImage = photoThumbnail.querySelector('.picture__img');
  pictureImage.src = photo.url;
  pictureImage.alt = photo.description;
  photoThumbnail.querySelector('.picture__likes').textContent = photo.likes;
  photoThumbnail.querySelector('.picture__comments').textContent = photo.comments.length;
  photoThumbnail.dataset.id = photo.id; //Это добавляет атрибут data-id к самому элементу <li class="picture">
  return photoThumbnail;
};

const renderThumbnails = () => {
  const thumbnailFragment = document.createDocumentFragment();
  photoGallery.forEach((photo) => {
    const thumbnailElement = createThumbnail(photo);
    thumbnailFragment.appendChild(thumbnailElement);
  });
  thumbnail.appendChild(thumbnailFragment);
};

export {photoGallery, renderThumbnails, thumbnail};

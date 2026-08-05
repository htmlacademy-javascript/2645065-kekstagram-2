import {createPhotosGallery} from './data.js';

const thumbnail = document.querySelector('.pictures');
const thumbnailTemplate = document.querySelector('#picture').content.querySelector('.picture');
const photoGallery = createPhotosGallery();
const thumbnailFragment = document.createDocumentFragment();

const createThumbnail = (photo) => {
  const thumbnailElement = thumbnailTemplate.cloneNode(true);
  const pictureImage = thumbnailElement.querySelector('.picture__img');
  pictureImage.src = photo.url;
  pictureImage.alt = photo.description;
  thumbnailElement.querySelector('.picture__likes').textContent = photo.likes;
  thumbnailElement.querySelector('.picture__comments').textContent = photo.comments.length;
  thumbnailFragment.appendChild(thumbnailElement);
};

photoGallery.forEach((photo) => {
  createThumbnail(photo);
});
thumbnail.appendChild(thumbnailFragment);

import { isEscapeKey, stopEscapePropagation } from './utils.js';
import { resetFilters } from './image-preview.js';
import { blockSubmitButton, onFormSubmit } from './send-form.js';

const HASHTAG_REGEX = /^#[a-zA-Zа-яё0-9]{1,19}$/i;
const MAX_HASHTAGS = 5;
const MIN_SYMBOLS = 2;
const MAX_SYMBOLS = 20;
const MAX_LENGTH = 140;
const RULES = [
  {
    check: (hastags) => hastags.some((hashtag) => hashtag.slice(1).includes('#')),
    message: 'Хэштеги разделяются пробелами'
  },
  {
    check: (hastags) => hastags.some((hashtag) => hashtag.length > MAX_SYMBOLS),
    message: `Максимальная длина хэштега - ${MAX_SYMBOLS} символов, включая решётку`
  },
  {
    check: (hastags) => hastags.some((hashtag) => !HASHTAG_REGEX.test(hashtag) && hashtag.length >= MIN_SYMBOLS), // каждый хэштег проверяется на то, соответствует ли он регулярному выражению + Проверка на минимальную длину - когда набрана ещё только решётка, то не показывается сообщение о буквах и цифрах
    message: 'Хэштег должен содержать только буквы и цифры'
  },
  {
    check: (hastags) => hastags.some((hashtag) => hashtag === '#'),
    message: 'Хэштег не может состоять только из одной решётки'
  },
  {
    check: (hastags) => hastags.some((hashtag) => hashtag[0] !== '#'),
    message: 'Хэштег должен начинаться с символа #'
  },
  {
    check: (hastags) => {
      const lowerCaseHashtags = hastags.map((hashtag) => hashtag.toLowerCase()); // На случай, если один и тот же хэштег встречается в разных регистрах
      const newLowerCaseHashtags = new Set(lowerCaseHashtags); // Убираем повторяющиеся хэштеги (если они есть)
      return lowerCaseHashtags.length !== newLowerCaseHashtags.size;
    },
    message: 'Хэштеги не должны повторяться'
  },
  {
    check: (hastags) => hastags.length > MAX_HASHTAGS,
    message: `Нельзя указывать больше ${MAX_HASHTAGS} ${getHashtagForm(MAX_HASHTAGS)}`
  }
];

const imageUploadForm = document.querySelector('.img-upload__form'); // форма для загрузки и редактирования изображения
const fileInput = document.querySelector('.img-upload__input'); // кнопка для загрузки файла
const imageEditOverlay = document.querySelector('.img-upload__overlay'); // окно редактирования изображения, появляется после выбора файла
const fileCloseElement = imageUploadForm.querySelector('.img-upload__cancel'); // кнопка закрытия формы редактирования изображения
const hashtags = document.querySelector('.text__hashtags');
const description = document.querySelector('.text__description');
let errorMessage = '';

const pristine = new Pristine(imageUploadForm, {
  classTo: 'img-upload__field-wrapper', // Элемент, на который будут добавляться классы
  errorTextClass: 'img-upload__field-wrapper--error', // Класс с текстом ошибки
  errorTextParent: 'img-upload__field-wrapper', // Элемент, куда будет выводиться текст с ошибкой
});

// Функция очищает все следы ошибок валидации Pristine и сбрасывает состояние Pristine
const clearValidationErrors = () => {
  document.querySelectorAll('.pristine-error').forEach((element) => element.remove());
  document.querySelectorAll('.img-upload__field-wrapper--error').forEach((element) => element.classList.remove('img-upload__field-wrapper--error'));
  pristine.reset();
};

const openFileToEdit = () => {
  if (fileInput.value) {
    clearValidationErrors();
    document.body.classList.add('modal-open');
    imageEditOverlay.classList.remove('hidden');
  }
  document.addEventListener('keydown', onFormKeydown);
};

const closeFileToEdit = () => {
  resetFilters();
  imageEditOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onFormKeydown);
  document.body.classList.remove('modal-open');
  imageUploadForm.reset();
  clearValidationErrors();
};

function onFormKeydown (evt) { // Объявлена декларативно, иначе возникала бы ошибка "функция вызвана до её объявления"
  if (isEscapeKey(evt)) {
    const message = document.querySelector('.error');
    if (message) {
      return; // Не закрываем оверлей
    }
    evt.preventDefault();
    closeFileToEdit();
  }
}

// Функция склоняет слово "хэштег"; объявлена декларативно, так как использована в массиве RULES, а массив RULES должен быть в начале модуля, до функций
function getHashtagForm(number) {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;
  return (lastDigit === 1 && lastTwoDigits !== 11) ? 'хэштега' : 'хэштегов';
}

// Функция возвращает текущее сообщение об ошибке
const getErrorMessage = () => errorMessage;

const validateHashtags = (value) => {
  errorMessage = '';
  const trimmedValue = value.trim();
  if (trimmedValue === '') {
    return true; // если массив пуст, ошибок нет
  }
  const hastags = trimmedValue.split(/\s+/); // Получаем из строки с хэштегами массив
  return RULES.every((rule) => {
    const isError = rule.check(hastags);
    if(isError) {
      errorMessage = rule.message;
    }
    return !isError;
  });
};

const validateDescription = (value) => value.length <= MAX_LENGTH;

const onFormCancel = () => closeFileToEdit();

const onHashtagsKeydown = (evt) => stopEscapePropagation(evt);
const onDescriptionKeydown = (evt) => stopEscapePropagation(evt);

fileCloseElement.addEventListener('click', onFormCancel);

hashtags.addEventListener('keydown', onHashtagsKeydown);

description.addEventListener('keydown', onDescriptionKeydown);

pristine.addValidator(hashtags, validateHashtags, getErrorMessage);
pristine.addValidator(description, validateDescription, `Длина описания - не более ${MAX_LENGTH} символов`);

imageUploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (!isValid) {
    return;
  }
  blockSubmitButton();
  const formData = new FormData(evt.target);
  onFormSubmit(formData, closeFileToEdit);
});

export { fileInput, openFileToEdit };

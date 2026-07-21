// Функция генерирует значения, которые могут повторяться.
function getRandomInteger(min, max) {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}

// Функция генерирует уникальные значения.
function getRandomUniqueInteger(min, max) {
  const previousValues = [];
  return function () {
    let currentValue = getRandomInteger(min, max);
    if (previousValues.length >= (max - min + 1)) {
      return null;
    }
    while (previousValues.includes(currentValue)) {
      currentValue = getRandomInteger(min, max);
    }
    previousValues.push(currentValue);
    return currentValue;
  };
}

// Функция получает случайный элемент массива.
function getRandomArrayElement(elements) {
  return elements[getRandomInteger(0, elements.length - 1)];
}

export {getRandomInteger, getRandomUniqueInteger, getRandomArrayElement};

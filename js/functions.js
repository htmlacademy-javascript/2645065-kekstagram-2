function checkStringLength(string, maxStringLength) {
  return (string.length <= maxStringLength);
}

function isPalindrome(string) {
  const normalizedString = (string.replaceAll(' ', '')).toLowerCase();
  let reversedString = '';
  for (let i = normalizedString.length - 1; i >= 0; i--) {
    reversedString += normalizedString[i];
  }
  return (reversedString === normalizedString);
}

function getNumberFromString(inputString) {
  const string = inputString.toString();
  let digits = '';
  for (let i = 0; i < string.length; i++) {
    const parsedChar = parseInt(string[i], 10);
    if (!Number.isNaN(parsedChar)) {
      digits += parsedChar;
    }
  }
  return(parseInt(digits, 10));
}

checkStringLength('infinity', 10);
isPalindrome('потоп');
getNumberFromString('covid-19');

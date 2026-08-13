const checkStringLength = (string, maxStringLength) => string.length <= maxStringLength;

const isPalindrome = (string) => {
  const normalizedString = (string.replaceAll(' ', '')).toLowerCase();
  let reversedString = '';
  for (let i = normalizedString.length - 1; i >= 0; i--) {
    reversedString += normalizedString[i];
  }
  return reversedString === normalizedString;
};

const getNumberFromString = (inputString) => {
  const string = inputString.toString();
  let digits = '';
  for (let i = 0; i < string.length; i++) {
    const parsedChar = parseInt(string[i], 10);
    if (!Number.isNaN(parsedChar)) {
      digits += parsedChar;
    }
  }
  return parseInt(digits, 10);
};

/* Функция, которая принимает время начала и конца рабочего дня, а также время старта и продолжительность встречи в минутах. Возвращает true, если встреча не выходит за рамки рабочего дня, и false, если выходит. */

const scheduleData = {
  startOfDay: '8:00',
  endOfDay: '17:30',
  startOfMeeting: '08:00',
  durationofMeeting: 900
};

const calculateMinutes = (time = '00:00') => {
  const parts = time.split(':');
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  const totalMinutes = 60 * hours + minutes;
  return totalMinutes;
};

const isMeetingTimeValid = (scheduleCheck) => {
  const dayStart = calculateMinutes(scheduleCheck.startOfDay);
  const dayEnd = calculateMinutes(scheduleCheck.endOfDay);
  const meetingStart = calculateMinutes(scheduleCheck.startOfMeeting);
  const meetingDuration = scheduleCheck.durationofMeeting;
  return meetingStart - dayStart >= 0 && dayEnd - dayStart - meetingDuration >= 0 && dayEnd - meetingStart - meetingDuration >= 0;
};

checkStringLength('infinity', 10);
isPalindrome('потоп');
getNumberFromString('covid-19');
isMeetingTimeValid(scheduleData);

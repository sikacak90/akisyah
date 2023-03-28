const EVENT_TYPES = [
  'JOIN',
  'GIFT',
  'LIKE',
  'SHARE',
  'FOLLOW',
  'SUBSCRIBE',
  'COMMENT',
];

// Last 6 characters of the ID
const URL_ID_LENGTH = -6;

const MIN_PASSWORD_LENGTH = 6;

const JWT_COOKIE_NAME = 'token';
const JWT_EXP_TIME = '1h';
const JWT_REMEMBER_ME_EXP_TIME = '2d';

module.exports = {
  EVENT_TYPES,
  MIN_PASSWORD_LENGTH,
  JWT_COOKIE_NAME,
  URL_ID_LENGTH,
  JWT_EXP_TIME,
  JWT_REMEMBER_ME_EXP_TIME,
};

const userNameCheck = (username) => {
  if (
    (username.length >= 6 &&
      username.length <= 15 &&
      /[A-Z]/.test(username) &&
      /[a-z]/.test(username)) ||
    /\d/.test(username)
  ) {
    return true;
  } else {
    return false;
  }
};

const passwordCheck = (password) => {
  if (
    password.length >= 8 &&
    password.length <= 25 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[\W_]/.test(password)
  ) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  userNameCheck,
  passwordCheck,
};

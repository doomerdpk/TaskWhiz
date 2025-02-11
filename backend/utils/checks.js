function userNameCheck(username) {
  if (username.length >= 6 && username.length <= 10) {
    return true;
  } else {
    return false;
  }
}

function passwordCheck(password) {
  if (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  ) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  userNameCheck,
  passwordCheck,
};

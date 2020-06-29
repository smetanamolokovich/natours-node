/* eslint-disable */
import '@babel/polyfill';
import 'regenerator-runtime/runtime';

import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { displayMap } from './mapbox';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const updateUserDataForm = document.querySelector('.form-user-data');
const updateUserPasswordForm = document.querySelector(
  '.form-user-settings'
);
const logoutBtn = document.querySelector('.nav__el--logout');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);

  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (updateUserDataForm) {
  updateUserDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.btn--save-data').innerHTML =
      'Updating...';
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    await updateSettings({ name, email }, 'data');

    document.querySelector('.btn--save-data').innerHTML =
      'Data saved';
  });
}

if (updateUserPasswordForm) {
  updateUserPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').innerHTML =
      'Updating...';

    const passwordCurrent = document.getElementById(
      'password-current'
    ).value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById(
      'password-confirm'
    ).value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').innerHTML =
      'Password saved';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

/* eslint-disable */
import '@babel/polyfill';
import 'regenerator-runtime/runtime';

import axios from 'axios';
import { showAlert } from './alerts';

export const updateUserData = async (name, email) => {
  try {
    const res = await axios.patch(
      `http://localhost:3000/api/v1/users/update-me`,
      {
        name,
        email,
      }
    );

    if (res.data.status === 'success') {
      showAlert('success', 'Updated successfully!');
      // window.setTimeout(() => {
      //   location.assign('/me');
      // }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

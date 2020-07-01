/* eslint-disable */

import axios from 'axios';
import showAlerts from './alerts';
const stripe = Stripe(
  'pk_test_51GzzA0AeYeY839yXBwYa4aGq9iVfsw9xWan7dfLwhwoY1kTdMXZgFKSX7V8kQ6F3teZD2BYfUBoGJJ2OJSsgzLuT00kFiQwcXy'
);

export const bookTour = async (tourId) => {
  try {
    // Get checkout session from API
    const session = await axios(
      `http://localhost:3000/api/v1/booking/checkout-session/${tourId}`
    );

    // Create checkout form + charge creadit card
    console.log(session);
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlerts('error', err.message);
  }
};

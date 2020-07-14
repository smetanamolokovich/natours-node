# Natours Application

Built using modern technologies: node.js, express, mongoDB, mongoose, pug and etc. 😁

**Todos**: 

 - **API:**
	- Implement restriction that users can only review a tour **that they gave actually booked**;
	- Implement nested **booking** routes: /tours/:id/bookings and /users/:id/bookings;
	- **Improve tour dates:** add a participants and a soldOut field to each date. A date then becomes like an instace of the tour. Then, when a user books, they need to select one of the dates. A new booking will increase the number of participants in the date, until it is booked out (participants > maxGroupSize). So, when a user wants to book, you need to check if tour on the selected date is still available;
	- Implement **advanced authentication features**: confirm user email, keep users logged in with refresh tokens, two-factor authentication, etc.
 - **Web**
	 - ~~Implement a **sign up form**, similar to the login form;~~
	 - On the tour detail page, if a user has taken a tour, allow then **add a review directly on the website**. Implement a form for this;
	 - **Hide the entire booking section** on the tour detail page if current user has already booked the tour (also prevent duplocate bookings on the model);
	 - Implement **"like tour" functionality**, with favourite tour page;
	 -  On the user account page, implement the **"My Reviews"** page, where all review are displayed, and user can edit them. 

    

Natours App URL: [https://natours-aitu.herokuapp.com](https://natours-aitu.herokuapp.com)

API documentation: [https://documenter.getpostman.com/view/9469835/T17AiVaN?version=latest](https://documenter.getpostman.com/view/9469835/T17AiVaN?version=latest)

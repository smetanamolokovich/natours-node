const app = require('./app');

// START SERVER
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Running server on port ${port}...`);
});

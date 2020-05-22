const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const DB = process.env.DB_HOST.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to DB...'));

const app = require('./app');

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Running server on port ${port}...`);
});

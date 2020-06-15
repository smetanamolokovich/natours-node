const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
// const Tour = require('../../model/tourModel');
// const Review = require('../../model/reviewModel');
const User = require('../../model/userModel');

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

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);

const importData = async () => {
  try {
    await User.create(users);
    console.log('Data successfully imported');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

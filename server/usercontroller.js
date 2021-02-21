const User = require('./usermodel');
const passport = require('passport');
const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = {
  login: (req, res) => {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.json({
          status: false,
          message: 'Invalid email Id or password'
        });
      } else {
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          } else {
            return res.json({
              user: user,
              message: 'Login successful',
              status: true
            });
          }
        });
      }
    })(req, res);
  },

  getLoggedinUser: async (req, res) => {
    if (req.user) {
      const user = await User.findById(req.user._id);
      console.log("Getting user details...");
      res.json({
        status: true,
        user,
      });
    } else {
      console.log("USer not logged in...");
      res.json({
        status: false,
        message: "User not logged in",
      });
    }
  },

  getAllUsers: (req, res) => {
    User.find({})
      .then((users) => {
        console.log('Getting users...');
        res.json({ message: 'Fetched User', status: true, users });
      })
      .catch((err) => {
        console.log('API error:', err);
        res.json({ message: err.message, status: false, err });
      });
  },

  createUser: async (req, res) => {
    const user = req.body;
    const docs = await User.find({ email: user.email }).countDocuments().exec();
    if (docs > 0) {
      console.log('User creation aborted');
      res.json({
        status: false,
        message: 'Sorry, Email associated with another existing User'
      });
    } else {
      bcrypt.hash(user.password, saltRounds).then((hashedPassword) => {
        user.password = hashedPassword;
        const newUser = new User(user);
        newUser
          .save()
          .then((user) =>
            res.json({ message: 'Created new user', status: true, user })
          )
          .catch((err) => {
            console.log('API error:', err);
            res.json({ message: err.message, status: false, err });
          });
      });
    }
  },

  getSpecificUser: (req, res) => {
    const userId = req.params.userId;
    User.find({ _id: userId })
      .then((user) => {
        console.log('Getting user with ID', userId);
        res.json({ message: 'Fetched user details', status: true, user });
      })
      .catch((err) => {
        console.log('API error:', err);
        res.json({ message: err.message, status: false, err });
      });
  },

  editUser: (req, res) => {
    const userId = req.params.userId;
    const updateData = req.body;
    User.findById(userId)
      .then((user) => {
        console.log('user', user);
        for (const property in updateData) {
          if (user[property]) {
            if (property != '_id') {
              user[property] = updateData[property];
            } else {
              res.json({
                message: '_id property cannot is not allowed for editing'
              });
            }
          } else {
            res.json({ message: 'No such property in user' });
          }
        }
        console.log(`Editing user with Id ${userId}`);
        res.json({
          message: 'Successfully Edited user',
          status: true,
          user
        });
      })
      .catch((err) => {
        console.log('API error:', err);
        res.json({ message: err.message, status: false, err });
      });
  }
};

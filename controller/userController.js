const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const session = require("express-session");
// New User Route
router.get("/new", (req, res) => {
  res.render("users/new.ejs", { currentUser: req.session.currentUser });
});

// Create User Route
router.post("/", (req, res) => {
  // overwrite the user password with the hashed password, then pass that in to our database
  req.body.password = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  );
  User.create(req.body, (err, createdUser) => {
    console.log("user is created", createdUser);
    res.redirect("/");
  });
});

// Login Route
router.get("/login", (req, res) => {
  res.render("auth/login", { currentUser: req.session.currentUser });
});

// Login Route
router.post("/login", async (req, res) => {
  console.log("hello");
  let userToLogin = await User.findOne({ username: req.body.username });
  if (userToLogin) {
    bcrypt.compare(req.body.password, userToLogin.password, (err, result) => {
      if (result) {
        req.session.userId = userToLogin._id;
        req.session.username = userToLogin.username;

        res.redirect("/users");
      } else {
        res.send("wrong password");
      }
    });
  }
});

router.get("/signup", (req, res) => {
  res.render("auth/signup", { currentUser: req.session.currentUser });
});
// ADD post route to create a new user
router.post("/signup", async (req, res) => {
  if (req.body.username !== req.body.password) {
    let plainTextPassword = req.body.password;
    bcrypt.hash(plainTextPassword, 10, async (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        const newUser = new User({
          username: req.body.username,
          password: hash,
        });
        let gi = await newUser.save();
        if (!gi.error) {
          if (err) {
            console.log(err);
          } else {
            console.log("user is created");
            res.redirect("/");
          }
        }
      }
    });
  }
});

// Get route to User's page

router.get("/users", (req, res) => {
  User.find().then((users) => {
    res.render("users/index.ejs", {
      users: users,
    });
  });
});

// Edit Route
router.get("/:id/edit", (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    res.render("users/edit.ejs", {
      user: foundUser,
      currentUser: req.session.currentUser,
    });
  });
});

// Update Route
router.put("/:id", async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updateUser) {
      return res.status(404).send("User not found");
    }

    res.redirect(`/users`);
  } catch (err) {
    console.error("Error in updating user", error);
    res.status(500).json({ message: "Error in updating user", error: error });
  }
});
// Update Route

// router.get("/:id", (req, res) => {
//   User.findById(req.params.id, (err, foundUser) => {
//     res.render("users/", {

router.put("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, email, firstName, lastName, age } = req.body;
  // find the user in the database
  const user = users.find((user) => user.id === userId);

  if (!user) {
    await user.save();
    return res.status(404).send("User not found");
  }

  // update the user object with new data from req.body
  user.username = name || user.username;
  user.email = email || user.email;

  // return updated user
  res.status(200).send(user);
});

// Delete Route
router.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);

  const user = users.find((user) => user.id === userId);

  if (user !== -1) {
    users.splice(user, 1);
    res.redirect("/users");
  } else {
    res.status(404).send("User not found");
  }
});

// Logout Route
router.delete("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;

const express = require("express");

const db = require("../data/helpers/userDb");

const router = express.Router();

function allCAPS(req, res, next) {
  const { name } = req.body;
  req.body.name = name.toUpperCase();
  next();
}

router.post("/", allCAPS, (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({
      errorMessage: "User must have a name."
    });
    return;
  }
  db.insert({
    name
  })
    .then(response => {
      res.status(201).json(response);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the user to the database"
      });
      return;
    });
});

router.get("/", (req, res) => {
  db.get()
    .then(users => {
      res.json({ users });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "User list could not be retrieved."
      });
      return;
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.getById(id)
    .then(user => {
      if (user.length === 0) {
        res.status(404).json({
          message: "That user does not exist."
        });
        return;
      }
      res.json({ user });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "User could not be retrived"
      });
      return;
    });
});

router.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  db.getUserPosts(id)
    .then(user => {
      if (user.length === 0) {
        res.status(404).json({
          message: "That user does not exist."
        });
        return;
      }
      res.json({ user });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "User posts could not be retrived"
      });
      return;
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(response => {
      if (response === 0) {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
        return;
      }
      res.json({ success: `user ${id} removed.` });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The user could not be removed"
      });
      return;
    });
});

router.put("/:id", allCAPS, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    res.status(400).json({
      errorMessage: "Name is required to modify username"
    });
    return;
  }
  db.update(id, { name })
    .then(response => {
      if (response == 0) {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
        return;
      }
      db.getById(id)
        .then(user => {
          if (user.length === 0) {
            res.status(404).json({
              errorMessage: "The name with the specified ID does not exist."
            });
            return;
          }
          res.json(user);
        })
        .catch(error => {
          console.log(error);
          res
            .status(500)
            .jason({ error: "The user information could not be modified." });
        });
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The user information could not be modified." });
      return;
    });
});

module.exports = router;

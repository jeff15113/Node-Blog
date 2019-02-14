const express = require("express");

const db = require("../data/helpers/postDb");
const db2 = require("../data/helpers/userDb.js");

const router = express.Router();

router.post("/", (req, res) => {
  const { text, user_id } = req.body;
  if (!text) {
    res.status(400).json({
      errorMessage: "Please provide text for the post."
    });
    return;
  }
  if (!user_id) {
    res.status(400).json({
      errorMessage: "User id not provided. Post can not be accepted."
    });
    return;
  }
  db2
    .getById(user_id)
    .then(user => {
      if (!user) {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
        return;
      }
      db.insert({
        text,
        user_id
      })
        .then(response => {
          res.status(201).json(response);
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
            error: "There was an error while saving the post to the database"
          });
          return;
        });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The posts information could not be retrieved."
      });
      return;
    });
});

router.get("/", (req, res) => {
  db.get()
    .then(posts => {
      res.json({ posts });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The posts information could not be retrieved."
      });
      return;
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.getById(id)
    .then(posts => {
      if (posts.length === 0) {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
        return;
      }
      res.json({ posts });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The posts information could not be retrieved."
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
          message: "The post with the specified ID does not exist."
        });
        return;
      }
      res.json({ success: `post ${id} removed.` });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The post could not be removed"
      });
      return;
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { text, user_id } = req.body;
  if (!text || !user_id) {
    res.status(400).json({
      errorMessage: "Please provide text and user ID for the post."
    });
    return;
  }
  db.update(id, { text, user_id })
    .then(response => {
      if (response == 0) {
        res.status(404).json({
          message: "The post with the specified ID does not exist."
        });
        return;
      }
      db.getById(id)
        .then(post => {
          if (post.length === 0) {
            res.status(404).json({
              errorMessage: "The post with the specified ID does not exist."
            });
            return;
          }
          res.json(post);
        })
        .catch(error => {
          console.log(error);
          res
            .status(500)
            .jason({ error: "The post information could not be modified." });
        });
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
      return;
    });
});

module.exports = router;

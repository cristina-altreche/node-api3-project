const express = require("express");
const Users = require("./userDb");
const Posts = require("../posts/postDb");
const router = express.Router();

router.post("/", (req, res) => {
  // do your magic!
});

router.post("/:id/posts", (req, res) => {
  // do your magic!
});

router.get("/", (req, res) => {
  // do your magic!
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", (req, res) => {
  // do your magic!
});

router.delete("/:id", (req, res) => {
  // do your magic!
});

router.put("/:id", (req, res) => {
  // do your magic!
});

////CUSTOM MIDDLEWARE. TO BE USED IN ROUTES
//// 2. validateUserId
function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then((data) => {
      //if id param doesn't match user id
      if (!data) {
        res.status(400).json({ message: "invalid user id" });
        //else if valid store that user obj as req.user
      } else {
        req.user = data;
      }
      next();
    })
    .catch((data) => res.status(500).json({ error: "Something went wrong" }));
  ///IN Postman run ----  GET localhost:4000/api/users/1
}

function validateUser(req, res, next) {
  if(!req.body) {
    res.status(400).json({message: "missing user data"})
  } else if (!req.body.name) {
    res.status(400).json({message: "missing required name field"})
  } else {
    Users.insert(req.body)
    .then(data => {
      req.body = data;
      next()
    })
    .catch(data => {
      res.status(500).json({error: "Something went wrong."})
    })
  }
}

function validatePost(req, res, next) {
  if(!req.body) {
    res.status(400).json({message: "missing post data"})
  } else if (!req.body.text) {
    res.status(400).json({message: "missing required text field"})
  } else {
    Posts.insert({...req.body, user_id: req.params.id})
    .then(data => {
      req.post = data
      next()
    })
    .catch(data => {
      console.log(data)
      res.status(500).json({error: "Something went wrong."})
    })
  }
}

module.exports = router;

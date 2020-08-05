const express = require("express");
const Users = require("./userDb");
const Posts = require("../posts/postDb");
const router = express.Router();

router.post("/", validateUser, (req, res) => {
  ////This will create a new post. Using validateUser will below will throw error if missing body.
  res.status(201).json(req.body);
});

router.post("/:id/posts", validatePost, (req, res) => {
  res.status(201).json(req.body)
});

router.get("/", (req, res) => {
  Users.get().then((data) => {
    ////If no users throw 404
    if (data.length === 0) {
      res.status(404).json({ message: "There were no users to be found." });
    }
    ////else send list of users.
    else {
      res.status(200).json(data);
    }
  });
});

router.get("/:id", validateUserId, (req, res) => {
  //// Will return a user with specified id
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res) => {
  Users.getUserPosts(req.user.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((data) => {
      res.status(500).json({ error: "Something went wrong" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.user.id)
  .then(data => {
    if(data.length === 0) {
      res.status(404).json({ message: "User does not exist"})
    } else {
      res.status(200).json("User has been deleted")
    }
  })
  .catch(data => {
    res.status(500).json({error:"Something went wrong."})
  })
});

router.put("/:id",validateUserId, (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    Users.update(req.user.id, req.body)
      .then(data => {
        Users.getById(req.params.id)
          .then(user => {
            res.status(200).json(user);
          })
      })
      .catch(data => {
        res.status(500).json({ error: "Something went wrong." });
      })
  }
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
  if (!req.body) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    Users.insert(req.body)
      .then((data) => {
        req.body = data;
        next();
      })
      .catch((data) => {
        res.status(500).json({ error: "Something went wrong." });
      });
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    Posts.insert({ ...req.body, user_id: req.params.id })
      .then((data) => {
        req.post = data;
        next();
      })
      .catch((data) => {
        console.log(data);
        res.status(500).json({ error: "Something went wrong." });
      });
  }
}

module.exports = router;

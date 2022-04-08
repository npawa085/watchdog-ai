const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersController.getUsers);

router.post("/add", usersController.add);
// router.post("/add", [check("username").not().isEmpty()], usersController.add);

router.post("/detect", usersController.detect);

router.get("/status", usersController.status);
    
module.exports = router;

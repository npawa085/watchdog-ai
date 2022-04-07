const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersController.getUsers);

router.post("/add", [check("name").not().isEmpty()], usersController.add);

//router.post("/testing", usersController.addParams)
    
module.exports = router;

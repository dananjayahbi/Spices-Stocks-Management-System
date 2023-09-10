const router = require("express").Router();
const { protect } = require("../middleware/authorization");

const {
    registerUser,
    login,
    getUser,
    getAllUsers,
    getNewToken,
    updateUser,
    deleteUser,
} = require("../controllers/usersController");


//REGISTER USER
router.post("/register", registerUser);

//LOGIN USER
router.post("/login", login);

//GET USER
router.get("/getUser",protect, getUser);

// GET ALL USERS
router.get("/getAllUsers", getAllUsers);

//UPDATE USER
router.put("/updateUser/:id", updateUser);

//DELETE USER
router.delete("/deleteUser/:id", deleteUser);

//GET NEW TOKEN
router.post("/token/:id", getNewToken);

module.exports = router;
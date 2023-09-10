const router = require("express").Router();

const {
    addRole,
    getAllRoles,
    updateRole,
    deleteRole,
    getRole
} = require("../controllers/rolesController");


//ADD NEW ROLE
router.post("/addRole", addRole);

//GET ALL ROLES
router.get("/getAllRoles", getAllRoles);

//GET ROLE
router.get("/getRole/:id", getRole);

//UPDATE ROLE
router.put("/updateRole/:id", updateRole);

//DELETE ROLE
router.delete("/deleteRole/:id", deleteRole);


module.exports = router;
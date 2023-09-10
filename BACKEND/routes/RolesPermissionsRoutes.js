const router = require("express").Router();

const {
    getPageAccessForRole,
    getAllPagePermissionsForRole
} = require("../controllers/rolesPermissionsController");

//GET ROLE PERMISSIONS FOR A SPECIFIC PAGE
router.post("/getPageAccessForRole", getPageAccessForRole);

//GET ALL ROLE PAGE PERMISSIONS
router.post("/getAllPagePermissionsForRole", getAllPagePermissionsForRole);



module.exports = router;
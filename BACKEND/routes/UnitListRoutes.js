const router = require("express").Router();

const {
    addUnit,
    getAllUnits,
    getUnit,
    updateUnit,
    deleteUnit
} = require("../controllers/unitListController");

//ADD NEW UNIT
router.post("/addUnit", addUnit);

//GET ALL UNITS
router.get("/getAllUnits", getAllUnits);

//GET UNIT
router.get("/getUnit/:id", getUnit);

//UPDATE UNIT
router.put("/updateUnit/:id", updateUnit);

//DELETE UNIT
router.delete("/deleteUnit/:id", deleteUnit);

module.exports = router;
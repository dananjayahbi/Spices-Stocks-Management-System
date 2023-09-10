const router = require("express").Router();

const {
    addtax,
    getAllTaxes,
    getTax,
    updateTax,
    deleteTax
} = require("../controllers/taxListController");

//ADD NEW TAX
router.post("/addTax", addtax);

//GET ALL TAXES
router.get("/getAllTaxes", getAllTaxes);

//GET TAX
router.get("/getTax/:id", getTax);

//UPDATE TAX
router.put("/updateTax/:id", updateTax);

//DELETE TAX
router.delete("/deleteTax/:id", deleteTax);

module.exports = router;
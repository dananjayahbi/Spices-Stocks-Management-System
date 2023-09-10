const router = require("express").Router();

const {
    addCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/productCategoryController");

//ADD NEW CATEGORY
router.post("/addProductCategory", addCategory);

//GET ALL CATEGORIES
router.get("/getAllCategories", getAllCategories);

//GET CATEGORY
router.get("/getCategory/:id", getCategory);

//UPDATE CATEGORY
router.put("/updateCategory/:id", updateCategory);

//DELETE CATEGORY
router.delete("/deleteCategory/:id", deleteCategory);

module.exports = router;
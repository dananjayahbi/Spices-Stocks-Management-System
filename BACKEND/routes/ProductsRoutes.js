const router = require("express").Router();

const {
    addProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productsController");

//ADD NEW PRODUCT
router.post("/addProduct", addProduct);

//GET ALL PRODUCTS
router.get("/getAllProducts", getAllProducts);

//GET PRODUCT
router.get("/getProduct/:id", getProduct);

//UPDATE PRODUCT
router.put("/updateProduct/:id", updateProduct);

//DELETE PRODUCT
router.delete("/deleteProduct/:id", deleteProduct);

module.exports = router;
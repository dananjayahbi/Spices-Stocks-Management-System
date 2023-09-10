const Products = require("../models/Products.model");

//Add Product
const addProduct = async (req, res) => {
    const {
        productName, 
        productCategory,
        wholeSalePrice,
        salePrice,
        stocks,
        description,
    } = req.body;

    // Check if user with the same username or email already exists
    const existingProduct = await Products.findOne({
        $or: [{ productName: productName }],
    });
    if (existingProduct) {
        return res
        .status(400)
        .json({ error: "A product with the same product name already exists" });
    }

    const product = await Products.create({
        productName, 
        productCategory,
        wholeSalePrice,
        salePrice,
        stocks,
        description,
    });

    if (product) {
        res.status(200);
        res.json("product added");
    } else{
        res.status(400);
        res.json("Adding product failed");
    }
};

//Get All Products
const getAllProducts = async (req, res) => {
    const abc = await Products.find()
      .then((products) => {
        res.json(products);
      })
      .catch((e) => {
        console.log(e);
      });
};

//Get a Product
const getProduct = async (req, res) => {
    try {
      const productObject = await Products.findById(req.params.id);
  
      if (!productObject) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      const {
        _id,
        productName, 
        productCategory,
        wholeSalePrice,
        salePrice,
        stocks,
        description,
      } = productObject;
  
      res.status(200).json({
        _id,
        productName, 
        productCategory,
        wholeSalePrice,
        salePrice,
        stocks,
        description,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

//Update Product
const updateProduct = async (req, res) => {
    try {
      const { 
        productName, 
        productCategory,
        wholeSalePrice,
        salePrice,
        stocks,
        description,
      } = req.body;
  
      let updateData = {
        productName, 
        productCategory,
        wholeSalePrice,
        salePrice,
        stocks,
        description,
      };
  
      // Updating
      const update = await Products.findByIdAndUpdate(req.params.id, updateData);
  
      if (update) {
        res.status(200).json({
          data: 'Product updated successfully',
          status: true,
        });
      } else {
        res.status(401).json({
          errorMessage: 'Failed to edit the Product!',
          status: false,
        });
      }
      
    } catch (error) {
      res.status(401).json({
        errorMessage: 'Something went wrong!\n' + error,
        status: false,
      });
    }
};

//Delete Product
const deleteProduct = async (req, res) => {
    try {
      const deleted = await Products.findByIdAndDelete(req.params.id);
  
      if (deleted) {
        res.status(200).json({
          data: "Product Deleted",
          status: true,
        });
      } else {
        res.status(401).json({
          errrorMessage: "Failed to delete the Product!",
          status: false,
        });
      }
    } catch (error) {
      res.status(401).json({
        errorMessage: "Something went wrong!\n" + error,
        status: false,
      });
    }
};


//Export
module.exports = {
    addProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct
}
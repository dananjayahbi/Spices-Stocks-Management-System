const ProductCategory = require("../models/ProductCategory.model");

//Add Category
const addCategory = async (req, res) => {
    const {
        categoryName, 
        description
    } = req.body;

    // Check if user with the same username or email already exists
    const existingCategory = await ProductCategory.findOne({
        $or: [{ categoryName: categoryName }],
    });
    if (existingCategory) {
        return res
        .status(400)
        .json({ error: "A product with the same product name already exists" });
    }

    const category = await ProductCategory.create({
        categoryName,
        description,
    });

    if (category) {
        res.status(200);
        res.json("product added");
    } else{
        res.status(400);
        res.json("Adding product failed");
    }
};

//Get All Categories
const getAllCategories = async (req, res) => {
    const abc = await ProductCategory.find()
      .then((categories) => {
        res.json(categories);
      })
      .catch((e) => {
        console.log(e);
      });
};

//Get a Category
const getCategory = async (req, res) => {
    try {
      const categoryObject = await ProductCategory.findById(req.params.id);
  
      if (!categoryObject) {
        return res.status(404).json({ error: 'Category not found' });
      }
  
      const {
        _id,
        categoryName,
        description,
      } = categoryObject;
  
      res.status(200).json({
        _id,
        categoryName,
        description,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

//Update Category
const updateCategory = async (req, res) => {
    try {
      const { 
        categoryName,
        description,
      } = req.body;
  
      let updateData = {
        categoryName,
        description,
      };
  
      // Updating
      const update = await ProductCategory.findByIdAndUpdate(req.params.id, updateData);
  
      if (update) {
        res.status(200).json({
          data: 'Category updated successfully',
          status: true,
        });
      } else {
        res.status(401).json({
          errorMessage: 'Failed to edit the Category!',
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

//Delete Category
const deleteCategory = async (req, res) => {
    try {
      const deleted = await ProductCategory.findByIdAndDelete(req.params.id);
  
      if (deleted) {
        res.status(200).json({
          data: "Category Deleted",
          status: true,
        });
      } else {
        res.status(401).json({
          errrorMessage: "Failed to delete the Category!",
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
    addCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory
}
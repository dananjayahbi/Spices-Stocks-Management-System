const TaxList = require("../models/TaxList.model");

//Add Tax
const addtax = async (req, res) => {
    const {
        taxName, 
        percentage
    } = req.body;

    // Check if tax with the same taxName already exists
    const existingTax = await TaxList.findOne({
        $or: [{ taxName: taxName }],
    });
    if (existingTax) {
        return res
        .status(400)
        .json({ error: "A Tax with the same name already exists" });
    }

    const tax = await TaxList.create({
        taxName,
        percentage,
    });

    if (tax) {
        res.status(200);
        res.json("Tax added");
    } else{
        res.status(400);
        res.json("Adding Tax failed");
    }
};

//Get All Taxes
const getAllTaxes = async (req, res) => {
    const abc = await TaxList.find()
      .then((taxes) => {
        res.json(taxes);
      })
      .catch((e) => {
        console.log(e);
      });
};

//Get a Tax
const getTax = async (req, res) => {
    try {
      const taxObject = await TaxList.findById(req.params.id);
  
      if (!taxObject) {
        return res.status(404).json({ error: 'Tax not found' });
      }
  
      const {
        _id,
        taxName,
        percentage,
      } = taxObject;
  
      res.status(200).json({
        _id,
        taxName,
        percentage,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

//Update Tax
const updateTax = async (req, res) => {
    try {
      const { 
        taxName,
        percentage,
      } = req.body;
  
      let updateData = {
        taxName,
        percentage,
      };
  
      // Updating
      const update = await TaxList.findByIdAndUpdate(req.params.id, updateData);
  
      if (update) {
        res.status(200).json({
          data: 'Tax updated successfully',
          status: true,
        });
      } else {
        res.status(401).json({
          errorMessage: 'Failed to edit the Tax!',
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

//Delete Tax
const deleteTax = async (req, res) => {
    try {
      const deleted = await TaxList.findByIdAndDelete(req.params.id);
  
      if (deleted) {
        res.status(200).json({
          data: "Tax Deleted",
          status: true,
        });
      } else {
        res.status(401).json({
          errrorMessage: "Failed to delete the Tax!",
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
    addtax,
    getAllTaxes,
    getTax,
    updateTax,
    deleteTax
}
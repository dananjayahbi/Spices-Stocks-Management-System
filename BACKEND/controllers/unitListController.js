const Units = require("../models/UnitList.model");

//Add Unit
const addUnit = async (req, res) => {
    const {
        unitName, 
        description
    } = req.body;

    // Check if brand with the same brandName already exists
    const existingUnit = await Units.findOne({
        $or: [{ unitName: unitName }],
    });
    if (existingUnit) {
        return res
        .status(400)
        .json({ error: "A unit with the same name already exists" });
    }

    const unit = await Units.create({
        unitName,
        description,
    });

    if (unit) {
        res.status(200);
        res.json("Unit added");
    } else{
        res.status(400);
        res.json("Adding Unit failed");
    }
};

//Get All Units
const getAllUnits = async (req, res) => {
    const abc = await Units.find()
      .then((units) => {
        res.json(units);
      })
      .catch((e) => {
        console.log(e);
      });
};

//Get a Unit
const getUnit = async (req, res) => {
    try {
      const unitObject = await Units.findById(req.params.id);
  
      if (!unitObject) {
        return res.status(404).json({ error: 'Unit not found' });
      }
  
      const {
        _id,
        unitName,
        description,
      } = unitObject;
  
      res.status(200).json({
        _id,
        unitName,
        description,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

//Update Unit
const updateUnit = async (req, res) => {
    try {
      const { 
        unitName,
        description,
      } = req.body;
  
      let updateData = {
        unitName,
        description,
      };
  
      // Updating
      const update = await Units.findByIdAndUpdate(req.params.id, updateData);
  
      if (update) {
        res.status(200).json({
          data: 'Unit updated successfully',
          status: true,
        });
      } else {
        res.status(401).json({
          errorMessage: 'Failed to edit the Unit!',
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

//Delete Unit
const deleteUnit = async (req, res) => {
    try {
      const deleted = await Units.findByIdAndDelete(req.params.id);
  
      if (deleted) {
        res.status(200).json({
          data: "Unit Deleted",
          status: true,
        });
      } else {
        res.status(401).json({
          errrorMessage: "Failed to delete the Unit!",
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
    addUnit,
    getAllUnits,
    getUnit,
    updateUnit,
    deleteUnit
}
const Roles = require("../models/Roles.model"); // Make sure to provide the correct path to your model

// Add Role
const addRole = async (req, res) => {
  try {
    const { role, description, permissions, status } = req.body;

    // Transform permissions array from frontend data
    const pageNames = [
      "POS", 
      "Sales List", 
      "Sales Return List",
      "Buyers List",
      "Import Buyers",
      "Purchase List",
      "Purchase Return List",
      "Suppliers List",
      "Import Suppliers",
      "Products List",
      "Products Categories List",
      "Print Labels",
      "Import Products",
      "Expenses List",
      "Profit & Loss Report",
      "Purchase Report",
      "Purchase Retuen Report",
      "Purchase Payments Report",
      "Item Sales Report",
      "Item Purchase Report",
      "Sales Report",
      "Sales Return Report",
      "Sales Payments Report",
      "Stock Report",
      "Expenses Report",
      "Users List",
      "Roles List",
      "Send SMS",
      "SMS Templates",
      "SMS API",
      "Company Profile",
      "Site Settings",
      "Tax List",
      "Units List",
      "Payment Types List",
      "Change Password",
      "Database Backup"
    ]; // Replace with actual page names
    const transformedPermissions = pageNames.map((pageName) => ({
      page: pageName,
      access: permissions.includes(pageName),
    }));

    // Check if the same role exists
    const roleExists = await Roles.findOne({ role });
    if (roleExists) {
      res.status(401).json({
        errorMessage: "Role already exists! Please enter another one.",
        status: false,
      });
    } else {
      const Role = await Roles.create({
        role,
        description,
        permissions: transformedPermissions,
        status,
      });
      if (Role) {
        res.status(200).json({
          data: "Role entered successfully",
          status: true,
        });
      } else {
        res.status(401).json({
          errorMessage: "Failed to enter the Role!",
          status: false,
        });
      }
    }
  } catch (e) {
    res.status(401).json({
      errorMessage: "Something went wrong!\n" + e,
      status: false,
    });
  }
};

//Get All Roles
const getAllRoles = async (req, res) => {
  const abc = await Roles.find()
    .then((roles) => {
      res.json(roles);
    })
    .catch((e) => {
      console.log(e);
    });
};

//Get a Role
const getRole = async (req, res) => {
  try {
    const roleObject = await Roles.findById(req.params.id);

    if (!roleObject) {
      return res.status(404).json({ error: 'Role not found' });
    }

    const {
      _id,
      role,
      description,
      permissions,
      status
    } = roleObject;

    res.status(200).json({
      _id,
      role,
      description,
      permissions,
      status
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


//Update Role
const updateRole = async (req, res) => {
  try {
    const { 
      role,
      description,
      permissions,
      status
    } = req.body;

    let updateData = {
      role,
      description,
      permissions,
      status
    };

    // Updating
    const update = await Roles.findByIdAndUpdate(req.params.id, updateData);

    if (update) {
      res.status(200).json({
        data: 'Role updated successfully',
        status: true,
      });
    } else {
      res.status(401).json({
        errorMessage: 'Failed to edit the Role!',
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

//Delete Role
const deleteRole = async (req, res) => {
  try {
    const deleted = await Roles.findByIdAndDelete(req.params.id);

    if (deleted) {
      res.status(200).json({
        data: "Role Deleted",
        status: true,
      });
    } else {
      res.status(401).json({
        errrorMessage: "Failed to delete the Role!",
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


module.exports = {
  addRole,
  getAllRoles,
  updateRole,
  deleteRole,
  getRole
};

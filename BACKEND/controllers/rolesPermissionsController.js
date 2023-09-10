const Roles = require("../models/Roles.model"); // Make sure to provide the correct path to your model

// Function to find and send the access value for a specific page in a role
const getPageAccessForRole = async (req, res) => {
  try {
    const { roleName, pageName } = req.body;

    // Find the role in the database
    const role = await Roles.findOne({ role: roleName });

    if (role) {
      // Find the permission for the specified page in the role's permissions array
      const pagePermission = role.permissions.find(
        (permission) => permission.page === pageName
      );

      if (pagePermission) {
        res.status(200).json({
          roleName: role.role,
          pageName: pagePermission.page,
          access: pagePermission.access,
        });
      } else {
        // Handle case when page permission is not found
        res.status(200).json({
          roleName: role.role,
          pageName: pageName,
          access: false,
        });
      }
    } else {
      res.status(404).json({
        errorMessage: `Role '${roleName}' not found.`,
      });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: "Something went wrong!\n" + error,
    });
  }
};




// Function to fetch all page permissions for a specific role
const getAllPagePermissionsForRole = async (req, res) => {
  try {
    const { roleName } = req.body;

    // Find the role in the database
    const role = await Roles.findOne({ role: roleName });

    if (role) {
      res.status(200).json({
        roleName: role.role,
        pagePermissions: role.permissions,
      });
    } else {
      res.status(404).json({
        errorMessage: `Role '${roleName}' not found.`,
      });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: "Something went wrong!\n" + error,
    });
  }
};

module.exports = {
  getPageAccessForRole,
  getAllPagePermissionsForRole
};
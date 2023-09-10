const Users = require("../models/Users.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Register user
const registerUser = async (req, res) => {
    const {
      username,
      mobile,
      email,
      role,
      password,
      status,
    } = req.body;
  
    // Check if user with the same username or email already exists
    const existingUser = await Users.findOne({
      $or: [{ username: username }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "A user with the same username already exists" });
    }
  
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);
  
    // Add user
    const user = await Users.create({
        username,
        mobile,
        email,
        role,
        password: hashedPwd,
        status,
    });
  
    if (user) {
      res.status(201);
      res.json("User added");
    } else {
      res.status(400);
      res.json("Registration failed");
    }
  };

//Login User
const login = async (req, res) => {
    try {
    if (req.body && req.body.username && req.body.password) {
        const user = await Users.findOne({ username: req.body.username });
        if (user) {
        if (await bcrypt.compareSync(req.body.password, user.password)) {
            //generate jwt token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
            });

            res.status(200).json(token);
        } else {
            res.status(401).json({
            errorMessage: "Incorrect Password!",
            status: false,
            });
        }
        } else {
        res.status(401).json({
            errorMessage: "User not registered!",
            status: false,
        });
        }
    } else {
        res.status(401).json({
        errorMessage: "Please fill out the form!",
        status: false,
        });
    }
    } catch (e) {
    res.status(401).json({
        errorMessage: "Something went wrong!\n" + e,
        status: false,
    });
    }
};

// get token
const getNewToken = async (req, res) => {
    try {
    const userId = req.params.id; // Access the "id" from the URL parameter
    if (userId) {
        const userFetch = await Users.findById({ _id: userId });
        if (userFetch) {
        // generate token
        const token = jwt.sign({ id: userFetch._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.json(token);
        } else {
        res.status(404).json({
            errorMessage: "User not found",
        });
        }
    } else {
        res.status(400).json({
        errorMessage: "Id not found in URL parameter",
        });
    }
    } catch (e) {
    res.status(401).json({
        errorMessage: "Something went wrong!\n" + e,
    });
    }
};

//Get the user
const getUser = async (req, res) => {
    const { 
        _id,
        username,
        mobile,
        email,
        role,
        password,
        status,
    } = await Users.findById(
      req.user.id
    );
  
    res.status(200).json({
      id: _id,
      username,
      mobile,
      email,
      role,
      password,
      status,
    });
  };

//Get All users
const getAllUsers = async (req, res) => {
    const abc = await Users.find()
      .then((users) => {
        res.json(users);
      })
      .catch((e) => {
        console.log(e);
      });
};

//Update User
const updateUser = async (req, res) => {
  try{
    const {
      username,
      mobile,
      email,
      role,
      password,
      status,
    } = req.body;

    let updateData = {
      username,
      mobile,
      email,
      role,
      password,
      status,
    };

    if (password && typeof password === 'string') {
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      const hashedPwd = await bcrypt.hash(password, salt);
      updateData.password = hashedPwd;
    }

    const update = await Users.findByIdAndUpdate(req.params.id, updateData);

    if (update) {
      res.status(200).json({
        data: 'User updated successfully',
        status: true,
      });
    } else {
      res.status(401).json({
        errorMessage: 'Failed to update the User!',
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

//Delete User
const deleteUser = async (req, res) => {
  try {
    const deleted = await Users.findByIdAndDelete(req.params.id);

    if (deleted) {
      res.status(200).json({
        data: "User Deleted",
        status: true,
      });
    } else {
      res.status(401).json({
        errorMessage: "Faild to delete User!",
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

//Export
module.exports = {
    registerUser,
    login,
    getNewToken,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
}
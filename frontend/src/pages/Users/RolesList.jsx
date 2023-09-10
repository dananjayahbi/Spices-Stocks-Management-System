import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  CircularProgress, // Added for loading animation
  Typography,
  Divider,
  Chip,
} from "@mui/material";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import AddRole from "./AddRole";
import UpdateRole from "./UpdateRole";
import DeleteRole from "./DeleteRole";

export default function RolesList() {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [openPopupAddRole, setOpenPopupAddRole] = useState(false); //Popup for NewRole
  const [openPopupUpdateRole, setOpenPopupUpdateRole] = useState(false); //Popup for UpdateRole
  const [openPopupDeleteRole, setOpenPopupDeleteRole] = useState(false); //Popup for DeleteRole
  const [fetchedRID, setFetchedRID] = useState(null);
  const [fetchedRole, setFetchedRole] = useState(null); //for delete functionality
  const tableRef = useRef(null);

  
  //Fetch All Roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:8070/roles/getAllRoles");
        const data = await response.json();
        setRoles(data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching roles:", error);
        setLoading(false); // Set loading to false on error as well
      }
    };

    fetchRoles();
  }, [openPopupAddRole, openPopupUpdateRole, openPopupDeleteRole]);

  //Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filtered = roles.filter((Role) => 
      (Role.role && Role.role.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredRoles(filtered);
  }, [roles, searchTerm]);


  //Handle Update
  function handleUpdate(RID){
    setFetchedRID(RID);
    setOpenPopupUpdateRole(true);
  }

  //Handle Delete
  function handleDelete(RID, Role){
    setFetchedRole(Role);
    setFetchedRID(RID);
    setOpenPopupDeleteRole(true);
  }

  
  return (
    <Box p={1}>
      <Box>
        <Typography variant="h5">Roles</Typography>
        <Divider sx={{ mt: 2, mb: 7.5 }} />
      </Box>

      <Box display="flex" justifyContent="flex-end" sx={{ mt: -3 }}>
      <TextField
        id="outlined-basic"
        label="Search by Role"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchTermChange}
        fullWidth
        margin="dense"
        style={{ width: "30%", marginInlineEnd: "10px", marginTop: "-20px", paddingTop: "5px" }}
        InputLabelProps={{ style: { fontSize: "14px" } }} // Reduce font size of label
        inputProps={{
          style: {
            textAlign: "left",
            padding: "10px",
            fontSize: "14px", // Reduce font size of input text
            lineHeight: "1.4", // Vertically center the text
          },
          type: "search", // Change the type attribute
        }}
      />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {setOpenPopupAddRole(true)}}
          sx={{ mt: -2, height: "40px" }}
        >
          New Role
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ marginTop: 2, overflowX: 'auto', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}>
        <Table ref={tableRef}>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>Role</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredRoles.length === 0 ? ( // Display "No matching records found"
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No matching records found
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((Role) => (
                <TableRow key={Role._id}>
                  <TableCell>{Role.role}</TableCell>
                  <TableCell>{Role.description}</TableCell>
                  <TableCell>
                    {Role.status === 'Active' ? (
                      <Chip label={Role.status} color="success" />
                    ) : (
                      <Chip label={Role.status} color="error" />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={()=>{handleUpdate(Role._id)}}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={()=>{handleDelete(Role._id, Role.role)}}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
            {/* Display the count of records */}
            <TableRow>
              <TableCell colSpan={7} align="left">
                Total Roles : {filteredRoles.length}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <AddRole openPopupAddRole={openPopupAddRole} setOpenPopupAddRole={setOpenPopupAddRole}></AddRole>
      <UpdateRole openPopupUpdateRole={openPopupUpdateRole} setOpenPopupUpdateRole={setOpenPopupUpdateRole} roleID = {fetchedRID}></UpdateRole>
      <DeleteRole openPopupDeleteRole={openPopupDeleteRole} setOpenPopupDeleteRole={setOpenPopupDeleteRole} roleID = {fetchedRID} role = {fetchedRole}></DeleteRole>

    </Box>
  );  
}

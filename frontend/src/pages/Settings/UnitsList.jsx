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
} from "@mui/material";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import AddUnit from "./AddUnit";
import UpdateUnit from "./UpdateUnit";
import DeleteUnit from "./DeleteUnit";

export default function Units() {
  const [units, setUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [openPopupAddUnit, setOpenPopupAddUnit] = useState(false); //Popup for NewBrand
  const [openPopupUpdateUnit, setOpenPopupUpdateUnit] = useState(false); //Popup for UpdateBrand
  const [openPopupDeleteUnit, setOpenPopupDeleteUnit] = useState(false); //Popup for DeleteBrand
  const [fetchedUnit, setFetchedUnit] = useState(null); //for delete functionality
  const [fetchedUID, setFetchedUID] = useState(null);
  const tableRef = useRef(null);

  
  //Fetch All Units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await fetch("http://localhost:8070/unit/getAllUnits");
        const data = await response.json();
        setUnits(data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching units:", error);
        setLoading(false); // Set loading to false on error as well
      }
    };

    fetchUnits();
  }, [openPopupAddUnit, openPopupUpdateUnit, openPopupDeleteUnit]);

  //Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filtered = units.filter((Unit) => 
      (Unit.unitName && Unit.unitName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUnits(filtered);
  }, [units, searchTerm]);


  //Handle Update
  function handleUpdate(UID){
    setFetchedUID(UID);
    setOpenPopupUpdateUnit(true);
  }

  //Handle Delete
  function handleDelete(UID, Unit){
    setFetchedUnit(Unit);
    setFetchedUID(UID);
    setOpenPopupDeleteUnit(true);
  }

  
  return (
    <Box p={1}>
      <Box>
        <Typography variant="h5">Units</Typography>
        <Divider sx={{ mt: 2, mb: 7.5 }} />
      </Box>

      <Box display="flex" justifyContent="flex-end" sx={{ mt: -3 }}>
      <TextField
        id="outlined-basic"
        label="Search by Unit"
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
          onClick={() => {setOpenPopupAddUnit(true)}}
          sx={{ mt: -2, height: "40px" }}
        >
          New Unit
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ marginTop: 2, overflowX: 'auto', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}>
        <Table ref={tableRef}>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>Unit</TableCell>
              <TableCell>Description</TableCell>
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
            ) : filteredUnits.length === 0 ? ( // Display "No matching records found"
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No matching records found
                </TableCell>
              </TableRow>
            ) : (
              filteredUnits.map((Unit) => (
                <TableRow key={Unit._id}>
                  <TableCell>{Unit.unitName}</TableCell>
                  <TableCell>{Unit.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={()=>{handleUpdate(Unit._id)}}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={()=>{handleDelete(Unit._id, Unit.unitName)}}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
            {/* Display the count of records */}
            <TableRow>
              <TableCell colSpan={7} align="left">
                Total Units : {filteredUnits.length}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <AddUnit openPopupAddUnit={openPopupAddUnit} setOpenPopupAddUnit={setOpenPopupAddUnit}></AddUnit>
      <UpdateUnit openPopupUpdateUnit={openPopupUpdateUnit} setOpenPopupUpdateUnit={setOpenPopupUpdateUnit} unitID = {fetchedUID}></UpdateUnit>
      <DeleteUnit openPopupDeleteUnit={openPopupDeleteUnit} setOpenPopupDeleteUnit={setOpenPopupDeleteUnit} unitID = {fetchedUID} unitName = {fetchedUnit}></DeleteUnit>

    </Box>
  );  
}

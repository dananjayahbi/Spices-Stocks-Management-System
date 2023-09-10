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
  CircularProgress,
  Typography,
  Divider,
} from "@mui/material";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import AddTax from "./AddTax";
import UpdateTax from "./UpdateTax";
import DeleteTax from "./DeteteTax";

export default function Taxes() {
  const [taxes, setTaxes] = useState([]);
  const [filteredTaxes, setFilteredTaxes] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [openPopupAddTax, setOpenPopupAddTax] = useState(false); //Popup for NewBrand
  const [openPopupUpdateTax, setOpenPopupUpdateTax] = useState(false); //Popup for UpdateBrand
  const [openPopupDeleteTax, setOpenPopupDeleteTax] = useState(false); //Popup for DeleteBrand
  const [fetchedTax, setFetchedTax] = useState(null); //for delete functionality
  const [fetchedTID, setFetchedTID] = useState(null);
  const tableRef = useRef(null);

  
  //Fetch All Taxes
  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const response = await fetch("http://localhost:8070/tax/getAllTaxes");
        const data = await response.json();
        setTaxes(data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching taxes:", error);
        setLoading(false); // Set loading to false on error as well
      }
    };

    fetchTaxes();
  }, [openPopupAddTax, openPopupUpdateTax, openPopupDeleteTax]);

  //Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filtered = taxes.filter((Tax) => 
      (Tax.taxName && Tax.taxName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredTaxes(filtered);
  }, [taxes, searchTerm]);


  //Handle Update
  function handleUpdate(TID){
    setFetchedTID(TID);
    setOpenPopupUpdateTax(true);
  }

  //Handle Delete
  function handleDelete(TID, Tax){
    setFetchedTax(Tax);
    setFetchedTID(TID);
    setOpenPopupDeleteTax(true);
  }

  
  return (
    <Box p={1}>
      <Box>
        <Typography variant="h5">Taxes</Typography>
        <Divider sx={{ mt: 2, mb: 7.5 }} />
      </Box>

      <Box display="flex" justifyContent="flex-end" sx={{ mt: -3 }}>
      <TextField
        id="outlined-basic"
        label="Search by Tax"
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
          onClick={() => {setOpenPopupAddTax(true)}}
          sx={{ mt: -2, height: "40px" }}
        >
          Add Tax
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ marginTop: 2, overflowX: 'auto', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}>
        <Table ref={tableRef}>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>Tax name</TableCell>
              <TableCell>Tax(%)</TableCell>
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
            ) : filteredTaxes.length === 0 ? ( // Display "No matching records found"
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No matching records found
                </TableCell>
              </TableRow>
            ) : (
              filteredTaxes.map((Tax) => (
                <TableRow key={Tax._id}>
                  <TableCell>{Tax.taxName}</TableCell>
                  <TableCell>{Tax.percentage}%</TableCell>
                  <TableCell>
                    <IconButton onClick={()=>{handleUpdate(Tax._id)}}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={()=>{handleDelete(Tax._id, Tax.taxName)}}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
            {/* Display the count of records */}
            <TableRow>
              <TableCell colSpan={7} align="left">
                Total Taxes : {filteredTaxes.length}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <AddTax openPopupAddTax={openPopupAddTax} setOpenPopupAddTax={setOpenPopupAddTax}></AddTax>
      <UpdateTax openPopupUpdateTax={openPopupUpdateTax} setOpenPopupUpdateTax={setOpenPopupUpdateTax} taxID = {fetchedTID}></UpdateTax>
      <DeleteTax openPopupDeleteTax={openPopupDeleteTax} setOpenPopupDeleteTax={setOpenPopupDeleteTax} taxID = {fetchedTID} taxName = {fetchedTax}></DeleteTax>

    </Box>
  );  
}

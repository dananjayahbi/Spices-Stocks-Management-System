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
import NewProductCategory from "./AddProductCategory";
import UpdateProductCategory from "./UpdateProductCategory";
import DeleteProductCategory from "./DeleteProductCategory";

export default function ProductCategoriesList() {
  const [productCategories, setProductCategories] = useState([]);
  const [filteredProductCategories, setFilteredProductCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [openPopupAddProductCategory, setOpenPopupAddProductCategory] = useState(false); //Popup for NewBrand
  const [openPopupUpdateProductCategory, setOpenPopupUpdateProductCategory] = useState(false); //Popup for UpdateBrand
  const [openPopupDeleteProductCategory, setOpenPopupDeleteProductCategory] = useState(false); //Popup for DeleteBrand
  const [fetchedProductCategory, setFetchedProductCategory] = useState(null); //for delete functionality
  const [fetchedICID, setFetchedICID] = useState(null);
  const tableRef = useRef(null);

  
  //Fetch All Brands
  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const response = await fetch("http://localhost:8070/productCategory/getAllCategories");
        const data = await response.json();
        setProductCategories(data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching Categories:", error);
        setLoading(false); // Set loading to false on error as well
      }
    };

    fetchProductCategories();
  }, [openPopupAddProductCategory, openPopupUpdateProductCategory, openPopupDeleteProductCategory]);

  //Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filtered = productCategories.filter((Category) => 
      (Category.categoryName && Category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProductCategories(filtered);
  }, [productCategories, searchTerm]);


  //Handle Update
  function handleUpdate(ICID){
    setFetchedICID(ICID);
    setOpenPopupUpdateProductCategory(true);
  }

  //Handle Delete
  function handleDelete(ICID, category){
    setFetchedProductCategory(category);
    setFetchedICID(ICID);
    setOpenPopupDeleteProductCategory(true);
  }

  
  return (
    <Box p={1}>
      <Box>
        <Typography variant="h5">Product Categories</Typography>
        <Divider sx={{ mt: 2, mb: 7.5 }} />
      </Box>

      <Box display="flex" justifyContent="flex-end" sx={{ mt: -3 }}>
      <TextField
        id="outlined-basic"
        label="Search by Category Name"
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
          onClick={() => {setOpenPopupAddProductCategory(true)}}
          sx={{ mt: -2, height: "40px" }}
        >
          New Category
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ marginTop: 2, overflowX: 'auto', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}>
        <Table ref={tableRef}>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>Category</TableCell>
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
            ) : filteredProductCategories.length === 0 ? ( // Display "No matching records found"
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No matching records found
                </TableCell>
              </TableRow>
            ) : (
              filteredProductCategories.map((Category) => (
                <TableRow key={Category._id}>
                  <TableCell>{Category.categoryName}</TableCell>
                  <TableCell>{Category.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={()=>{handleUpdate(Category._id)}}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={()=>{handleDelete(Category._id, Category.categoryName)}}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
            {/* Display the count of records */}
            <TableRow>
              <TableCell colSpan={7} align="left">
                Total Categories : {filteredProductCategories.length}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <NewProductCategory openPopupAddProductCategory={openPopupAddProductCategory} setOpenPopupAddProductCategory={setOpenPopupAddProductCategory}></NewProductCategory>
      <UpdateProductCategory openPopupUpdateProductCategory={openPopupUpdateProductCategory} setOpenPopupUpdateProductCategory={setOpenPopupUpdateProductCategory} productCategID = {fetchedICID}></UpdateProductCategory>
      <DeleteProductCategory openPopupDeleteProductCategory={openPopupDeleteProductCategory} setOpenPopupDeleteProductCategory={setOpenPopupDeleteProductCategory} productCategID = {fetchedICID} categoryName = {fetchedProductCategory}></DeleteProductCategory>

    </Box>
  );  
}

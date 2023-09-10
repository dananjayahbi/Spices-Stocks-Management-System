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
import AddProduct from "./AddProduct";
import UpdateProduct from "./UpdateProduct";
import DeleteProduct from "./DeleteProduct";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [openPopupAddProduct, setOpenPopupAddProduct] = useState(false); //Popup for NewBrand
  const [openPopupUpdateProduct, setOpenPopupUpdateProduct] = useState(false); //Popup for UpdateBrand
  const [openPopupDeleteProduct, setOpenPopupDeleteProduct] = useState(false); //Popup for DeleteBrand
  const [fetchedProduct, setFetchedProduct] = useState(null); //for delete functionality
  const [fetchedPRID, setFetchedPRID] = useState(null);
  const tableRef = useRef(null);

  
  //Fetch All Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8070/products/getAllProducts");
        const data = await response.json();
        setProducts(data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching Products:", error);
        setLoading(false); // Set loading to false on error as well
      }
    };

    fetchProducts();
  }, [openPopupAddProduct, openPopupUpdateProduct, openPopupDeleteProduct]);

  //Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filtered = products.filter((Product) => 
      (Product.productName && Product.productName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);


  //Handle Update
  function handleUpdate(PRID){
    setFetchedPRID(PRID);
    setOpenPopupUpdateProduct(true);
  }

  //Handle Delete
  function handleDelete(PRID, product){
    setFetchedProduct(product);
    setFetchedPRID(PRID);
    setOpenPopupDeleteProduct(true);
  }

  
  return (
    <Box p={1}>
      <Box>
        <Typography variant="h5">Products</Typography>
        <Divider sx={{ mt: 2, mb: 7.5 }} />
      </Box>

      <Box display="flex" justifyContent="flex-end" sx={{ mt: -3 }}>
      <TextField
        id="outlined-basic"
        label="Search by Product Name"
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
          onClick={() => {setOpenPopupAddProduct(true)}}
          sx={{ mt: -2, height: "40px" }}
        >
          New Product
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ marginTop: 2, overflowX: 'auto', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}>
        <Table ref={tableRef}>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Product Category</TableCell>
              <TableCell>Wholesale Price</TableCell>
              <TableCell>Sale Price</TableCell>
              <TableCell>Stocks</TableCell>
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
            ) : filteredProducts.length === 0 ? ( // Display "No matching records found"
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No matching records found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((Product) => (
                <TableRow key={Product._id}>
                  <TableCell>{Product.productName}</TableCell>
                  <TableCell>{Product.productCategory}</TableCell>
                  <TableCell>{Product.wholeSalePrice} LKR</TableCell>
                  <TableCell>{Product.salePrice} LKR</TableCell>
                  <TableCell>{Product.stocks} Units</TableCell>
                  <TableCell>
                    <IconButton onClick={()=>{handleUpdate(Product._id)}}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={()=>{handleDelete(Product._id, Product.productName)}}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
            {/* Display the count of records */}
            <TableRow>
              <TableCell colSpan={7} align="left">
                Total Products : {filteredProducts.length}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <AddProduct openPopupAddProduct={openPopupAddProduct} setOpenPopupAddProduct={setOpenPopupAddProduct}></AddProduct>
      <UpdateProduct openPopupUpdateProduct={openPopupUpdateProduct} setOpenPopupUpdateProduct={setOpenPopupUpdateProduct} productID = {fetchedPRID}></UpdateProduct>
      <DeleteProduct openPopupDeleteProduct={openPopupDeleteProduct} setOpenPopupDeleteProduct={setOpenPopupDeleteProduct} productID = {fetchedPRID} productName = {fetchedProduct}></DeleteProduct>

    </Box>
  );  
}

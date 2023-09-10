import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  Grid,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material";
import axios from "axios";
import CustomTextField from "../../components/CustomTextField"
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// FORMIK
const INITIAL_FORM_STATE = {
  productName: "",
  productCategory: "",
  wholeSalePrice: "",
  salePrice: "",
  description: "",
};

//YUP validations
const validationSchema = Yup.object({
    productName: Yup.string().required("Product Name is required"),
    productCategory: Yup.string().required("Product Category is required"),
    wholeSalePrice: Yup.string()
        .required("Wholesale Price is required")
        .test('is-positive', 'Wholesale Price must be a positive number', (value) => {
            if (value) {
              const numericValue = parseFloat(value);
              return !isNaN(numericValue) && numericValue >= 0;
            }
        }),
    salePrice: Yup.string()
        .required("Sale Price is required")
        .test('is-positive', 'Sale Price must be a positive number', (value) => {
            if (value) {
              const numericValue = parseFloat(value);
              return !isNaN(numericValue) && numericValue >= 0;
            }
          }),
    description: Yup.string().required("Description is required"),
});

const apiUrl = "http://localhost:8070/products/addProduct"; // Change to your API URL

//The Main function
export default function NewProduct(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const { openPopupAddProduct, setOpenPopupAddProduct } = props;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const dataToSend = {
        productName: values.productName,
        productCategory: values.productCategory,
        wholeSalePrice: values.wholeSalePrice,
        salePrice: values.salePrice,
        stocks: "0",
        description: values.description,
      }

      await axios.post(apiUrl, dataToSend);
      sessionStorage.setItem("productCreated", "1");
      navigate("/products/productsList");
    } catch (error) {
      setNotify({
        isOpen: true,
        message: err.response.data.errorMessage,
        type: "error",
      });
    } finally {
      setSubmitting(false);
      setOpenPopupAddProduct(false);
    }
  };

  return (
    <Dialog
      open={openPopupAddProduct}
      onBackdropClick={() => setOpenPopupAddProduct(false)}
      maxWidth="md"
      TransitionComponent={Transition}
      PaperProps={{
          style: { borderRadius: 10, width: "80%", padding: "20px", paddingBottom: "30px"},
      }}
    >
      <div className="popup">
        <DialogTitle>
        <div className="d-flex justify-content-between align-products-center">
          <div className="d-flex align-products-center">
            <p className="popupTitle">Add Product</p>
          </div>
        </div>

          {/* NOTIFICATION */}
          <Notification notify={notify} setNotify={setNotify} />

          <Divider
            sx={{
              height: "1px",
              backgroundColor: "var(--dark)",
              marginTop: "10px",
            }}
          />
        </DialogTitle>

        <DialogContent>
          <Formik
            initialValues={{INITIAL_FORM_STATE}}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
            <Form>
              <Grid product xs={12} style={{ marginBottom: "10px", marginTop: "10px" }}>
                <CustomTextField name="productName" label="Product Name" />
              </Grid>

              <Grid product xs={12} style={{ marginBottom: "10px" }}>
                <CustomTextField name="productCategory" label="Product Category" />
              </Grid>

              <Grid item xs={12} style={{ marginBottom: "10px" }}>
                    <CustomTextField
                        type='number'
                        name="wholeSalePrice"
                        label="Wholesale Price"
                        inputProps={{ style: { '-moz-appearance': 'textfield' } }}
                    />
                </Grid>

              <Grid item xs={12} style={{ marginBottom: "10px" }}>
                    <CustomTextField
                        type='number'
                        name="salePrice"
                        label="Sale Price"
                        inputProps={{ style: { '-moz-appearance': 'textfield' } }}
                    />
               </Grid>

              <Grid product xs={12} style={{ marginBottom: "10px", marginTop: "10px" }}>
                <CustomTextField name="description" label="Description" />
              </Grid>

              <div style={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}>
                <Button
                  startIcon={<ClearIcon />}
                  style={{marginRight: "15px"}}
                  onClick={() => {
                    setOpenPopupAddProduct(false);
                  }}
                  variant="outlined"
                  color="primary"
                >
                  Close
                </Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </div>
            </Form>
            )}
          </Formik>
        </DialogContent>
      </div>
    </Dialog>
  );
}

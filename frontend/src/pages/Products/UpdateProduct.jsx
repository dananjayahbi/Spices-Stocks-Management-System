import React, { useState, useEffect } from "react";
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
  Box,
  CircularProgress
} from "@mui/material";
import axios from "axios";
import CustomTextField from "../../components/CustomTextField"
import ClearIcon from "@mui/icons-material/Clear";
import LoopIcon from '@mui/icons-material/Loop';
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

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
    stocks: Yup.string()
        .required("Stocks is required")
        .test('is-positive', 'Stock must be a positive number', (value) => {
            if (value) {
              const numericValue = parseFloat(value);
              return !isNaN(numericValue) && numericValue >= 0;
            }
        }),
    description: Yup.string().required("Description is required"),
});

//The Main function
export default function UpdateProductCategory(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const apiUrl = `http://localhost:8070/products/updateProduct/${props.productID}`; // Change to your API URL

  const navigate = useNavigate();
  const { openPopupUpdateProduct, setOpenPopupUpdateProduct } = props;
  const [fetchedProductData, setFetchedProductData] = useState();
  const [loading, setLoading] = useState(true);
  
    async function getBrand() {
        setLoading(true);
        await axios
            .get(`http://localhost:8070/products/getProduct/${props.productID}`)
            .then((res) => {
                setFetchedProductData(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() =>{
        if (props.productID != null){
            getBrand();
        }
    }, [props, openPopupUpdateProduct]);


    const handleSubmit = async (values, { setSubmitting }) => {
      try {
        const dataToSend = {
            productName: values.productName,
            productCategory: values.productCategory,
            wholeSalePrice: values.wholeSalePrice,
            salePrice: values.salePrice,
            stocks: values.stocks,
            description: values.description,
        };
  
        await axios.put(apiUrl, dataToSend);
        sessionStorage.setItem("productUpdated", "1");
        navigate("/products/productsList");
      } catch (error) {
        setNotify({
          isOpen: true,
          message: err.response.data.errorMessage,
          type: "error",
        });
      } finally {
        setSubmitting(false);
        setOpenPopupUpdateProduct(false);
      }
    };

  return (
    <Dialog
      open={openPopupUpdateProduct}
      onBackdropClick={() => setOpenPopupUpdateProduct(false)}
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
            <p className="popupTitle">Update Product</p>
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
        {loading ? (
            <Box display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        ) : (
          <Formik
            initialValues={{
                productName: fetchedProductData?.productName || "",
                productCategory: fetchedProductData?.productCategory || "",
                wholeSalePrice: fetchedProductData?.wholeSalePrice || "",
                salePrice: fetchedProductData?.salePrice || "",
                stocks: fetchedProductData?.stocks || "",
                description: fetchedProductData?.description || "",
            }}
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
                <CustomTextField name="stocks" label="Stocks" />
              </Grid>

              <Grid product xs={12} style={{ marginBottom: "10px", marginTop: "10px" }}>
                <CustomTextField name="description" label="Description" />
              </Grid>

              <div style={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}>
                <Button
                  startIcon={<ClearIcon />}
                  style={{marginRight: "15px"}}
                  onClick={() => {
                    setOpenPopupUpdateProduct(false);
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
                  startIcon={<LoopIcon />}
                >
                  Update
                </Button>
              </div>
            </Form>
            )}
          </Formik>
        )}
        </DialogContent>
      </div>
    </Dialog>
  );
}

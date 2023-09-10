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
  categoryName: Yup.string().required("Category is required"),
  description: Yup.string().required("Description is required"),
});

//The Main function
export default function UpdateProductCategory(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const apiUrl = `http://localhost:8070/productCategory/updateCategory/${props.productCategID}`; // Change to your API URL

  const navigate = useNavigate();
  const { openPopupUpdateProductCategory, setOpenPopupUpdateProductCategory } = props;
  const [fetchedProductCategoryData, setFetchedProductCategoryData] = useState();
  const [loading, setLoading] = useState(true);
  
    async function getBrand() {
        setLoading(true);
        await axios
            .get(`http://localhost:8070/productCategory/getCategory/${props.productCategID}`)
            .then((res) => {
                setFetchedProductCategoryData(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() =>{
        if (props.productCategID != null){
            getBrand();
        }
    }, [props, openPopupUpdateProductCategory]);


    const handleSubmit = async (values, { setSubmitting }) => {
      try {
        const dataToSend = {
          categoryName: values.categoryName,
          description: values.description,
        };
  
        await axios.put(apiUrl, dataToSend);
        sessionStorage.setItem("productCategoryUpdated", "1");
        navigate("/products/productCategoriesList");
      } catch (error) {
        setNotify({
          isOpen: true,
          message: err.response.data.errorMessage,
          type: "error",
        });
      } finally {
        setSubmitting(false);
        setOpenPopupUpdateProductCategory(false);
      }
    };

  return (
    <Dialog
      open={openPopupUpdateProductCategory}
      onBackdropClick={() => setOpenPopupUpdateProductCategory(false)}
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
            <p className="popupTitle">Update Product Category</p>
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
                categoryName: fetchedProductCategoryData?.categoryName || "",
                description: fetchedProductCategoryData?.description || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
            <Form>
              <Grid Product xs={12} style={{ marginBottom: "10px", marginTop: "10px" }}>
                <CustomTextField name="categoryName" label="Category" />
              </Grid>

              <Grid Product xs={12} style={{ marginBottom: "10px" }}>
                <CustomTextField name="description" label="Description" />
              </Grid>

              <div style={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}>
                <Button
                  startIcon={<ClearIcon />}
                  style={{marginRight: "15px"}}
                  onClick={() => {
                    setOpenPopupUpdateProductCategory(false);
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

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
  categoryName: "",
  description: "",
};

//YUP validations
const validationSchema = Yup.object({
  categoryName: Yup.string().required("Category is required"),
  description: Yup.string().required("Description is required"),
});

const apiUrl = "http://localhost:8070/productCategory/addProductCategory"; // Change to your API URL

//The Main function
export default function NewProductCategory(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const { openPopupAddProductCategory, setOpenPopupAddProductCategory } = props;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const dataToSend = {
        categoryName: values.categoryName,
        description: values.description,
      }

      await axios.post(apiUrl, dataToSend);
      sessionStorage.setItem("productCategoryCreated", "1");
      navigate("/products/productCategoriesList");
    } catch (error) {
      setNotify({
        isOpen: true,
        message: err.response.data.errorMessage,
        type: "error",
      });
    } finally {
      setSubmitting(false);
      setOpenPopupAddProductCategory(false);
    }
  };

  return (
    <Dialog
      open={openPopupAddProductCategory}
      onBackdropClick={() => setOpenPopupAddProductCategory(false)}
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
            <p className="popupTitle">Add Category</p>
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
                <CustomTextField name="categoryName" label="Category" />
              </Grid>

              <Grid product xs={12} style={{ marginBottom: "10px" }}>
                <CustomTextField name="description" label="Description" />
              </Grid>

              <div style={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}>
                <Button
                  startIcon={<ClearIcon />}
                  style={{marginRight: "15px"}}
                  onClick={() => {
                    setOpenPopupAddProductCategory(false);
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

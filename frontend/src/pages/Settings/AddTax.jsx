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
  taxName: "",
  percentage: "",
};

//YUP validations
const validationSchema = Yup.object({
    taxName: Yup.string().required("Tax name is required"),
    percentage: Yup.string()
      .required("Percentage is required")
      .test('is-positive', 'Percentage must be a positive number', (value) => {
        if (value) {
          const numericValue = parseFloat(value);
          return !isNaN(numericValue) && numericValue >= 0;
        }
      }),
  });  

const apiUrl = "http://localhost:8070/tax/addTax"; // Change to your API URL

//The Main function
export default function AddTax(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const { openPopupAddTax, setOpenPopupAddTax } = props;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const dataToSend = {
        taxName: values.taxName,
        percentage: values.percentage,
      }

      await axios.post(apiUrl, dataToSend);
      sessionStorage.setItem("taxCreated", "1");
      navigate("/settings/taxList");
    } catch (error) {
      setNotify({
        isOpen: true,
        message: err.response.data.errorMessage,
        type: "error",
      });
    } finally {
      setSubmitting(false);
      setOpenPopupAddTax(false);
    }
  };

  return (
    <Dialog
      open={openPopupAddTax}
      onBackdropClick={() => setOpenPopupAddTax(false)}
      maxWidth="md"
      TransitionComponent={Transition}
      PaperProps={{
          style: { borderRadius: 10, width: "80%", padding: "20px", paddingBottom: "30px"},
      }}
    >
      <div className="popup">
        <DialogTitle>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <p className="popupTitle">Add Tax</p>
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
              <Grid item xs={12} style={{ marginBottom: "10px", marginTop: "10px" }}>
                <CustomTextField name="taxName" label="Tax" />
              </Grid>

                <Grid item xs={12} style={{ marginBottom: "10px" }}>
                    <CustomTextField
                        type='number'
                        name="percentage"
                        label="Tax Percentage(%)"
                        inputProps={{ style: { '-moz-appearance': 'textfield' } }}
                    />
                </Grid>


              <div style={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}>
                <Button
                  startIcon={<ClearIcon />}
                  style={{marginRight: "15px"}}
                  onClick={() => {
                    setOpenPopupAddTax(false);
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

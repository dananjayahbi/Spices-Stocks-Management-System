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
  unitName: "",
  description: "",
};

//YUP validations
const validationSchema = Yup.object({
  unitName: Yup.string().required("Unit is required"),
  description: Yup.string().required("Description is required"),
});

const apiUrl = "http://localhost:8070/unit/addUnit"; // Change to your API URL

//The Main function
export default function NewUnit(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const { openPopupAddUnit, setOpenPopupAddUnit } = props;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const dataToSend = {
        unitName: values.unitName,
        description: values.description,
      }

      await axios.post(apiUrl, dataToSend);
      sessionStorage.setItem("unitCreated", "1");
      navigate("/settings/unitsList");
    } catch (error) {
      setNotify({
        isOpen: true,
        message: err.response.data.errorMessage,
        type: "error",
      });
    } finally {
      setSubmitting(false);
      setOpenPopupAddUnit(false);
    }
  };

  return (
    <Dialog
      open={openPopupAddUnit}
      onBackdropClick={() => setOpenPopupAddUnit(false)}
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
            <p className="popupTitle">Add Unit</p>
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
                <CustomTextField name="unitName" label="Unit" />
              </Grid>

              <Grid item xs={12} style={{ marginBottom: "10px" }}>
                <CustomTextField name="description" label="Description" />
              </Grid>

              <div style={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}>
                <Button
                  startIcon={<ClearIcon />}
                  style={{marginRight: "15px"}}
                  onClick={() => {
                    setOpenPopupAddUnit(false);
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

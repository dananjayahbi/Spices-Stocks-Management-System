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
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// FORMIK
const INITIAL_FORM_STATE = {
  taxName: "",
};

//YUP validations
const validationSchema = Yup.object({
  taxName: Yup.string().required("Tax is required"),
});

//The Main function
export default function DeleteTax(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const { openPopupDeleteTax, setOpenPopupDeleteTax } = props;

  const apiUrl = `http://localhost:8070/tax/deleteTax/${props.taxID}`; // Change to your API URL


  const handleSubmit = async (values, { setSubmitting }) => {
    if (props.taxName == values.taxName) {
        try {
            await axios.delete(apiUrl, values);
            sessionStorage.setItem("taxDeleted", "1");
            navigate("/settings/taxList")
        } catch (error) {
        setNotify({
            isOpen: true,
            message: err.response.data.errorMessage,
            type: "error",
        });
        } finally {
        setSubmitting(false);
        setOpenPopupDeleteTax(false);
        }
    } else {
        setNotify({
            isOpen: true,
            message: "Tax name is not matching!",
            type: "error",
        });
    }
  };

  return (
    <Dialog
      open={openPopupDeleteTax}
      onBackdropClick={() => setOpenPopupDeleteTax(false)}
      maxWidth="sm"
      TransitionComponent={Transition}
      PaperProps={{
          style: { borderRadius: 10, width: "25%", padding: "20px", paddingBottom: "30px"},
      }}
    >
      <div className="popup">
        <DialogTitle>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <p className="popupTitle">Delete Tax</p>
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
            {({ isSubmitting }) => (
            <Form>
              <Grid item xs={12} style={{ marginBottom: "10px", marginTop: "10px" }}>
                <CustomTextField name="taxName" label="Type Tax name to confirm delete ..." />
              </Grid>


              <div style={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}>
                <Button
                  startIcon={<ClearIcon />}
                  style={{marginRight: "15px"}}
                  onClick={() => {
                    setOpenPopupDeleteTax(false);
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
                  startIcon={<DeleteIcon />}
                >
                  Delete
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

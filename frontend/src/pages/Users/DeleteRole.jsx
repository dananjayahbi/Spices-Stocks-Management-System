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
  role: "",
};

//YUP validations
const validationSchema = Yup.object({
  role: Yup.string().required("Role is required"),
});

//The Main function
export default function DeleteRole(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const { openPopupDeleteRole, setOpenPopupDeleteRole } = props;

  const apiUrl = `http://localhost:8070/roles/deleteRole/${props.roleID}`; // Change to your API URL


  const handleSubmit = async (values, { setSubmitting }) => {
    if (props.role == values.role) {
        try {
            await axios.delete(apiUrl, values);
            sessionStorage.setItem("roleDeleted", "1");
            navigate("/users/rolesList")
        } catch (error) {
        setNotify({
            isOpen: true,
            message: err.response.data.errorMessage,
            type: "error",
        });
        } finally {
        setSubmitting(false);
        setOpenPopupDeleteRole(false);
        }
    } else {
        setNotify({
            isOpen: true,
            message: "Role is not matching!",
            type: "error",
        });
    }
  };

  return (
    <Dialog
      open={openPopupDeleteRole}
      onBackdropClick={() => setOpenPopupDeleteRole(false)}
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
            <p className="popupTitle">Delete Role</p>
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
                <CustomTextField name="role" label="Type role to confirm delete ..." />
              </Grid>


              <div style={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}>
                <Button
                  startIcon={<ClearIcon />}
                  style={{marginRight: "15px"}}
                  onClick={() => {
                    setOpenPopupDeleteRole(false);
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

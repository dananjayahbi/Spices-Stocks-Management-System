import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Grid,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  IconButton,
} from "@mui/material";
import axios from "axios";
import CustomTextField from "../../components/CustomTextField"
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// FORMIK
const INITIAL_FORM_STATE = {
  username: "",
  mobile: "",
  email: "",
  role: "",
  password: "",
  confirmPassword: "",
};

//YUP validations
const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  mobile: Yup.string().required("Mobile No is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string().required("Role is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const apiUrl = "http://localhost:8070/users/register"; // Change to your API URL

//The Main function
export default function NewUser(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const { openPopup, setOpenPopup } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const status = ["Active", "Inactive"];


  useEffect(() => {
    async function fetchRoles() {
      try {
        const response = await fetch('http://localhost:8070/roles/getAllRoles');
        const data = await response.json();
        const roleNames = data.map(role => role.role);
        setRoles(roleNames);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    }

    fetchRoles();
  }, [props, openPopup]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.post(apiUrl, values);
      sessionStorage.setItem("userCreated", "1");
      navigate("/users/usersList")
    } catch (error) {
      setNotify({
        isOpen: true,
        message: err.response.data.errorMessage,
        type: "error",
      });
    } finally {
      setSubmitting(false);
      setOpenPopup(false);
    }
  };

  return (
    <Dialog
      open={openPopup}
      onBackdropClick={() => setOpenPopup(false)}
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
            <p className="popupTitle">Add User</p>
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
                <CustomTextField name="username" label="Username" />
              </Grid>

              <Grid item xs={12} style={{ marginBottom: "10px" }}>
                <CustomTextField name="mobile" label="Mobile" />
              </Grid>

              <Grid item xs={12} style={{ marginBottom: "10px" }}>
                <CustomTextField name="email" label="Email" />
              </Grid>

              <Grid item xs={12} style={{ marginBottom: "10px" }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="role">Role</InputLabel>
                  <Field
                    as={Select}
                    name="role"
                    label="Role"
                    inputProps={{ id: "role" }}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>

              <Grid item xs={12} style={{ marginBottom: "10px" }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="status">Status</InputLabel>
                  <Field
                    as={Select}
                    name="status"
                    label="Status"
                    inputProps={{ id: "status" }}
                  >
                    {status.map((stat) => (
                      <MenuItem key={stat} value={stat}>
                        {stat}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid>

              <Grid item xs={12} style={{ marginBottom: "10px" }}>
                <CustomTextField
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} style={{ marginBottom: "30px" }}>
                <CustomTextField
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>

              <div style={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}>
                <Button
                  startIcon={<ClearIcon />}
                  style={{marginRight: "15px"}}
                  onClick={() => {
                    setOpenPopup(false);
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

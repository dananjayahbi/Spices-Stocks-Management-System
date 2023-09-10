import React, { useState , useEffect } from "react";
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
  CircularProgress,
  Box
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
  username: Yup.string().required("Username is required"),
  mobile: Yup.string().required("Mobile No is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string().required("Role is required"),
});


//The Main function
export default function UpdateUser(props) {
    // FORMIK
    const INITIAL_FORM_STATE = {
        username: "",
        mobile: "",
        email: "",
        role: "",
        status: "",
    };

  const apiUrl = `http://localhost:8070/users/updateUser/${props.userID}`; // Change to your API URL


  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();
  const { openPopup2, setOpenPopup2 } = props;
  const [fetchedUserdetails, setFetchedUserdetails] = useState("");
  const [loading, setLoading] = useState(true);
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
  }, [props, openPopup2]);

    //Getting new token each time
    async function getToken(UID) {
        setLoading(true);
        await axios
          .post(`http://localhost:8070/users/token/${UID}`) // Update with your actual API endpoint
          .then((res) => {
            getUserDetails(res.data);
          })
          .finally(() => {
            setLoading(false);
          });
    }

    //Getting user details
    function getUserDetails(token){
        setLoading(true);
        axios
            .get(`http://localhost:8070/users/getUser`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) =>{
                setFetchedUserdetails(res.data);
            })
            .catch((err) =>{
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.put(apiUrl, values);
      sessionStorage.setItem("userUpdated", "1");
      navigate("/users/usersList")
    } catch (error) {
      setNotify({
        isOpen: true,
        message: err.response.data.errorMessage,
        type: "error",
      });
    } finally {
      setSubmitting(false);
      setOpenPopup2(false);
    }
  };

  useEffect(() => {
    if(props.userID != null){
        getToken(props.userID)
    }
  }, [props, openPopup2]);

  return (
    <Dialog
      open={openPopup2}
      onBackdropClick={() => setOpenPopup2(false)}
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
            <p className="popupTitle">Update User</p>
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
            initialValues={fetchedUserdetails || INITIAL_FORM_STATE}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
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

              <div style={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}>
                <Button
                  startIcon={<ClearIcon />}
                  style={{marginRight: "15px"}}
                  onClick={() => {
                    setOpenPopup2(false);
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

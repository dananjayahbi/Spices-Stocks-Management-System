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
  FormControlLabel,
  Checkbox,
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
  role: Yup.string().required("Role is required"),
  description: Yup.string().required("Description is required"),
  status: Yup.string().required("Status is required"),
});

const mainSelections = [
  { name: "Sales", subs: ["Sales List","Sales Return List"] },
  { name: "Buyers", subs: ["Buyers List", "Import Buyers"] },
  { name: "Purchase", subs: ["Purchase List","Purchase Return List"] },
  { name: "Suppliers", subs: ["Suppliers List", "Import Suppliers"] },
  { name: "Products", subs: ["Products List","Products Categories List","Print Labels", "Import Products"] },
  { name: "Expenses", subs: ["Expenses List"] },
  { name: "Repoets", subs: ["Profit & Loss Report", "Purchase Report", "Purchase Retuen Report", "Purchase Payments Report", "Product Sales Report", "Product Purchase Report", "Sales Report", "Sales Return Report", "Sales Payments Report", "Stock Report", "Expenses Report"] },
  { name: "Users", subs: ["Users List", "Roles List"] },
  { name: "SMS", subs: ["Send SMS", "SMS Templates", "SMS API"] },
  { name: "Settings", subs: ["Company Profile", "Site Settings", "Tax List", "Units List", "Payment Types List","Change Password", "Database Backup"] },
  // Add more main selections and their sub-selections as needed
];

//The Main function
export default function UpdateRole(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const apiUrl = `http://localhost:8070/roles/updateRole/${props.roleID}`; // Change to your API URL

  const navigate = useNavigate();
  const { openPopupUpdateRole, setOpenPopupUpdateRole } = props;
  const status = ["Active", "Restricted"];
  const [selectedSubs, setSelectedSubs] = useState([]); // To track selected sub-selections
  const [fetchedRoleData, setFetchedRoleData] = useState();
  const [loading, setLoading] = useState(true);

// Helper function to handle sub-selection change
const handleSubSelectionChange = (event, sub, isChecked) => {
    const selectedSub = sub;
    setSelectedSubs(prevSelectedSubs => {
      if (isChecked) {
        return [...prevSelectedSubs, { page: selectedSub, access: true }];
      } else {
        return prevSelectedSubs.filter(selected => selected.page !== selectedSub);
      }
    });
  };
  
    async function getRole() {
        setLoading(true);
        await axios
            .get(`http://localhost:8070/roles/getRole/${props.roleID}`)
            .then((res) => {
                setFetchedRoleData(res.data);
                if(res.data.permissions){
                    setSelectedSubs(res.data.permissions);
                    //console.log(selectedSubs);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() =>{
        if (props.roleID != null){
            getRole();
        }
    }, [props, openPopupUpdateRole]);


    const handleSubmit = async (values, { setSubmitting }) => {
      try {
        const dataToSend = {
          role: values.role,
          description: values.description,
          status: values.status,
          permissions: selectedSubs,
        };
  
        await axios.put(apiUrl, dataToSend);
        sessionStorage.setItem("roleUpdated", "1");
        navigate("/users/rolesList");
      } catch (error) {
        setNotify({
          isOpen: true,
          message: err.response.data.errorMessage,
          type: "error",
        });
      } finally {
        setSubmitting(false);
        setOpenPopupUpdateRole(false);
      }
    };

  return (
    <Dialog
      open={openPopupUpdateRole}
      onBackdropClick={() => setOpenPopupUpdateRole(false)}
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
            <p className="popupTitle">Update Role</p>
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
                role: fetchedRoleData?.role || "",
                description: fetchedRoleData?.description || "",
                status: fetchedRoleData?.status || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
            <Form>
              <Grid item xs={12} style={{ marginBottom: "10px", marginTop: "10px" }}>
                <CustomTextField name="role" label="Role" />
              </Grid>

              <Grid item xs={12} style={{ marginBottom: "10px" }}>
                <CustomTextField name="description" label="Description" />
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

                {/* Main and Sub Selections */}
                <Grid item xs={12} style={{ marginBottom: "10px" }}>
                <FormControl fullWidth>
                    {mainSelections.map((main) => (
                    <div key={main.name}>
                        <FormControlLabel
                        control={
                            <Checkbox
                            checked={selectedSubs.some(sub => main.subs.includes(sub.page) && sub.access)}
                            onChange={(e) => {
                                const isChecked = e.target.checked;
                                if (isChecked) {
                                setSelectedSubs((prevSelectedSubs) => [
                                    ...prevSelectedSubs,
                                    ...main.subs.map(sub => ({ page: sub, access: true })),
                                ]);
                                } else {
                                setSelectedSubs((prevSelectedSubs) =>
                                    prevSelectedSubs.filter(sub => !main.subs.includes(sub.page))
                                );
                                }
                            }}
                            value={main.name}
                            />
                        }
                        label={main.name}
                        />
                        <div style={{ marginLeft: "20px" }}>
                        {main.subs.map((sub) => (
                            <FormControlLabel
                            style={{ marginBottom: "30px" }}
                            key={sub}
                            control={
                              <Checkbox
                                checked={selectedSubs.some(
                                  (selectedSub) =>
                                    selectedSub.page === sub && selectedSub.access
                                )}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  handleSubSelectionChange(e, sub, isChecked);
                                }}
                                value={sub}
                              />
                            }
                            label={sub}
                            />
                        ))}
                        <Divider/>
                        </div>
                    </div>
                    ))}
                </FormControl>
                </Grid>

              <div style={{ display: "flex", justifyContent: "right", marginTop: "1rem" }}>
                <Button
                  startIcon={<ClearIcon />}
                  style={{marginRight: "15px"}}
                  onClick={() => {
                    setOpenPopupUpdateRole(false);
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

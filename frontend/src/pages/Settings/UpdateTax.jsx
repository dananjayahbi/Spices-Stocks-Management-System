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
  taxName: Yup.string().required("Tax is required"),
  percentage: Yup.string().required("Percentage is required"),
});

//The Main function
export default function UpdateTax(props) {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const apiUrl = `http://localhost:8070/tax/updateTax/${props.taxID}`; // Change to your API URL

  const navigate = useNavigate();
  const { openPopupUpdateTax, setOpenPopupUpdateTax } = props;
  const [fetchedTaxData, setFetchedTaxData] = useState();
  const [loading, setLoading] = useState(true);
  
    async function getTax() {
        setLoading(true);
        await axios
            .get(`http://localhost:8070/tax/getTax/${props.taxID}`)
            .then((res) => {
                setFetchedTaxData(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() =>{
        if (props.taxID != null){
            getTax();
        }
    }, [props, openPopupUpdateTax]);


    const handleSubmit = async (values, { setSubmitting }) => {
      try {
        const dataToSend = {
          taxName: values.taxName,
          percentage: values.percentage,
        };
  
        await axios.put(apiUrl, dataToSend);
        sessionStorage.setItem("taxUpdated", "1");
        navigate("/settings/taxList");
      } catch (error) {
        setNotify({
          isOpen: true,
          message: err.response.data.errorMessage,
          type: "error",
        });
      } finally {
        setSubmitting(false);
        setOpenPopupUpdateTax(false);
      }
    };

  return (
    <Dialog
      open={openPopupUpdateTax}
      onBackdropClick={() => setOpenPopupUpdateTax(false)}
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
            <p className="popupTitle">Update Tax</p>
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
                taxName: fetchedTaxData?.taxName || "",
                percentage: fetchedTaxData?.percentage || "",
            }}
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
                    setOpenPopupUpdateTax(false);
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

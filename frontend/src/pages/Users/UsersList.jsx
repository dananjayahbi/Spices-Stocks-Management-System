import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  CircularProgress, // Added for loading animation
  ListItemIcon,
  Typography,
  Divider,
  Chip,
} from "@mui/material";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  SaveAlt as CsvIcon,
} from "@mui/icons-material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import NewUser from "./NewUser";
import UpdateUser from "./UpdateUser";
import DeleteUser from "./DeleteUser";
import UsersTablePrint from "./UsersTablePrint";
import { useReactToPrint } from "react-to-print"; // For printing
import jsPDF from "jspdf"; // For PDF export
import * as XLSX from "xlsx"; // For Excel export
import * as FileSaver from "file-saver"; // For CSV export
import autoTable from 'jspdf-autotable'

export default function UsersList({ setNotify }) {
  const [users, setUsers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [openPopup, setOpenPopup] = useState(false); //Popup for NewUser
  const [openPopup2, setOpenPopup2] = useState(false); //Popup for UpdateUser
  const [openPopup3, setOpenPopup3] = useState(false); //Popup for DeleteUser
  const [fetchedUID, setFetchedUID] = useState(null);
  const [fetchedUname, setFetchedUname] = useState(null); //for delete functionality
  const tableRef = useRef(null);
  const customTableRef = useRef(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Function to generate a random color with controlled brightness
  const getRandomColor = () => {
    const minBrightness = 40; // Minimum brightness (0-100)
    const maxBrightness = 80; // Maximum brightness (0-100)
    const colorThreshold = 20; // Minimum difference between color channels
  
    const getRandomChannel = () => Math.floor(Math.random() * 256);
    const isColorValid = (color) => {
      const brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
      return (
        brightness >= minBrightness &&
        brightness <= maxBrightness &&
        color.r >= colorThreshold &&
        color.g >= colorThreshold &&
        color.b >= colorThreshold
      );
    };
  
    let color;
    do {
      color = {
        r: getRandomChannel(),
        g: getRandomChannel(),
        b: getRandomChannel(),
      };
    } while (!isColorValid(color));
  
    return `rgb(${color.r},${color.g},${color.b})`;
  };
  
  //Fetch All Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8070/users/getAllUsers");
        const data = await response.json();
        setUsers(data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false); // Set loading to false on error as well
      }
    };

    fetchUsers();
  }, [openPopup, openPopup2, openPopup3]);

  //Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filtered = users.filter((user) => 
      (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.mobile && user.mobile.toString().includes(searchTerm))
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);


  //Handle Update
  function handleUpdate(UID){
    setFetchedUID(UID);
    setOpenPopup2(true);
  }

  //Handle Delete
  function handleDelete(UID, Uname){
    setFetchedUname(Uname);
    setFetchedUID(UID);
    setOpenPopup3(true);
  }

  //-----EXPORTS-----

  const handleCustomPrint = useReactToPrint({
    content: () => customTableRef.current,
  });
  
  const handleExportPDF = () => {
    const doc = new jsPDF();
  
    const marginLeft = 10;
    const marginTop = 10;
    const contentWidth = doc.internal.pageSize.width - 2 * marginLeft;
  
    doc.setFontSize(20);
    doc.setTextColor(38, 48, 92);
    doc.text("Users List Report", marginLeft, marginTop + 10);
  
    const tableTop = 30; // Adjust this value to position the table
    const tableColWidth = contentWidth / 7;
  
    doc.autoTable({
      head: [['Username', 'Email', 'Status', 'Role', 'Mobile']],
      body: filteredUsers.map(user => [
        user.username,
        user.email,
        user.status,
        user.role,
        user.mobile
      ]),
      startY: tableTop,
      margin: { left: marginLeft, top: marginTop + 20 },
      headStyles: { fillColor: [38, 48, 92] },
      bodyStyles: { textColor: [38, 48, 92] },
      columnStyles: { 0: { cellWidth: tableColWidth * 1.5 } }, // Adjust column widths as needed
      theme: 'grid', // or 'striped'
      styles: { overflow: 'linebreak' }
    });
  
    doc.save('UsersList.pdf');
  };  
  
  const handleExportExcel = () => {
    const xlsData = [];
    filteredUsers.forEach((user) => {
      xlsData.push([
        user.username,
        user.email,
        user.status,
        user.role,
        user.mobile,
      ]);
    });
  
    const worksheet = XLSX.utils.aoa_to_sheet([["Username", "Email", "Status", "Role", "Mobile"], ...xlsData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
  
    const blob = new Blob([s2ab(XLSX.write(workbook, { bookType: "xlsx", type: "binary" }))], {
      type: "application/octet-stream",
    });
  
    FileSaver.saveAs(blob, "users.xlsx");
  };
  
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }   
  
  const handleExportCSV = () => {
    const csvData = [];
    filteredUsers.forEach((user) => {
      csvData.push([
        user.username,
        user.email,
        user.status,
        user.role,
        user.mobile,
      ]);
    });
  
    const csv = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    FileSaver.saveAs(blob, "users.csv");
  };

  // Helper function to format dates in YYYY-MM-DD format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  };

  

  return (
    <Box p={1}>
      <Box>
        <Typography variant="h5">Users</Typography>
        <Divider sx={{ mt: 2, mb: 5 }} />
      </Box>

      <Button
        variant="contained"
        startIcon={<FileUploadIcon />}
        onClick={handleOpenMenu}
      >
        Export
      </Button>
      <Box display="flex" justifyContent="flex-end" sx={{ mt: -3 }}>
      <TextField
        id="outlined-basic"
        label="Search by Username or Mobile"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchTermChange}
        fullWidth
        margin="dense"
        style={{ width: "30%", marginInlineEnd: "10px", marginTop: "-20px", paddingTop: "5px" }}
        InputLabelProps={{ style: { fontSize: "14px" } }} // Reduce font size of label
        inputProps={{
          style: {
            textAlign: "left",
            padding: "10px",
            fontSize: "14px", // Reduce font size of input text
            lineHeight: "1.4", // Vertically center the text
          },
          type: "search", // Change the type attribute
        }}
      />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {setOpenPopup(true)}}
          sx={{ mt: -2, height: "40px" }}
        >
          Create
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          <MenuItem onClick={handleCustomPrint} sx={{ fontSize: "12px" }}>
            <ListItemIcon style={{ minWidth: "32px" }}>
              <PrintIcon style={{ fontSize: 18 }} />
            </ListItemIcon>
            Print
          </MenuItem>
          <MenuItem onClick={handleExportPDF} sx={{ fontSize: "12px" }}>
            <ListItemIcon style={{ minWidth: "32px" }}>
              <PdfIcon style={{ fontSize: 18 }} />
            </ListItemIcon>
            PDF
          </MenuItem>
          <MenuItem onClick={handleExportExcel} sx={{ fontSize: "12px" }}>
            <ListItemIcon style={{ minWidth: "32px" }}>
              <ExcelIcon style={{ fontSize: 18 }} />
            </ListItemIcon>
            Excel
          </MenuItem>
          <MenuItem onClick={handleExportCSV} sx={{ fontSize: "12px" }}>
            <ListItemIcon style={{ minWidth: "32px" }}>
              <CsvIcon style={{ fontSize: 18 }} />
            </ListItemIcon>
            CSV
          </MenuItem>
        </Menu>
      </Box>
      <TableContainer component={Paper} sx={{ marginTop: 2, overflowX: 'auto', boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}>
        <Table ref={tableRef}>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? ( // Display "No matching records found"
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No matching records found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Avatar sx={{ bgcolor: getRandomColor(), marginRight: 1 }}>
                      {user.username.charAt(0)}
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.status === 'Active' ? (
                      <Chip label={user.status} color="success" />
                    ) : (
                      <Chip label={user.status} color="error" />
                    )}
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.mobile}</TableCell>
                  <TableCell>
                    <IconButton onClick={()=>{handleUpdate(user._id)}}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={()=>{handleDelete(user._id, user.username)}}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
            {/* Display the count of records */}
            <TableRow>
              <TableCell colSpan={7} align="left">
                Total Users : {filteredUsers.length}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
          <div style={{ display: "none" }}>
            <UsersTablePrint users={filteredUsers} ref={customTableRef} />
          </div>
      </TableContainer>

      <NewUser openPopup={openPopup} setOpenPopup={setOpenPopup}></NewUser>
      <UpdateUser openPopup2={openPopup2} setOpenPopup2={setOpenPopup2} userID = {fetchedUID}></UpdateUser>
      <DeleteUser openPopup3={openPopup3} setOpenPopup3={setOpenPopup3} userID = {fetchedUID} username = {fetchedUname}></DeleteUser>

    </Box>
  );  
}

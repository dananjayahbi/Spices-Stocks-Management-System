import React, { forwardRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

const UsersTablePrint = forwardRef(({ users }, ref) => {
  return (
    <div>
        <Table ref={ref}>
        <TableHead>
            <TableRow style={{ backgroundColor: "#26305c"}}>
            <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Username</TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Email</TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Status</TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Role</TableCell>
            <TableCell style={{ fontWeight: "bold", color: "#fff" }}>Mobile</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {users.map((user) => (
            <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.mobile}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </div>
  );
});

export default UsersTablePrint;

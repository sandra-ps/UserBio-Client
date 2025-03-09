import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosinstance";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../components/header";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false); // Modal open state
  const [selectedUser, setSelectedUser] = useState(null); // User to be edited
  const [formData, setFormData] = useState({
    name: "",
    dateofbirth: "",
    contactnumber: "",
    email: "",
    gender: "",
    city: "",
    district: "",
    state: "",
  });

  useEffect(() => {
    userDetails();
  }, []);

  const userDetails = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      console.error("User ID or Token not found");
      return;
    }

    try {
      const response = await axiosInstance.get(`/getuser/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.data) {
        setUsers(Array.isArray(response.data) ? response.data : [response.data]);
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  const handleEdit = (userId) => {
    const user = users.find((user) => user._id === userId);
    setSelectedUser(user);
    setFormData({
      name: user.name,
    //   dateofbirth: user.dateofbirth,
    dateofbirth: user.dateofbirth ? new Date(user.dateofbirth).toISOString().split('T')[0] : "", // Format date as yyyy-MM-dd
      contactnumber: user.contactnumber,
      email: user.email,
      gender: user.gender,
      city: user.city,
      district: user.district,
      state: user.state,
    });
    setOpen(true); // Open the modal
  };

  const handleClose = () => {
    setOpen(false); // Close the modal
  };

  const handleSave = async () => {
    const userId = selectedUser._id;
    const token = localStorage.getItem("token");

    try {
      await axiosInstance.put(`/update/${userId}`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      // Update the local state with the new user data
      setUsers(users.map((user) => (user._id === userId ? { ...user, ...formData } : user)));

      setOpen(false); // Close the modal after saving
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <Header />
      <h2>User List</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>City</TableCell>
              <TableCell>District</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.contactnumber}</TableCell>
                <TableCell>{user.city}</TableCell>
                <TableCell>{user.district}</TableCell>
                <TableCell>{user.state}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{new Date(user.dateofbirth).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(user._id)}
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                 
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for editing user */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            label="Contact Number"
            fullWidth
            margin="normal"
            name="contactnumber"
            value={formData.contactnumber}
            onChange={handleChange}
          />
          <TextField
            label="City"
            fullWidth
            margin="normal"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <TextField
            label="District"
            fullWidth
            margin="normal"
            name="district"
            value={formData.district}
            onChange={handleChange}
          />
          <TextField
            label="State"
            fullWidth
            margin="normal"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
          <TextField
            label="Gender"
            fullWidth
            margin="normal"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          />
          <TextField
            label="Date of Birth"
            fullWidth
            margin="normal"
            type="date"
            name="dateofbirth"
            value={formData.dateofbirth}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserTable;

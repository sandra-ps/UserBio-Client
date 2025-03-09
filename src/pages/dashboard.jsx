
import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    MenuItem,
    Grid,
    Paper,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Toaster, toast } from "sonner";
import dayjs from "dayjs";
import statesData from "../data/states.json";
import districtsData from "../data/districts.json";
import citiesData from "../data/cities.json";
import Header from "../components/header";
import "../styles/dashboard.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axiosInstance from "../config/axiosinstance"; // Ensure you have this utility
import { useNavigate } from "react-router-dom";

const Dashboard = ({ onSubmit }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        dateOfBirth: dayjs(),
        address: { state: "", district: "", city: "" },
        contactNumber: "",
        email: "",
        gender: "",
    });

    // Load email from localStorage on component mount
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.email) {
            setFormData((prev) => ({ ...prev, email: user.email }));
        }
    }, []);

    // Handle Input Changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle Date Change
    const handleDateChange = (newDate) => {
        setFormData((prev) => ({ ...prev, dateOfBirth: newDate || dayjs() }));
    };

    // Handle Address Selection
    const handleAddressChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [field]: value,
                ...(field === "state" ? { district: "", city: "" } : {}),
                ...(field === "district" ? { city: "" } : {}),
            },
        }));
    };

    // Validation Function
    const validate = () => {
        let errors = [];

        if (!formData.name.trim()) errors.push("Name is required.");
        if (!formData.dateOfBirth) errors.push("Date of Birth is required.");
        if (!formData.gender) errors.push("Gender is required.");
        if (!formData.address.state) errors.push("State is required.");
        if (!formData.address.district) errors.push("District is required.");
        if (!formData.address.city) errors.push("City is required.");
        if (!/^\d{10}$/.test(formData.contactNumber)) errors.push("Contact Number must be a valid 10-digit number.");

        if (errors.length > 0) {
            errors.forEach((error) => toast.error(error));
            return false;
        }
        return true;
    };

    // Handle Form Submission
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!validate()) return;
    
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
    
        if (!userId) {
            toast.error("User ID not found. Please log in again.");
            return;
        }
    
        if (!token) {
            toast.error("Authorization token is missing. Please log in again.");
            return;
        }
    
        const payload = {
            name: formData.name,
            dateofbirth: formData.dateOfBirth.format("YYYY-MM-DD"),
            state: formData.address.state,
            district: formData.address.district,
            city: formData.address.city,
            contactnumber: formData.contactNumber,
            email: formData.email,
            gender: formData.gender,
        };
    
        try {
            await axiosInstance.post(`/addbiodata/${userId}`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`, // Add Authorization header
                },
            });
    
            toast.success("Biodata updated successfully!");
            // Clear the form after submission
        setFormData({
            name: "",
            dateOfBirth: dayjs(),
            address: { state: "", district: "", city: "" },
            contactNumber: "",
            email: userId ? JSON.parse(localStorage.getItem("user"))?.email : "", // Keep the email from localStorage if available
            gender: "",
        });
           
        } catch (err) {
            toast.error(err.response?.data?.message || "An error occurred. Please try again.");
        }
    };
    
    
    return (
        <>
            <Header />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: "auto", mt: 5 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Bio-Data Form
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {/* Name */}
                            <Grid item xs={12}>
                                <TextField label="FullName" name="name" fullWidth required value={formData.name} onChange={handleChange} />
                            </Grid>

                            {/* Date of Birth */}
                            <Grid item xs={12}>
                                <DatePicker
                                    label="Date of Birth"
                                    value={formData.dateOfBirth}
                                    onChange={handleDateChange}
                                    format="DD/MM/YYYY"
                                    renderInput={(params) => <TextField {...params} fullWidth required />}
                                />
                            </Grid>

                            {/* Gender */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">Gender</Typography>
                                <RadioGroup row name="gender" value={formData.gender} onChange={handleChange}>
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="Other" control={<Radio />} label="Other" />
                                </RadioGroup>
                            </Grid>

                            {/* Address Selection */}
                            <Grid item xs={12}>
                                <TextField select label="State" fullWidth value={formData.address.state} onChange={(e) => handleAddressChange("state", e.target.value)}>
                                    {statesData.map((state) => (
                                        <MenuItem key={state} value={state}>
                                            {state}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField select label="District" fullWidth value={formData.address.district} onChange={(e) => handleAddressChange("district", e.target.value)} disabled={!formData.address.state}>
                                    {districtsData[formData.address.state]?.map((district) => (
                                        <MenuItem key={district} value={district}>
                                            {district}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField select label="City" fullWidth value={formData.address.city} onChange={(e) => handleAddressChange("city", e.target.value)} disabled={!formData.address.district}>
                                    {citiesData[formData.address.district]?.map((city) => (
                                        <MenuItem key={city} value={city}>
                                            {city}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Contact Number */}
                            <Grid item xs={12}>
                                <TextField label="Contact Number" name="contactNumber" fullWidth required value={formData.contactNumber} onChange={handleChange} inputProps={{ maxLength: 10, pattern: "[0-9]*" }} onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()} />
                            </Grid>

                            {/* Email (Disabled) */}
                            <Grid item xs={12}>
                                <TextField label="Email" name="email" type="email" fullWidth required value={formData.email} disabled />
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </LocalizationProvider>
            <Toaster position="top-right" richColors />
        </>
    );
};

export default Dashboard;



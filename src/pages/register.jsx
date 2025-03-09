import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Helmet } from 'react-helmet-async';
import { Toaster, toast } from 'sonner';
import { Container, Grid, IconButton, InputAdornment } from '@mui/material';
import '../styles/register.css';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axiosInstance from '../config/axiosinstance';

function Register() {
    const [userData, setUserData] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};

        // Validate name (only letters, no spaces or special characters)
        if (!/^[a-zA-Z]+$/.test(userData.name)) {
            newErrors.name = 'Name must contain only letters and no spaces or special characters.';
        }

        // Validate Gmail address
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(userData.email)) {
            newErrors.email = 'Invalid Gmail address. Only Gmail accounts are allowed.';
        }

        // Validate password (at least 6 characters, one uppercase letter, one special character)
        // if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(userData.password)) {
        //     newErrors.password =
        //         'Password must be at least 6 characters long, contain at least one uppercase letter, and one special character.';
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) {
            return;
        }
    
        try {
            // Send the form data to the backend
            await axiosInstance.post('/register', userData);
    
            toast.success('User Registered Successfully!');
            setTimeout(() => {
                navigate('/');
            }, 2000);
    
        } catch (err) {
            toast.error(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };
    

    return (
        <>
            <main>
                <Helmet>
                    <title>Register - User Management</title>
                    <meta
                        name="description"
                        content="Register a new user to the database with secure credentials."
                    />
                </Helmet>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <div className='banner-div'></div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <div className='user-div'>
                            <h1 className='register-text'>Create an account</h1>
                            <p className='para'>Already have an account? <Link to={'/'}>Login</Link></p>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    id="outlined-name"
                                    label="Name"
                                    variant="outlined"
                                    name="name"
                                    value={userData.name}
                                    onChange={handleChange}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                                <TextField
                                    id="outlined-email"
                                    label="Email"
                                    variant="outlined"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                                
                                <TextField
                                    id="outlined-password"
                                    label="Password"
                                    variant="outlined"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={userData.password}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    fullWidth
                                    margin="normal"
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <div className="div mt-2">
                                    <button type="submit" className='register-btn'>
                                        Create Account
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Grid>
                </Grid>
                <Toaster position="top-right" richColors />
            </main>
        </>
    );
}

export default Register;

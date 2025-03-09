import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Helmet } from 'react-helmet-async';
import { Toaster, toast } from 'sonner';
import { Grid, IconButton, InputAdornment } from '@mui/material';
import '../styles/login.css';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axiosInstance from '../config/axiosinstance';

function Login() {
    const [userData, setUserData] = useState({ email: '', password: '' });
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

        // Validate Gmail address
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(userData.email)) {
            newErrors.email = 'Invalid Gmail address. Only Gmail accounts are allowed.';
        }

        // Validate password (at least 6 characters)
        // if (!/^(?=.*[A-Za-z\d!@#$%^&*]){6,}$/.test(userData.password)) {
        //     newErrors.password = 'Password must be at least 6 characters long.';
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

//     const handleSubmit = async (e) => {
//       e.preventDefault();
  
//       if (!validate()) {
//           return;
//       }
  
//       try {
//           const response = await axiosInstance.post('/login', userData);
  
//           // Save the JWT token in localStorage
//           localStorage.setItem('token', response.data.token);

//           localStorage.setItem(
//             'user',
//             JSON.stringify({
//               id: response.data.user._id,
//               email: response.data.user.email,
//               name: response.data.user.name, // Assuming the backend returns the name
//               role: response.data.user.role, // If there's a role field
//             })
//           );
  
//           toast.success('Login Successful!');
//           navigate('/dashboard');  // No need for setTimeout
  
//       } catch (err) {
//           toast.error(err.response?.data?.message || 'An error occurred. Please try again.');
//       }
//   };
  

const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validate()) {
      return;
    }
  
    try {
      const response = await axiosInstance.post('/login', userData);
      
      console.log("Login Response:", response.data); // Debugging
  
      // Ensure the response contains user data
      if (!response.data.user || !response.data.user._id) {
        throw new Error("User ID not found in response.");
      }
  
      // Save the JWT token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user._id);
      
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: response.data.user._id,
          email: response.data.user.email,
          name: response.data.user.name, // Assuming the backend returns the name
        })
      );
  
      toast.success('Login Successful!');
      navigate('/dashboard');
  
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };
  
    return (
        <>
            <main>
                <Helmet>
                    <title>Login - User Management</title>
                    <meta
                        name="description"
                        content="Login to your account to access the user management system."
                    />
                </Helmet>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <div className='banner-div'></div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <div className='user-div'>
                            <h1 className='login-text'>Login to your account</h1>
                            <p className='para'>Don't have an account? <Link to={'/register'}>Register</Link></p>
                            <form onSubmit={handleSubmit}>
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
                                    <button type="submit" className='login-btn'>
                                        Login
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

export default Login;

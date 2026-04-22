import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Container, Alert, MenuItem } from '@mui/material';
import { authAPI } from '../services/api';
import { useAuth } from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterSchema = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6).required('Required'),
  role: Yup.string().required('Required'),
  phone: Yup.string().required('Required')
});

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', role: 'User', phone: '' },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await authAPI.register(values);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => navigate('/dashboard'), 1000);
      } catch (err) {
        setError(err.response?.data?.msg || 'Registration failed');
      }
    }
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>Register - CCMS PNGRB</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField margin="normal" fullWidth id="name" label="Name" {...formik.getFieldProps('name')} />
          <TextField margin="normal" fullWidth id="email" label="Email" {...formik.getFieldProps('email')} />
          <TextField 
            margin="normal" 
            fullWidth 
            id="role" 
            select 
            label="Role" 
            {...formik.getFieldProps('role')}
          >
            <MenuItem value="User">Customer</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="NodalOfficer">Nodal Officer</MenuItem>
          </TextField>
          <TextField margin="normal" fullWidth id="phone" label="Phone" {...formik.getFieldProps('phone')} />
          <TextField margin="normal" fullWidth id="password" label="Password" type="password" {...formik.getFieldProps('password')} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>Register</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;

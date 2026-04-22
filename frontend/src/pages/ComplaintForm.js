import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import QRCode from 'qrcode.react';
import { Container, Paper, Typography, TextField, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Checkbox, Button, Box, Alert, CircularProgress } from '@mui/material';
import { complaintAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const ComplaintSchema = Yup.object({
  category: Yup.string().required('Category required'),
  title: Yup.string().min(5).max(100).required('Title required'),
  description: Yup.string().min(20).required('Description required')
});

const ComplaintForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const formik = useFormik({
    initialValues: {
      category: 'Gas Supply',
      title: '',
      description: '',
      sos: false
    },
    validationSchema: ComplaintSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setSuccess('');
      try {
        const res = await complaintAPI.create(values);
        setQrCode(res.data.complaintId);
        setSuccess(`Complaint ${res.data.complaintId} created successfully!`);
        setTimeout(() => navigate('/dashboard'), 4000);
      } catch (err) {
        console.error('Complaint Error:', err.response?.data || err.message);
        alert(err.response?.data?.msg || 'Failed to create complaint');
      } finally {
        setLoading(false);
      }
    }
  });

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="warning">
          Please <a href="/login">login</a> to create a complaint
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ mb: 3 }}>
          📝 New Complaint Registration
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
          PNGRB Consumer Complaint Management System
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          {/* Category */}
          <FormControl fullWidth margin="normal" error={formik.touched.category && Boolean(formik.errors.category)}>
            <InputLabel>Complaint Category</InputLabel>
            <Select
              name="category"
              value={formik.values.category}
              label="Complaint Category"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="Gas Supply">⚡ Gas Supply Issue</MenuItem>
              <MenuItem value="Billing">💰 Billing Dispute</MenuItem>
              <MenuItem value="Safety">🚨 Safety Concern</MenuItem>
              <MenuItem value="Service">🔧 Service Request</MenuItem>
              <MenuItem value="Meter Reading">📏 Meter Reading Issue</MenuItem>
              <MenuItem value="Connection">🔌 Connection Problem</MenuItem>
            </Select>
            {formik.touched.category && formik.errors.category && (
              <Typography variant="caption" color="error">{formik.errors.category}</Typography>
            )}
          </FormControl>

          {/* Title */}
          <TextField
            fullWidth
            margin="normal"
            label="Complaint Title *"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />

          {/* Description */}
          <TextField
            fullWidth
            margin="normal"
            label="Detailed Description *"
            name="description"
            multiline
            rows={5}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />

          {/* SOS */}
          <FormControlLabel
            control={
              <Checkbox
                name="sos"
                checked={formik.values.sos}
                onChange={formik.handleChange}
                color="error"
              />
            }
            label={
              <Box>
                <Typography variant="body1" color="error.main">
                  <strong>SOS Emergency Complaint</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Will be prioritized and escalated immediately
                </Typography>
              </Box>
            }
          />

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ 
              mt: 3, 
              py: 1.8, 
              borderRadius: 2, 
              fontSize: '1.1rem',
              boxShadow: 3,
              '&:hover': { boxShadow: 6 }
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Creating Complaint...
              </>
            ) : (
              '🚀 Submit Complaint'
            )}
          </Button>
        </Box>

        {/* Success */}
        {success && (
          <Alert severity="success" sx={{ mt: 4, p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              ✅ Success!
            </Typography>
            <Typography>{success}</Typography>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <QRCode value={qrCode} size={220} />
              <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                Track ID: <code>{qrCode}</code>
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Redirecting to dashboard in 4 seconds...
            </Typography>
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default ComplaintForm;


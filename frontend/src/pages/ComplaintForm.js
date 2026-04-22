import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Container, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import QRCode from 'qrcode.react';
import { complaintAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ComplaintSchema = Yup.object({
  category: Yup.string().required(),
  title: Yup.string().required(),
  description: Yup.string().required(),
  sos: Yup.boolean()
});

const ComplaintForm = () => {
  const navigate = useNavigate();
  const [qrData, setQrData] = React.useState('');

  const formik = useFormik({
    initialValues: { category: '', title: '', description: '', sos: false },
    validationSchema: ComplaintSchema,
    onSubmit: async (values) => {
      try {
        const res = await complaintAPI.create(values);
        setQrData(res.data.complaintId);
        // Navigate to status page
        navigate(`/complaint/${res.data._id}`);
      } catch (err) {
        console.error(err);
      }
    }
  });

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        New Complaint
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select {...formik.getFieldProps('category')} label="Category">
            <MenuItem value="Gas Supply">Gas Supply Issue</MenuItem>
            <MenuItem value="Billing">Billing Dispute</MenuItem>
            <MenuItem value="Safety">Safety Concern</MenuItem>
            <MenuItem value="Service">Service Request</MenuItem>
          </Select>
        </FormControl>
        <TextField fullWidth margin="normal" label="Title" {...formik.getFieldProps('title')} />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          multiline
          rows={4}
          {...formik.getFieldProps('description')}
        />
        <Box>
          <Typography>SOS Emergency?</Typography>
          <input type="checkbox" checked={formik.values.sos} onChange={(e) => formik.setFieldValue('sos', e.target.checked)} />
        </Box>
        <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>
          Submit Complaint
        </Button>
      </Box>
      {qrData && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography>Your QR Code ID:</Typography>
          <QRCode value={qrData} size={200} />
          <Typography>{qrData}</Typography>
        </Box>
      )}
    </Container>
  );
};

export default ComplaintForm;

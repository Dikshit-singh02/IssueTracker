import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Chip, LinearProgress, Box } from '@mui/material';
import QRCode from 'qrcode.react';
import { complaintAPI } from '../services/api';
import { useParams } from 'react-router-dom';

const StatusTracker = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get complaint status by ID
    complaintAPI.getById(id).then(res => {
      setComplaint(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <LinearProgress />;

  if (!complaint) return <Typography>Complaint not found</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4">Complaint Status</Typography>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6">{complaint.complaintId}</Typography>
          <QRCode value={complaint.qrCodeData || complaint.complaintId} />
          <Box sx={{ mt: 2 }}>
            <Chip label={complaint.status} color="primary" />
            <Chip label={`Level ${complaint.escalationLevel}`} color="secondary" />
            {complaint.sos && <Chip label="SOS" color="error" />}
          </Box>
          <Typography>Description: {complaint.description}</Typography>
          <Typography>Updated: {new Date(complaint.updatedAt).toLocaleString()}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default StatusTracker;

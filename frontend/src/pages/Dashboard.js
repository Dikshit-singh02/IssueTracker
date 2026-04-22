import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../services/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, statuses: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.stats().then(res => {
      setStats(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const data = stats.statuses.map(s => ({ name: s._id, complaints: s.count, tat: s.avgTat }));

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        {user.role} Dashboard - CCMS PNGRB
      </Typography>
      
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h5">Complaint Status</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="complaints" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Overview</Typography>
                <Typography>Total: {stats.total}</Typography>
                {stats.statuses.map(status => (
                  <Chip key={status._id} label={`${status._id}: ${status.count}`} sx={{ m: 0.5 }} />
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;

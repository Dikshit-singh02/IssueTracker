import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Chip, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Box, CircularProgress, Alert
} from '@mui/material';
import {
  PieChart, Pie, BarChart, Bar, LineChart, Line, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useAuth } from '../services/AuthContext';
import { dashboardAPI } from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DashboardKPICard = ({ title, value, chipColor, trend }) => (
  <Card sx={{ height: 120 }}>
    <CardContent>
      <Typography variant="h6" color="text.secondary">{title}</Typography>
      <Typography variant="h3" fontWeight="bold">{value}</Typography>
      <Chip label={trend} color={chipColor} size="small" />
    </CardContent>
  </Card>
);

const RecentTable = ({ recent }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Title</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Escalation</TableCell>
          <TableCell>Date</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {recent.map(complaint => (
          <TableRow key={complaint.complaintId} hover>
            <TableCell>{complaint.complaintId}</TableCell>
            <TableCell>{complaint.title}</TableCell>
            <TableCell>
              <Chip label={complaint.status} size="small" color="primary" />
            </TableCell>
            <TableCell>{complaint.escalationLevel}</TableCell>
            <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const Dashboard = () => {
  const { user, token } = useAuth();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      dashboardAPI.stats()
        .then(res => {
          setData(res.data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load dashboard data');
          setLoading(false);
        });
    }
  }, [token]);

  const { totalComplaints = 0, overduePercent = 0, statusStats = [], categoryStats = [], 
          escalationStats = [], recent = [], avgResolutionDays = 0, role } = data;

  const pieData = statusStats.map((s, i) => ({
    name: s._id || 'Unknown',
    value: s.count,
    fill: COLORS[i % COLORS.length]
  }));

  const barData = categoryStats.map(cat => ({
    category: cat._id || 'Other',
    complaints: cat.count
  }));

  const escalationData = escalationStats.map(es => ({
    level: `Tier ${es._id}`,
    count: es.count
  }));

  if (loading) return <Container><CircularProgress /></Container>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h2" gutterBottom align="center" color="primary">
        CCMS PNGRB - {role} Dashboard
      </Typography>
      
      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardKPICard 
            title="Total Complaints" 
            value={totalComplaints.toLocaleString()} 
            chipColor="success"
            trend="+12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardKPICard 
            title="Overdue %" 
            value={`${overduePercent}%`} 
            chipColor="warning"
            trend="-2%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardKPICard 
            title="Avg Resolution" 
            value={`${avgResolutionDays.toFixed(1)} days`} 
            chipColor="info"
            trend="-1.2d"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardKPICard 
            title="Recent" 
            value={recent.length} 
            chipColor="secondary"
            trend="+3"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Complaint Status</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Top Categories</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="complaints" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {role === 'Admin' && escalationData.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Escalation Funnel</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={escalationData}>
                    <CartesianGrid />
                    <XAxis dataKey="level" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Recent Activity</Typography>
        <RecentTable recent={recent} />
      </Box>
    </Container>
  );
};

export default Dashboard;

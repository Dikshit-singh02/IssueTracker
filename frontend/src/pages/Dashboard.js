import React, { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAuth } from '../services/AuthContext';
import { dashboardAPI } from '../services/api';
import './Dashboard.css'; // Custom Bootstrap-like styles

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const { user, token } = useAuth();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      dashboardAPI.stats().then(res => {
        setData(res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [token]);

  const { totalComplaints = 0, overduePercent = 0, statusStats = [], categoryStats = [], recent = [], role } = data;

  const pieData = statusStats.map((s, i) => ({
    name: s._id,
    value: s.count,
    fill: COLORS[i % COLORS.length]
  }));

  const barData = categoryStats.slice(0, 6).map(cat => ({
    category: cat._id,
    complaints: cat.count
  }));

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="spinner text-center mt-5">
          <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header mb-5">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="display-4 fw-bold text-primary mb-0">
              <i className="bi bi-speedometer2 me-3"></i>
              {role} Dashboard
            </h1>
            <p className="text-muted mt-2">CCMS PNGRB - Consumer Complaint Management System</p>
          </div>
          <div className="btn-group">
            <button className="btn btn-outline-primary">
              <i className="bi bi-arrow-clockwise"></i> Refresh
            </button>
            <button className="btn btn-primary">
              <i className="bi bi-download"></i> Export
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-4 mb-5">
        <div className="col-lg-3 col-md-6">
          <div className="card kpi-card border-0 shadow h-100">
            <div className="card-body text-center p-4">
              <h2 className="fw-bold text-primary mb-2">{totalComplaints.toLocaleString()}</h2>
              <h6 className="text-muted mb-3">Total Complaints</h6>
              <span className="badge bg-success fs-6 px-3 py-2">+12%</span>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card kpi-card border-0 shadow h-100">
            <div className="card-body text-center p-4">
              <h2 className="fw-bold text-danger mb-2">{overduePercent}%</h2>
              <h6 className="text-muted mb-3">Overdue</h6>
              <span className="badge bg-warning fs-6 px-3 py-2">-2%</span>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card kpi-card border-0 shadow h-100">
            <div className="card-body text-center p-4">
              <h2 className="fw-bold text-info mb-2">{recent.length}</h2>
              <h6 className="text-muted mb-3">Recent</h6>
              <span className="badge bg-info fs-6 px-3 py-2">+3</span>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card kpi-card border-0 shadow h-100">
            <div className="card-body text-center p-4">
              <h2 className="fw-bold text-warning mb-2">3.2 days</h2>
              <h6 className="text-muted mb-3">Avg Resolution</h6>
              <span className="badge bg-light text-dark fs-6 px-3 py-2">-0.5d</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-lg-6">
          <div className="card shadow-lg border-0 h-100">
            <div className="card-header bg-gradient-primary text-white p-4">
              <i className="bi bi-pie-chart-fill me-2"></i>
              <strong>Status Distribution</strong>
            </div>
            <div className="card-body p-4">
              <div style={{width: '100%', height: 350}}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card shadow-lg border-0 h-100">
            <div className="card-header bg-gradient-info text-white p-4">
              <i className="bi bi-bar-chart-fill me-2"></i>
              <strong>Top Categories</strong>
            </div>
            <div className="card-body p-4">
              <div style={{width: '100%', height: 350}}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white p-4">
              <i className="bi bi-clock-history me-2"></i>
              <strong>Recent Activity</strong>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Escalation</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map(complaint => (
                      <tr key={complaint.complaintId}>
                        <td><span className="badge bg-info">{complaint.complaintId}</span></td>
                        <td>{complaint.title}</td>
                        <td><span className="badge bg-warning">{complaint.status}</span></td>
                        <td><span className="badge bg-danger">Tier {complaint.escalationLevel}</span></td>
                        <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow h-100 border-0">
            <div className="card-header bg-light border-bottom">
              <i className="bi bi-graph-up me-2 text-primary"></i>
              <strong>Quick Stats</strong>
            </div>
            <div className="card-body pt-3">
              <div className="d-flex justify-content-between mb-3">
                <span>Open:</span>
                <strong className="text-primary">{statusStats.find(s => s._id === 'Open')?.count || 0}</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Escalated:</span>
                <strong className="text-warning">{statusStats.find(s => s._id === 'Escalated')?.count || 0}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>TAT Breach:</span>
                <span className="badge bg-danger">{overduePercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

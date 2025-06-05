'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ApplicationData } from '../../types';
import './admin.css';

export default function AdminPage() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  useEffect(() => {
    // Load applications from localStorage
    const stored = JSON.parse(localStorage.getItem('applications') || '[]');
    setApplications(stored);
  }, []);

  const updateApplicationStatus = (id: string, newStatus: ApplicationData['status']) => {
    const updated = applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    );
    setApplications(updated);
    localStorage.setItem('applications', JSON.stringify(updated));
  };

  const deleteApplication = (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      const updated = applications.filter(app => app.id !== id);
      setApplications(updated);
      localStorage.setItem('applications', JSON.stringify(updated));
    }
  };

  const getFilteredApplications = () => {
    let filtered = [...applications];
    
    if (filter !== 'all') {
      filtered = filtered.filter(app => app.status === filter);
    }
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime();
        case 'amount':
          return (b.loanDetails?.amount || 0) - (a.loanDetails?.amount || 0);
        case 'name':
          const nameA = `${a.personalInfo?.firstName} ${a.personalInfo?.lastName}`.toLowerCase();
          const nameB = `${b.personalInfo?.firstName} ${b.personalInfo?.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'badge-success';
      case 'rejected':
        return 'badge-error';
      case 'under-review':
        return 'badge-warning';
      default:
        return 'badge-info';
    }
  };

  const filteredApplications = getFilteredApplications();

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="header-content">
          <h1>Loan Applications Admin</h1>
          <Link href="/" className="back-link">← Back to Home</Link>
        </div>
      </header>

      <div className="admin-container">
        <div className="admin-controls">
          <div className="filter-group">
            <label>Filter by Status:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Applications</option>
              <option value="submitted">Submitted</option>
              <option value="under-review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Date (Newest First)</option>
              <option value="amount">Amount (Highest First)</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
          
          <div className="stats">
            Total: {filteredApplications.length} applications
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="empty-state">
            <p>No applications found.</p>
          </div>
        ) : (
          <div className="applications-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Purpose</th>
                  <th>Income</th>
                  <th>DTI Ratio</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => {
                  const monthlyIncome = (app.financialInfo?.monthlyIncome || 0) + 
                                      (app.financialInfo?.otherMonthlyIncome || 0);
                  const monthlyDebt = (app.personalInfo?.monthlyHousingPayment || 0) +
                                    (app.financialInfo?.monthlyExpenses || 0) +
                                    (app.loanDetails?.monthlyPayment || 0);
                  const dtiRatio = monthlyIncome > 0 ? (monthlyDebt / monthlyIncome * 100).toFixed(1) : 'N/A';
                  
                  return (
                    <tr key={app.id}>
                      <td className="id-cell">{app.id}</td>
                      <td>{app.personalInfo?.firstName} {app.personalInfo?.lastName}</td>
                      <td>${app.loanDetails?.amount?.toLocaleString()}</td>
                      <td>{app.loanDetails?.purpose?.replace('-', ' ')}</td>
                      <td>${monthlyIncome.toLocaleString()}/mo</td>
                      <td>{dtiRatio}%</td>
                      <td>{new Date(app.submittedAt!).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(app.status)}`}>
                          {app.status?.replace('-', ' ')}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="view-btn"
                            onClick={() => window.open(`/status/${app.id}`, '_blank')}
                          >
                            View
                          </button>
                          <select
                            className="status-select"
                            value={app.status}
                            onChange={(e) => updateApplicationStatus(app.id!, e.target.value as any)}
                          >
                            <option value="submitted">Submitted</option>
                            <option value="under-review">Under Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <button 
                            className="delete-btn"
                            onClick={() => deleteApplication(app.id!)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
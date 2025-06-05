'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ApplicationData } from '../../../types';

export default function StatusPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<ApplicationData | null>(null);

  useEffect(() => {
    if (params.id === 'submitted') {
      // Show generic success message
      return;
    }

    // Try to find the application in localStorage
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const found = applications.find((app: ApplicationData) => app.id === params.id);
    
    if (found) {
      setApplication(found);
    } else {
      router.push('/');
    }
  }, [params.id, router]);

  if (params.id === 'submitted') {
    return (
      <div className="status-page">
        <div className="status-container success">
          <div className="status-icon">✓</div>
          <h1>Application Submitted Successfully!</h1>
          <p>
            Thank you for your loan application. We have received your information and will 
            review it shortly. You should receive a decision within 1-2 business days.
          </p>
          <p>
            A confirmation email has been sent to the email address you provided. 
            Please check your spam folder if you don't see it in your inbox.
          </p>
          <div className="status-actions">
            <Link href="/" className="btn btn-primary">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="status-page">
        <div className="status-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'under-review':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getStatusMessage = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'Your loan has been approved! You will receive further instructions via email.';
      case 'rejected':
        return 'Unfortunately, your loan application was not approved at this time.';
      case 'under-review':
        return 'Your application is currently under review. We will notify you once a decision is made.';
      default:
        return 'Your application has been submitted and is awaiting review.';
    }
  };

  return (
    <div className="status-page">
      <div className={`status-container ${getStatusColor(application.status)}`}>
        <h1>Application Status</h1>
        <p className="application-id">Application ID: {application.id}</p>
        
        <div className="status-badge">
          {application.status?.replace('-', ' ').toUpperCase()}
        </div>
        
        <p className="status-message">{getStatusMessage(application.status)}</p>
        
        <div className="application-details">
          <h3>Application Summary</h3>
          <div className="detail-item">
            <span>Loan Amount:</span>
            <strong>${application.loanDetails?.amount?.toLocaleString()}</strong>
          </div>
          <div className="detail-item">
            <span>Loan Purpose:</span>
            <strong>{application.loanDetails?.purpose?.replace('-', ' ')}</strong>
          </div>
          <div className="detail-item">
            <span>Term:</span>
            <strong>{application.loanDetails?.term} months</strong>
          </div>
          <div className="detail-item">
            <span>Submitted:</span>
            <strong>{new Date(application.submittedAt!).toLocaleString()}</strong>
          </div>
        </div>
        
        <div className="status-actions">
          <Link href="/" className="btn btn-primary">
            Return to Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        .status-page {
          min-height: 100vh;
          background-color: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .status-container {
          max-width: 600px;
          width: 100%;
          background-color: white;
          border-radius: 8px;
          padding: 3rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .status-container.success {
          border-top: 4px solid #4caf50;
        }

        .status-container.error {
          border-top: 4px solid #f44336;
        }

        .status-container.warning {
          border-top: 4px solid #ff9800;
        }

        .status-container.info {
          border-top: 4px solid #2196f3;
        }

        .status-icon {
          width: 80px;
          height: 80px;
          background-color: #4caf50;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          margin: 0 auto 2rem;
        }

        h1 {
          margin: 0 0 1rem 0;
          color: #333;
        }

        p {
          margin: 0 0 1rem 0;
          color: #666;
          line-height: 1.6;
        }

        .application-id {
          font-size: 0.875rem;
          color: #999;
        }

        .status-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 600;
          margin: 1rem 0;
        }

        .success .status-badge {
          background-color: #e8f5e9;
          color: #2e7d32;
        }

        .error .status-badge {
          background-color: #ffebee;
          color: #c62828;
        }

        .warning .status-badge {
          background-color: #fff3e0;
          color: #e65100;
        }

        .info .status-badge {
          background-color: #e3f2fd;
          color: #1565c0;
        }

        .status-message {
          font-size: 1.1rem;
          margin: 1rem 0 2rem;
        }

        .application-details {
          background-color: #f5f5f5;
          padding: 1.5rem;
          border-radius: 4px;
          margin: 2rem 0;
          text-align: left;
        }

        .application-details h3 {
          margin: 0 0 1rem 0;
          color: #333;
          font-size: 1.1rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .detail-item span {
          color: #666;
        }

        .detail-item strong {
          color: #333;
        }

        .status-actions {
          margin-top: 2rem;
        }

        .btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.3s;
        }

        .btn-primary {
          background-color: #1a73e8;
          color: white;
        }

        .btn-primary:hover {
          background-color: #1557b0;
        }
      `}</style>
    </div>
  );
}
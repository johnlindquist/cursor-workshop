'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { calculateMonthlyPayment } from '../lib/validations';
import './home.css';

export default function HomePage() {
  const [loanAmount, setLoanAmount] = useState(10000);
  const [loanTerm, setLoanTerm] = useState(36);
  const [interestRate] = useState(15); // Fixed APR for demo
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    const payment = calculateMonthlyPayment(loanAmount, loanTerm, interestRate / 100);
    setMonthlyPayment(payment);
  }, [loanAmount, loanTerm, interestRate]);

  return (
    <div className="home-page">
      <header className="header">
        <div className="container">
          <h1 className="logo">QuickLoan</h1>
          <nav className="nav">
            <Link href="/apply" className="nav-link">Apply Now</Link>
            <Link href="/admin" className="nav-link">Admin</Link>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h2 className="hero-title">Personal Loans Made Simple</h2>
            <p className="hero-subtitle">
              Get the funds you need with competitive rates and flexible terms. 
              Apply online in minutes.
            </p>
            <Link href="/apply" className="cta-button">
              Start Your Application
            </Link>
          </div>
        </div>
      </section>

      <section className="calculator-section">
        <div className="container">
          <h3 className="section-title">Loan Calculator</h3>
          <div className="calculator">
            <div className="calculator-inputs">
              <div className="input-group">
                <label htmlFor="amount">Loan Amount</label>
                <div className="range-container">
                  <input
                    type="range"
                    id="amount"
                    min="1000"
                    max="50000"
                    step="1000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                  />
                  <span className="range-value">${loanAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="term">Loan Term</label>
                <div className="range-container">
                  <input
                    type="range"
                    id="term"
                    min="12"
                    max="84"
                    step="12"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                  />
                  <span className="range-value">{loanTerm} months</span>
                </div>
              </div>
            </div>

            <div className="calculator-result">
              <div className="result-item">
                <span>Estimated Monthly Payment</span>
                <strong>${monthlyPayment.toFixed(2)}</strong>
              </div>
              <div className="result-item">
                <span>Total Interest</span>
                <strong>${((monthlyPayment * loanTerm) - loanAmount).toFixed(2)}</strong>
              </div>
              <div className="result-item">
                <span>Total Repayment</span>
                <strong>${(monthlyPayment * loanTerm).toFixed(2)}</strong>
              </div>
              <div className="result-item">
                <span>APR</span>
                <strong>{interestRate}%</strong>
              </div>
            </div>

            <Link href="/apply" className="apply-button">
              Apply for ${loanAmount.toLocaleString()}
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h3 className="section-title">Why Choose QuickLoan?</h3>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h4>Fast Approval</h4>
              <p>Get a decision in minutes, not days</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💰</div>
              <h4>Competitive Rates</h4>
              <p>Rates starting from 15% APR</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h4>Secure Process</h4>
              <p>Your information is safe with us</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📱</div>
              <h4>100% Online</h4>
              <p>Apply from anywhere, anytime</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 QuickLoan. This is a demo application for testing purposes.</p>
        </div>
      </footer>
    </div>
  );
}
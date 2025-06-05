import { ReactNode } from 'react';
import './apply.css';

export default function ApplyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="apply-layout">
      <div className="apply-container">
        {children}
      </div>
    </div>
  );
}
import React from 'react';

interface DepartmentCardProps {
  name: string;
  href: string;
  description?: string;
}

export default function DepartmentCard({ name, href, description }: DepartmentCardProps) {
  return (
    <a href={href} className="department-card">
      <div class="card-decoration"></div>
      <div className="card-content">
        <div className="department-icon-wrapper">
          <span className="department-icon">🎓</span>
        </div>
        <h3 className="department-name">{name}</h3>
        {description && <p className="department-description">{description}</p>}
        <div className="view-link-wrapper">
          <span className="view-link">View Materials</span>
          <span className="arrow">→</span>
        </div>
      </div>
      
      <style>{`
        .department-card {
          position: relative;
          display: block;
          background: var(--surface-elevated);
          border: 2px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          box-shadow: var(--shadow);
          transition: all var(--transition-base);
          text-decoration: none;
          color: inherit;
          overflow: hidden;
        }

        .department-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gradient-primary);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform var(--transition-base);
        }

        .department-card:hover::before {
          transform: scaleX(1);
        }

        .department-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
          border-color: var(--primary-300);
          background: var(--gradient-card);
        }

        .card-decoration {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 100px;
          height: 100px;
          background: var(--gradient-accent);
          opacity: 0.1;
          border-radius: 50%;
          transition: all var(--transition-base);
        }

        .department-card:hover .card-decoration {
          opacity: 0.15;
          transform: scale(1.2);
        }

        .card-content {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .department-icon-wrapper {
          display: inline-flex;
          width: 3.5rem;
          height: 3.5rem;
          background: var(--gradient-primary);
          border-radius: var(--radius-md);
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-md);
          transition: all var(--transition-base);
        }

        .department-card:hover .department-icon-wrapper {
          transform: scale(1.1) rotate(5deg);
          box-shadow: var(--shadow-lg);
        }

        .department-icon {
          font-size: 2rem;
          filter: grayscale(0);
        }

        .department-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          letter-spacing: -0.015em;
        }

        .department-description {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin: 0;
          line-height: 1.5;
        }

        .view-link-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: var(--spacing-sm);
        }

        .view-link {
          color: var(--primary);
          font-weight: 600;
          font-size: 0.95rem;
          transition: color var(--transition-base);
        }

        .department-card:hover .view-link {
          color: var(--primary-hover);
        }

        .arrow {
          color: var(--primary);
          font-weight: 700;
          transition: all var(--transition-base);
        }

        .department-card:hover .arrow {
          transform: translateX(4px);
          color: var(--primary-hover);
        }
      `}</style>
    </a>
  );
}

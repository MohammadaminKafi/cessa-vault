import React, { useState, useMemo } from 'react';
import type { CourseStructure } from '../utils/dataScanner';

interface MaterialBrowserProps {
  materials: CourseStructure[];
  department: string;
}

export default function MaterialBrowser({ materials, department }: MaterialBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState<'course' | 'instructor' | 'type'>('course');

  // Extract unique values for filters
  const courses = useMemo(() => {
    const uniqueCourses = new Set(materials.map(m => m.course));
    return Array.from(uniqueCourses).sort();
  }, [materials]);

  const types = useMemo(() => {
    const uniqueTypes = new Set(materials.map(m => m.type));
    return Array.from(uniqueTypes).sort();
  }, [materials]);

  // Filter and sort materials
  const filteredMaterials = useMemo(() => {
    let filtered = materials;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => {
        const courseDisplayName = (m.courseDisplayName || m.course).toLowerCase();
        const instructorDisplayName = (m.instructorDisplayName || m.instructor).toLowerCase();
        return courseDisplayName.includes(query) ||
               instructorDisplayName.includes(query) ||
               m.type.toLowerCase().includes(query);
      });
    }

    // Apply course filter
    if (filterCourse !== 'all') {
      filtered = filtered.filter(m => m.course === filterCourse);
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(m => m.type === filterType);
    }

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      return aVal.localeCompare(bVal);
    });

    return filtered;
  }, [materials, searchQuery, filterCourse, filterType, sortBy]);

  return (
    <div className="material-browser">
      {/* Search and Filters */}
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search courses, instructors, or types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <label htmlFor="course-filter">Course:</label>
            <select
              id="course-filter"
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Courses</option>
              {courses.map(course => {
                const courseDisplay = materials.find(m => m.course === course)?.courseDisplayName || course;
                return (
                  <option key={course} value={course}>
                    {courseDisplay}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type-filter">Type:</label>
            <select
              id="type-filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-by">Sort by:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'course' | 'instructor' | 'type')}
              className="filter-select"
            >
              <option value="course">Course</option>
              <option value="instructor">Instructor</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="results">
        <p className="results-count">
          {filteredMaterials.length} {filteredMaterials.length === 1 ? 'result' : 'results'} found
        </p>

        {filteredMaterials.length === 0 ? (
          <div className="empty-results">
            <p>No materials found matching your criteria.</p>
          </div>
        ) : (
          <div className="materials-grid">
            {filteredMaterials.map((material, index) => (
              <a
                key={index}
                href={`/${material.department}/${material.course}/${material.instructor}/${material.type}/`}
                className="material-card"
              >
                <div className="material-header">
                  <h3 className="course-name">{material.courseDisplayName || material.course}</h3>
                </div>
                <p className="instructor-name">👤 {material.instructorDisplayName || material.instructor}</p>
                <div className="material-footer">
                  <p className="file-count">📁 {material.files.length} file{material.files.length !== 1 ? 's' : ''}</p>
                  <span className="type-badge">{material.typeDisplayName || material.type}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .material-browser {
          width: 100%;
        }

        .controls {
          background: var(--gradient-card);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          margin-bottom: var(--spacing-xl);
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow);
        }

        .search-box {
          margin-bottom: var(--spacing-lg);
        }

        .search-input {
          width: 100%;
          padding: 0.875rem 1.25rem;
          border: 2px solid var(--border);
          border-radius: var(--radius-md);
          font-size: 1rem;
          transition: all var(--transition-base);
          background: var(--surface-elevated);
          font-family: var(--font-sans);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-100);
        }

        .search-input::placeholder {
          color: var(--text-tertiary);
        }

        .filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-md);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-group label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .filter-select {
          padding: 0.625rem 0.875rem;
          border: 2px solid var(--border);
          border-radius: var(--radius);
          font-size: 0.95rem;
          background: var(--surface-elevated);
          cursor: pointer;
          transition: all var(--transition-base);
          font-family: var(--font-sans);
        }

        .filter-select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-100);
        }

        .filter-select:hover {
          border-color: var(--primary-300);
        }

        .results-count {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin-bottom: var(--spacing-lg);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .results-count::before {
          content: '📊';
          font-size: 1.2rem;
        }

        .empty-results {
          background: var(--surface);
          border: 2px dashed var(--border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-3xl);
          text-align: center;
          color: var(--text-secondary);
        }

        .empty-results::before {
          content: '🔍';
          display: block;
          font-size: 4rem;
          margin-bottom: var(--spacing-md);
          opacity: 0.5;
        }

        .materials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--spacing-lg);
        }

        .material-card {
          position: relative;
          background: var(--surface-elevated);
          border: 2px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          box-shadow: var(--shadow);
          transition: all var(--transition-base);
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          overflow: hidden;
        }

        .material-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gradient-accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform var(--transition-base);
        }

        .material-card:hover::before {
          transform: scaleX(1);
        }

        .material-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
          border-color: var(--accent-400);
          background: var(--gradient-card);
        }

        .material-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--spacing-md);
        }

        .course-name {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.3;
          letter-spacing: -0.015em;
        }

        .instructor-name {
          color: var(--text-secondary);
          font-size: 0.95rem;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .material-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--spacing-md);
          padding-top: var(--spacing-sm);
          border-top: 1px solid var(--border-light);
          margin-top: auto;
        }

        .file-count {
          color: var(--primary);
          font-size: 0.9rem;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }

        .type-badge {
          background: var(--gradient-accent);
          color: var(--text-on-accent);
          padding: 0.375rem 0.875rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: var(--shadow-sm);
          text-transform: capitalize;
          letter-spacing: 0.025em;
        }

        @media (max-width: 768px) {
          .materials-grid {
            grid-template-columns: 1fr;
          }

          .filters {
            grid-template-columns: 1fr;
          }

          .controls {
            padding: var(--spacing-lg);
          }
        }
      `}</style>
    </div>
  );
}

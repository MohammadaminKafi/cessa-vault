import React, { useState } from 'react';
import type { FileItem } from '../utils/dataScanner';

interface FileListProps {
  files: FileItem[];
  basePath: string;
}

export default function FileList({ files, basePath }: FileListProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<{ url: string; name: string; type: 'pdf' | 'image' } | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (extension?: string): string => {
    if (!extension) return '📁';
    
    const ext = extension.toLowerCase();
    if (['.pdf'].includes(ext)) return '📄';
    if (['.doc', '.docx'].includes(ext)) return '📝';
    if (['.ppt', '.pptx'].includes(ext)) return '📊';
    if (['.xls', '.xlsx'].includes(ext)) return '📈';
    if (['.zip', '.rar', '.7z'].includes(ext)) return '🗜️';
    if (['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(ext)) return '🖼️';
    if (['.mp4', '.avi', '.mov'].includes(ext)) return '🎥';
    if (['.mp3', '.wav'].includes(ext)) return '🎵';
    if (['.txt', '.md'].includes(ext)) return '📃';
    if (['.py', '.js', '.java', '.cpp', '.c'].includes(ext)) return '💻';
    
    return '📄';
  };

  const handleDownload = (file: FileItem) => {
    // The file path needs to be relative to public/data
    const relativePath = file.path.split('/public/data/')[1];
    const downloadUrl = `/data/${relativePath}`;
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isViewable = (extension?: string): boolean => {
    if (!extension) return false;
    const ext = extension.toLowerCase();
    const viewableExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
    return viewableExtensions.includes(ext);
  };

  const handleView = (file: FileItem) => {
    const relativePath = file.path.split('/public/data/')[1];
    const fileUrl = `/data/${relativePath}`;
    const ext = file.extension?.toLowerCase();
    
    if (ext === '.pdf') {
      setCurrentFile({ url: fileUrl, name: file.name, type: 'pdf' });
    } else if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext || '')) {
      setCurrentFile({ url: fileUrl, name: file.name, type: 'image' });
    }
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setCurrentFile(null);
  };

  return (
    <div className="file-list">
      {files.length === 0 ? (
        <div className="empty-state">
          <p>No files found in this location.</p>
        </div>
      ) : (
        <div className="files">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <div className="file-info">
                <span className="file-icon">{getFileIcon(file.extension)}</span>
                <div className="file-details">
                  <span className="file-name">{file.name}</span>
                  {file.size && (
                    <span className="file-size">{formatFileSize(file.size)}</span>
                  )}
                </div>
              </div>
              
              {file.type === 'file' && (
                <div className="file-actions">
                  {isViewable(file.extension) && (
                    <button
                      onClick={() => handleView(file)}
                      className="view-btn"
                      title="View file"
                    >
                      👁️ View
                    </button>
                  )}
                  <button
                    onClick={() => handleDownload(file)}
                    className="download-btn"
                    title="Download file"
                  >
                    ⬇️ Download
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* File Viewer Modal */}
      {viewerOpen && currentFile && (
        <div className="modal-overlay" onClick={closeViewer}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{currentFile.name}</h3>
              <button className="close-btn" onClick={closeViewer} title="Close">
                ✕
              </button>
            </div>
            <div className="modal-body">
              {currentFile.type === 'pdf' ? (
                <iframe
                  src={currentFile.url}
                  className="pdf-viewer"
                  title={currentFile.name}
                />
              ) : (
                <img
                  src={currentFile.url}
                  alt={currentFile.name}
                  className="image-viewer"
                />
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .file-list {
          width: 100%;
        }

        .empty-state {
          background: var(--surface);
          border: 2px dashed var(--border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-3xl);
          text-align: center;
          color: var(--text-secondary);
        }

        .empty-state::before {
          content: '📂';
          display: block;
          font-size: 4rem;
          margin-bottom: var(--spacing-md);
          opacity: 0.5;
        }

        .files {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-lg);
          background: var(--surface-elevated);
          border: 2px solid var(--border);
          border-radius: var(--radius-md);
          transition: all var(--transition-base);
          position: relative;
          overflow: hidden;
        }

        .file-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: var(--gradient-primary);
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform var(--transition-base);
        }

        .file-item:hover::before {
          transform: scaleY(1);
        }

        .file-item:hover {
          border-color: var(--primary-300);
          box-shadow: var(--shadow-md);
          background: var(--gradient-card);
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          flex: 1;
          min-width: 0;
        }

        .file-icon {
          font-size: 2rem;
          flex-shrink: 0;
          transition: transform var(--transition-base);
        }

        .file-item:hover .file-icon {
          transform: scale(1.1);
        }

        .file-details {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          min-width: 0;
          flex: 1;
        }

        .file-name {
          font-weight: 600;
          color: var(--text-primary);
          word-break: break-word;
          font-size: 1rem;
        }

        .file-size {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .file-size::before {
          content: '💾';
          font-size: 0.9rem;
        }

        .file-actions {
          display: flex;
          gap: var(--spacing-sm);
          flex-shrink: 0;
        }

        .view-btn,
        .download-btn {
          padding: 0.625rem 1.25rem;
          border: none;
          border-radius: var(--radius);
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .view-btn {
          background: var(--gradient-primary);
          color: white;
        }

        .view-btn:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .download-btn {
          background: var(--gradient-accent);
          color: var(--text-on-accent);
        }

        .download-btn:hover {
          background: var(--accent-dark);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .download-btn:active {
          transform: translateY(0);
          box-shadow: var(--shadow-sm);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--spacing-lg);
          backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-content {
          background: var(--surface-elevated);
          border-radius: var(--radius-xl);
          max-width: 95vw;
          max-height: 95vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-lg) var(--spacing-xl);
          border-bottom: 2px solid var(--border);
          background: var(--gradient-card);
          border-radius: var(--radius-xl) var(--radius-xl) 0 0;
        }

        .modal-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          word-break: break-word;
          padding-right: var(--spacing-md);
        }

        .close-btn {
          background: var(--surface);
          border: 2px solid var(--border);
          color: var(--text-secondary);
          width: 2.5rem;
          height: 2.5rem;
          border-radius: var(--radius-full);
          font-size: 1.5rem;
          cursor: pointer;
          transition: all var(--transition-base);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-weight: 300;
          line-height: 1;
        }

        .close-btn:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          transform: rotate(90deg);
        }

        .modal-body {
          flex: 1;
          overflow: auto;
          padding: var(--spacing-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--surface);
          border-radius: 0 0 var(--radius-xl) var(--radius-xl);
        }

        .pdf-viewer {
          width: 100%;
          height: 80vh;
          border: none;
          border-radius: var(--radius-md);
          background: white;
        }

        .image-viewer {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
        }

        @media (max-width: 768px) {
          .file-item {
            flex-direction: column;
            align-items: stretch;
            gap: var(--spacing-md);
          }

          .file-actions {
            width: 100%;
            flex-direction: column;
          }

          .view-btn,
          .download-btn {
            width: 100%;
            justify-content: center;
          }

          .file-info {
            width: 100%;
          }

          .modal-overlay {
            padding: var(--spacing-sm);
          }

          .modal-header {
            padding: var(--spacing-md);
          }

          .modal-title {
            font-size: 1rem;
          }

          .close-btn {
            width: 2rem;
            height: 2rem;
            font-size: 1.25rem;
          }

          .pdf-viewer,
          .image-viewer {
            max-height: 70vh;
          }
        }
      `}</style>
    </div>
  );
}

import React from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, AlertCircle } from 'lucide-react';
import styles from '../../styles/custom/customTable.module.scss';

const CustomTable = ({ 
  headers, 
  data, 
  onView, 
  onCancel, 
  statusColors = {
    Present: '#C3F4D0',  // Light green
    Absent: '#FFCECE',   // Light red
    Pending: '#FFE9C0',  // Light orange
    Confirmed: '#C3F4D0', // Light green (legacy)
    Cancelled: '#FFCECE', // Light red (legacy)
    open: '#C3F4D0',     // Light green for course status
    closed: '#FFCECE'    // Light red for course status
  },
  showActionColumn = true,
  onRowClick = null,
  role = 'student' // default to student
}) => {
  // Add debugging log
  console.log("CustomTable rendered with data:", data);

  const handleViewClick = (row, e) => {
    e.stopPropagation(); // Prevent row click from firing
    console.log("View button clicked for row:", row);
    if (onView) {
      onView(row);
    }
  };

  const handleCancelClick = (row, e) => {
    e.stopPropagation(); // Prevent row click from firing
    console.log("Cancel button clicked for row:", row);
    if (onCancel) {
      onCancel(row);
    }
  };

  const handleRowClick = (row) => {
    if (onRowClick) {
      onRowClick(row);
    } else if (onView && !showActionColumn) {
      // If no specific row click handler and we're not showing action column,
      // treat row click as view click
      onView(row);
    }
  };

  // Convert headers to lowercase for more reliable matching
  const normalizedHeaders = headers.map(header => 
    header.toLowerCase().replace(/\s+/g, '')
  );

  // Render custom cell content based on type
  const renderCustomCell = (header, value, rowIndex) => {
    // Handle availability display
    if (header.toLowerCase() === 'availability' && value && value.type === 'availability') {
      return (
        <td key={`${rowIndex}-${header}`}>
          {value.status === 'open' ? (
            <span style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 8px',
              backgroundColor: statusColors.open,
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              color: '#2E7D32'
            }}>
              {value.seats - value.enrolled} / {value.seats}
            </span>
          ) : (
            <span style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              backgroundColor: statusColors.closed,
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              color: '#E53935'
            }}>
              <AlertCircle size={12} />
              Full
            </span>
          )}
        </td>
      );
    }

    // Handle action buttons
    if (header.toLowerCase() === 'action' && value && value.type === 'action') {
      return (
        <td key={`${rowIndex}-${header}`} className={styles.actionsCell}>
          {value.selected ? (
            <button 
              className={styles.viewButton}
              style={{
                backgroundColor: '#e8f5e9',
                color: '#2E7D32',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px'
              }}
              onClick={(e) => handleViewClick(data[rowIndex], e)}
            >
              <CheckCircle size={14} />
              {role === 'admin' ? 'Edit' : 'Selected'}
            </button>
          ) : (
            <button 
              className={styles.viewButton}
              style={{
                opacity: value.disabled ? 0.5 : 1,
                cursor: value.disabled ? 'not-allowed' : 'pointer'
              }}
              onClick={(e) => !value.disabled && handleViewClick(data[rowIndex], e)}
              disabled={value.disabled}
            >
              {role === 'admin' ? 'Edit' : 'Select'}
            </button>
          )}
        </td>
      );
    }

    return null;
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.customTable}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              onClick={() => handleRowClick(row)}
              style={{ 
                cursor: (onRowClick || (!showActionColumn && onView)) ? 'pointer' : 'default',
                opacity: row.status === 'closed' ? 0.7 : 1,
                backgroundColor: row.status === 'closed' ? '#f9f9f9' : undefined
              }}
            >
              {normalizedHeaders.map((header, cellIndex) => {
                // Skip rendering special columns that will be handled separately
                if ((header === 'actions' && showActionColumn) || 
                    (header === 'availability' && row[header] && row[header].type === 'availability') ||
                    (header === 'action' && row[header] && row[header].type === 'action')) {
                  return null;
                }
                
                // Try to find the matching property in the row data
                const exactHeader = headers[cellIndex];
                const key = Object.keys(row).find(k => 
                  k === exactHeader || // Try exact match first
                  k.toLowerCase().replace(/\s+/g, '') === header ||
                  k.toLowerCase() === header
                );
                
                if (!key) return <td key={cellIndex}>-</td>;
                
                // For the status cell, apply custom styling
                if (key === 'status' || header === 'status') {
                  const statusColor = statusColors[row[key]] || '#e0e0e0';
                  return (
                    <td key={cellIndex}>
                      <span 
                        className={styles.statusPill}
                        style={{ backgroundColor: statusColor }}
                      >
                        {row[key]}
                      </span>
                    </td>
                  );
                }
                
                // For all other cells
                return <td key={cellIndex}>{row[key]}</td>;
              })}
              
              {/* Handle custom cell types */}
              {headers.map((header, index) => {
                const normalizedHeader = normalizedHeaders[index];
                const value = row[header] || row[normalizedHeader];
                
                if ((normalizedHeader === 'availability' && value && value.type === 'availability') ||
                    (normalizedHeader === 'action' && value && value.type === 'action')) {
                  return renderCustomCell(header, value, rowIndex);
                }
                return null;
              })}
              
              {/* Standard Actions column */}
              {showActionColumn && row.actions && headers.includes('Actions') && (
                <td className={styles.actionsCell}>
                  {row.actions.view && (
                    <button 
                      className={styles.viewButton}
                      onClick={(e) => handleViewClick(row, e)}
                    >
                      {role === 'admin' ? 'Edit' : 'View'}
                    </button>
                  )}
                  {row.actions.cancel && (
                    <button 
                      className={styles.cancelButton}
                      onClick={(e) => handleCancelClick(row, e)}
                    >
                      {role === 'admin' ? 'Delete' : 'Cancel'}
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

CustomTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onView: PropTypes.func,
  onCancel: PropTypes.func,
  statusColors: PropTypes.object,
  showActionColumn: PropTypes.bool,
  onRowClick: PropTypes.func,
  role: PropTypes.string
};

export default CustomTable; 
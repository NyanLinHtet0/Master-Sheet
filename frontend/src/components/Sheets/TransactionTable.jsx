import { useState } from 'react';
import styles from '../../pages/Sheets.module.css';

export default function TransactionTable({ title, data, type, corpname, onDelete, onUpdate }) {
  const isBaht = corpname && corpname.includes('ဝယ်စာရင်း');
  const isEmpty = !data || data.length === 0;

  const [isTableEditMode, setIsTableEditMode] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState(null); 
  const [editFormData, setEditFormData] = useState({});

  const handleEditClick = (tx) => {
    setEditingRowIndex(tx.originalIndex);
    const formattedDate = new Date(tx.date).toISOString().split('T')[0];
    setEditFormData({ ...tx, date: formattedDate });
  };

  const handleSaveClick = () => {
    onUpdate(editingRowIndex, editFormData);
    setEditingRowIndex(null);
  };

  const handleInputChange = (e, field) => {
    setEditFormData({ ...editFormData, [field]: e.target.value });
  };

  return (
    <>
      <div className={styles.txHeader}>
        <h3 className={styles.tableTitle}>{title}</h3>
        {!isEmpty && (
          <button onClick={() => { setIsTableEditMode(!isTableEditMode); setEditingRowIndex(null); }}>
            {isTableEditMode ? 'Done' : 'Edit Table'}
          </button>
        )}
      </div>

      <div className={styles.tableScroll}>
        {isEmpty ? (
          <p style={{ padding: '15px', color: 'var(--text-muted)' }}>No transactions yet.</p>
        ) : (
          <table className={styles.txTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                {isBaht ? (
                  <>
                    <th>Baht</th>
                    <th>Rate</th>
                    <th>Total MMK</th>
                  </>
                ) : (
                  <th>Amount</th>
                )}
                {isTableEditMode && <th>Actions</th>} 
              </tr>
            </thead>
            <tbody>
              {data.map((tx, index) => {
                const isEditingThisRow = editingRowIndex === tx.originalIndex;
                return (
                  <tr key={index}>
                    {isEditingThisRow ? (
                      <>
                        <td><input type="date" value={editFormData.date} onChange={(e) => handleInputChange(e, 'date')} /></td>
                        <td><input type="text" value={editFormData.description} onChange={(e) => handleInputChange(e, 'description')} /></td>
                        {isBaht ? (
                          <>
                            <td><input type="number" value={editFormData.amount} onChange={(e) => handleInputChange(e, 'amount')} /></td>
                            <td><input type="number" value={editFormData.rate} onChange={(e) => handleInputChange(e, 'rate')} /></td>
                            <td style={{ fontSize: '0.8rem', color: 'gray' }}>Auto-calc</td>
                          </>
                        ) : (
                          <td><input type="number" value={editFormData.amount} onChange={(e) => handleInputChange(e, 'amount')} /></td>
                        )}
                        <td style={{ display: 'flex', gap: '5px' }}>
                          <button onClick={handleSaveClick}>Save</button>
                          <button onClick={() => setEditingRowIndex(null)}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{new Date(tx.date).toLocaleDateString()}</td>
                        <td>{tx.description}</td>
                        <td style={{ color: type === 'income' ? 'green' : 'red', fontWeight: 'bold' }}>{Number(tx.amount).toLocaleString()}</td>
                        {isBaht && (
                          <>
                            <td>{tx.rate.toFixed(2) || '-'}</td>
                            <td style={{ color: type === 'income' ? 'green' : 'red', fontWeight: 'bold' }}>
                              {tx.total_mmk ? Number(tx.total_mmk).toLocaleString() : '-'}
                            </td>
                          </>
                        )}
                        {isTableEditMode && (
                          <td style={{ display: 'flex', gap: '5px' }}>
                            <button onClick={() => handleEditClick(tx)}>✎ Edit</button>
                            <button onClick={() => onDelete(tx.originalIndex)}>🗑 Delete</button>
                          </td>
                        )}
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
import React, { useState } from 'react';
import TransactionForm from './TransactionForm';
import TransactionTable from './TransactionTable';
import SaveButton from './SaveButton';
import styles from '../../pages/Sheets.module.css';

export default function CorpDetails({ selectedCorp, onAddTransaction, onDeleteTransaction, onUpdateTransaction, isDirty, onSave }) {
  // State to handle toggling between Single and Split table views
  const [isSingleTableView, setIsSingleTableView] = useState(false);

  // Clean, centered default view when no corporation is selected
  if (!selectedCorp) {
    return (
      <div className={styles.corpDetails} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Select a Corporation</h2>
        <p>Click on a corporation from the sidebar to view details and add transactions.</p>
      </div>
    );
  }

  const transactions = selectedCorp.transactions || [];
  const txWithIndex = transactions.map((tx, index) => ({ ...tx, originalIndex: index }));

  const incomeTx = txWithIndex.filter(tx => tx.amount >= 0);
  const expenseTx = txWithIndex.filter(tx => tx.amount < 0);

  const isForeign = selectedCorp.name && selectedCorp.name.includes('ဝယ်စာရင်း');
  const currencyName = isForeign ? selectedCorp.name.replace('ဝယ်စာရင်း', '').trim() : '';

  const currentRate = (isForeign && Number(selectedCorp.total_foreign)) 
    ? (Number(selectedCorp.total_mmk || 0) / Number(selectedCorp.total_foreign)).toLocaleString(undefined, { maximumFractionDigits: 2 }) 
    : '-';

  return (
    <div className={styles.corpDetails}>
      {/* Save Button Header Container */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, fontSize: '24px', color: 'var(--text-main)' }}>{selectedCorp.name}</h2>
        <div>
          <SaveButton isDirty={isDirty} onSave={onSave} />
        </div>
      </div>

      {/* Balance and Toggle Container */}
      <div className={styles.balanceContainer} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: '600' }}>Balance: {Number(selectedCorp.total_mmk || 0).toLocaleString()} MMK</span>
          {isForeign && (
            <>
              <span className={styles.divider}>|</span>
              <span className={styles.foreignText} style={{ fontWeight: '600' }}>
                {currencyName} Balance: {Number(selectedCorp.total_foreign || 0).toLocaleString()}
              </span>
              <span className={styles.divider}>|</span>
              <span className={styles.rateText}>Rate: {currentRate}</span>
            </>
          )}
        </div>
        
        {/* Toggle View Button */}
        <button 
          onClick={() => setIsSingleTableView(!isSingleTableView)}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontWeight: '600',
            color: 'var(--text-main)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        >
          {isSingleTableView ? 'Split View' : 'Single View'}
        </button>
      </div>

      <TransactionForm onSubmit={onAddTransaction} corpname={selectedCorp.name} />

      <div className={styles.tablesContainer}>
        {isSingleTableView ? (
          // --- Single Combined View ---
          <div className={styles.tableWrapper} style={{ width: '100%' }}>
            <TransactionTable 
              title="All Transactions"
              data={txWithIndex} 
              type="all" 
              corpname={selectedCorp.name}
              onDelete={onDeleteTransaction}
              onUpdate={onUpdateTransaction}
            />
          </div>
        ) : (
          // --- Two Separate Tables View ---
          <>
            <div className={styles.tableWrapper}>
              <TransactionTable 
                title="Income (In)"
                data={incomeTx} 
                type="income" 
                corpname={selectedCorp.name}
                onDelete={onDeleteTransaction}
                onUpdate={onUpdateTransaction}
              />
            </div>
            <div className={styles.tableWrapper}>
              <TransactionTable 
                title="Expense (Out)"
                data={expenseTx} 
                type="expense" 
                corpname={selectedCorp.name}
                onDelete={onDeleteTransaction}
                onUpdate={onUpdateTransaction}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
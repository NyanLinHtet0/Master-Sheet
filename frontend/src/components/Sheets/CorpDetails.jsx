import styles from '../../pages/Sheets.module.css';

function CorpDetails({ 
  selectedCorp, 
  showAddTxForm, 
  setShowAddTxForm,
  txDesc,
  setTxDesc,
  txAmount,
  setTxAmount,
  txDate,
  setTxDate,
  handleAddTx 
}) {
  if (!selectedCorp) {
    return (
      <div className={styles.corpDetails}>
        <h2>Details</h2>
        <p>Select a corporation to view its details.</p>
      </div>
    );
  }

  // 1. SPLIT THE TRANSACTIONS INTO "IN" AND "OUT"
  const transactions = selectedCorp.transactions || [];
  const incomeTx = transactions.filter(tx => tx.amount >= 0);
  const expenseTx = transactions.filter(tx => tx.amount < 0);

  return (
    <div className={styles.corpDetails}>
      <h2>{selectedCorp.name}</h2>
      <p>Balance: {Number(selectedCorp.balance).toLocaleString()}</p>
      
      <div className={styles.txHeader}>
        <h3>Transactions:</h3>
        <button onClick={() => setShowAddTxForm(true)}>Add Transaction</button>
      </div>

      {showAddTxForm && (
        <form onSubmit={handleAddTx} className={styles.formContainer}>
          <input 
            type="text" placeholder="Description" required 
            value={txDesc} onChange={(e) => setTxDesc(e.target.value)}
          />
          <input 
            type="number" placeholder="Amount (e.g., 100 or -50)" required 
            value={txAmount} onChange={(e) => setTxAmount(e.target.value)}
          />
          <input type="date" value={txDate} onChange={(e) => setTxDate(e.target.value)} />
          <div>
            <button type="submit">Submit Transaction</button>
            <button type="button" onClick={() => setShowAddTxForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {/* 2. RENDER THE TWO TABLES SIDE-BY-SIDE */}
      <div className={styles.tablesContainer}>
        
        {/* INCOMES TABLE */}
        <div className={styles.tableWrapper}>
          <h4 className={styles.tableTitle}>Income (In)</h4>
          <div className={`${styles.tableScroll} custom-scrollbar`}>
            <table className={styles.txTable}>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
                </thead>
                <tbody>
                {incomeTx.length > 0 ? incomeTx.map((tx, idx) => (
                    <tr key={idx}>
                    <td className={styles.txDate}>{tx.date || '-'}</td>
                    <td>{tx.description}</td>
                    <td className={styles.incomeAmount}>+{Number(tx.amount).toLocaleString()}</td>
                    </tr>
                )) : (
                    <tr><td colSpan="3" className={styles.emptyTableMessage}>No income recorded</td></tr>
                )}
                </tbody>
            </table>
          </div>
        </div>

        {/* EXPENSES TABLE */}
        <div className={styles.tableWrapper}>
          <h4 className={styles.tableTitle}>Expenses (Out)</h4>
          <div className={`${styles.tableScroll} custom-scrollbar`}>
            <table className={styles.txTable}>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
                </thead>
                <tbody>
                {expenseTx.length > 0 ? expenseTx.map((tx, idx) => (
                    <tr key={idx}>
                    <td className={styles.txDate}>{tx.date || '-'}</td>
                    <td>{tx.description}</td>
                    <td className={styles.expenseAmount}>{Number(tx.amount).toLocaleString()}</td>
                    </tr>
                )) : (
                    <tr><td colSpan="3" className={styles.emptyTableMessage}>No expenses recorded</td></tr>
                )}
                </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CorpDetails;
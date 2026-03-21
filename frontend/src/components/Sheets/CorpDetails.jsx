import TransactionForm from './TransactionForm';
import TransactionTable from './TransactionTable';
import styles from '../../pages/Sheets.module.css';

function CorpDetails({ selectedCorp, onAddTransaction, onDeleteTransaction, onUpdateTransaction }) {
  if (!selectedCorp) {
    return (
      <div className={styles.corpDetails}>
        <h2>Details</h2>
        <p>Select a corporation to view its details.</p>
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
      <h2>{selectedCorp.name}</h2>
      <div className={styles.balanceContainer}>
        <span>Balance: {Number(selectedCorp.total_mmk || 0).toLocaleString()} MMK</span>
        
        {isForeign && (
          <>
            <span className={styles.divider}>|</span>
            <span className={styles.foreignText}>
              {currencyName} Balance: {Number(selectedCorp.total_foreign || 0).toLocaleString()}
            </span>
            <span className={styles.divider}>|</span>
            <span className={styles.rateText}>Rate: {currentRate}</span>
          </>
        )}
      </div>

      <TransactionForm onSubmit={onAddTransaction} corpname={selectedCorp.name} />

      <div className={styles.tablesContainer}>
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
            title="Expenses (Out)" 
            data={expenseTx} 
            type="expense" 
            corpname={selectedCorp.name} 
            onDelete={onDeleteTransaction}
            onUpdate={onUpdateTransaction}
          />
        </div>
      </div>
    </div>
  );
}

export default CorpDetails;
import TransactionForm from './TransactionForm';
import TransactionTable from './TransactionTable';
import styles from '../../pages/Sheets.module.css';

function CorpDetails({ selectedCorp, onAddTransaction }) {
  if (!selectedCorp) {
    return (
      <div className={styles.corpDetails}>
        <h2>Details</h2>
        <p>Select a corporation to view its details.</p>
      </div>
    );
  }

  const transactions = selectedCorp.transactions || [];
  const isBaht = selectedCorp.name && selectedCorp.name.includes('ဝယ်စာရင်း');

  // Split transactions based on positive (Income) or negative (Expense) amounts
  const incomeTx = transactions.filter(tx => tx.amount >= 0);
  const expenseTx = transactions.filter(tx => tx.amount < 0);

  return (
    <div className={styles.corpDetails}>
      <h2>{selectedCorp.name}</h2>
      <p style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
        Balance: {Number(selectedCorp.total_mmk != null ? selectedCorp.total_mmk : (selectedCorp.balance || 0)).toLocaleString()} MMK
      </p>

      {/* 1. The Composed Form */}
      <TransactionForm onSubmit={onAddTransaction} corpname={selectedCorp.name} />

      {/* 2. The Composed Tables */}
      <div className={styles.tablesContainer}>
        <div className={styles.tableWrapper}>
          <TransactionTable title="Income (In)" data={incomeTx} type="income" corpname={selectedCorp.name}/>
        </div>
        
        <div className={styles.tableWrapper}>
          <TransactionTable title="Expenses (Out)" data={expenseTx} type="expense" corpname={selectedCorp.name} />
        </div>
      </div>
    </div>
  );
}

export default CorpDetails;
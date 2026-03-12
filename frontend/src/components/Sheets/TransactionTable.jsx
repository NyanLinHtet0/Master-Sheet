import styles from '../../pages/Sheets.module.css';

export default function TransactionTable({ title, data, type }) {
  // If there's no data, we can just show an empty state
  if (!data || data.length === 0) {
    return (
      <div className={styles.tableScroll}>
        <h3 className={styles.tableTitle}>{title}</h3>
        <p style={{ padding: '15px', color: 'var(--text-muted)' }}>No transactions yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableScroll}>
      <h3 className={styles.tableTitle}>{title}</h3>
      <table className={styles.txTable}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Rate</th>
            <th>Total (MMK)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((tx, index) => {
            // Calculate the total MMK base value 
            // (Assuming your data model normalizes missing rates to 1)
            const exchangeRate = tx.rate || 1;
            const totalMMK = tx.amount * exchangeRate;

            return (
              <tr key={index}>
                <td>{tx.description}</td>
                <td>
                  {Number(tx.amount).toLocaleString()} {tx.currency || 'MMK'}
                </td>
                <td>{tx.currency === 'THB' ? exchangeRate : '-'}</td>
                <td style={{ 
                  color: type === 'income' ? 'green' : type === 'expense' ? 'red' : 'inherit',
                  fontWeight: 'bold'
                }}>
                  {totalMMK.toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
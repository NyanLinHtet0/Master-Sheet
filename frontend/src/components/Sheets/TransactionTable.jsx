import styles from '../../pages/Sheets.module.css';

export default function TransactionTable({ title, data, type, corpname }) {
  // If there's no data, we show the title outside, and an empty state inside the bordered box
  if (!data || data.length === 0) {
    return (
      <>
        <h3 className={styles.tableTitle}>{title}</h3>
        <div className={styles.tableScroll}>
          <p style={{ padding: '15px', color: 'var(--text-muted)' }}>No transactions yet.</p>
        </div>
      </>
    );
  }

  if (corpname == 'Baht ဝယ်စာရင်း ()'){
    return (
    <>
      <h3 className={styles.tableTitle}>{title}</h3>
      <div className={styles.tableScroll}>
        <table className={styles.txTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Baht</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((tx, index) => (
              <tr key={index}>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>{tx.description}</td>
                <td style={{ color: type === 'income' ? 'green' : type === 'expense' ? 'red' : 'inherit', fontWeight: 'bold' }}>
                  {Number(tx.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
    );
  }


  return (
    <>
      <h3 className={styles.tableTitle}>{title}</h3>
      <div className={styles.tableScroll}>
        <table className={styles.txTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((tx, index) => (
              <tr key={index}>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>{tx.description}</td>
                <td style={{ color: type === 'income' ? 'green' : type === 'expense' ? 'red' : 'inherit', fontWeight: 'bold' }}>
                  {Number(tx.amount).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
import styles from '../../pages/Sheets.module.css';

export default function TransactionTable({ title, data, type, corpname }) {
  const isBaht = corpname === 'Baht ဝယ်စာရင်း ()';
  const isEmpty = !data || data.length === 0;

  return (
    <>
      <h3 className={styles.tableTitle}>{title}</h3>
      <div className={styles.tableScroll}>
        
        {isEmpty ? (
          <p style={{ padding: '15px', color: 'var(--text-muted)' }}>No transactions yet.</p>
        ) : (
          <table className={styles.txTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>

                {/* Conditionally Rendering for Baht */}
                {isBaht ? (
                  <>
                    <th>Baht</th>
                    <th>Rate</th>
                    <th>Total Amount</th>
                  </>
                ) : (
                  <th>Amount</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((tx, index) => (
                <tr key={index}>
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
                  <td>{tx.description}</td>
                  {/*Conditional Rendering for Baht*/}
                  {isBaht ? (
                    <td>
                    {Number(tx.amount).toLocaleString()}
                    </td>
                  ):(
                    <td style={{ color: type === 'income' ? 'green' : type === 'expense' ? 'red' : 'inherit', fontWeight: 'bold' }}>
                    {Number(tx.amount).toLocaleString()}
                    </td>
                  )}
   
                  
                  {/* Conditionally Rendering for Baht*/}
                  {isBaht && (
                    <>
                      <td>{tx.rate || '-'}</td>
                      <td style={{ color: type === 'income' ? 'green' : type === 'expense' ? 'red' : 'inherit', fontWeight: 'bold' }}>
                        {tx.totalAmount = Number(tx.amount).toLocaleString() || '-'}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </>
  );
}
import { useState } from 'react';
import styles from '../../pages/Sheets.module.css';

export default function TransactionForm({ onSubmit }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    onSubmit({
      description,
      amount: Number(amount)
    });

    setDescription('');
    setAmount('');
  };

  return (
    <div className={styles.transactionFormWrapper}>
      <h3 className={styles.formTitle}>
        Add New Transaction
      </h3>
      
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        
        {/* Horizontal Input Row */}
        <div className={styles.inputRow}>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={styles.flexInput}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className={styles.flexInput}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className={styles.submitBtn}>
          Add Transaction
        </button>
      </form>
    </div>
  );
}
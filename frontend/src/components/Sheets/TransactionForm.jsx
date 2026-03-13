import { useState } from 'react';
import styles from '../../pages/Sheets.module.css';

export default function TransactionForm({ onSubmit, corpname }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const isBaht = corpname === 'Baht ဝယ်စာရင်း ()';
  const [rate, setRate] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;
    if (isBaht){
      const calculatedTotal = Number(amount) * Number(rate);
      onSubmit({
      date,
      description,
      amount: Number(amount),
      rate: Number(rate)
    });}
    
    else{
      onSubmit({
      date,
      description,
      amount: Number(amount)
    });}


    setDescription('');
    setAmount('');
    setRate('');
    setDate(new Date().toISOString().split('T')[0]);
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
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={styles.flexInput}
          />
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
          {isBaht && (
            <input
              type="number"
              placeholder="Rate"
              value={rate}
              onChange={(e) => setRate(e.target.value)} 
              required
              className={styles.flexInput}
            />
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className={styles.submitBtn}>
          Add Transaction
        </button>
      </form>
    </div>
  );
}
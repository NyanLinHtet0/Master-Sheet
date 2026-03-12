import { useState } from 'react';
// Adjust the path to your CSS module based on your folder structure
import styles from '../../pages/Sheets.module.css'; 

export default function TransactionForm({ onSubmit }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('MMK');
  const [rate, setRate] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!description || !amount) return;

    // Send the cleanly formatted data up to the parent
    onSubmit({
      description,
      amount: Number(amount),
      currency,
      rate: currency === 'MMK' ? 1 : Number(rate)
    });

    // Reset the form
    setDescription('');
    setAmount('');
    setCurrency('MMK');
    setRate(1);
  };

  const isBaht = currency === 'THB';
  const previewTotal = Number(amount) * (isBaht ? Number(rate) : 1);

  return (
    <form onSubmit={handleSubmit} className={styles.transactionForm}>
      <h3>Add New Transaction</h3>
      
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="MMK">MMK</option>
            <option value="THB">Baht (THB)</option>
          </select>
        </div>

        {/* Conditionally render the exchange rate field if Baht is selected */}
        {isBaht && (
          <input
            type="number"
            placeholder="Exchange Rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            required={isBaht}
          />
        )}
      </div>

      {/* Show a preview of the math if doing a conversion */}
      {isBaht && amount && rate && (
        <p className={styles.previewText}>
          Total Base Value: <strong>{previewTotal.toLocaleString()} MMK</strong>
        </p>
      )}

      <button type="submit">Add Transaction</button>
    </form>
  );
}
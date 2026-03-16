import { useState, useEffect } from 'react'; // <-- 1. Import useEffect
import styles from '../../pages/Sheets.module.css';

export default function TransactionForm({ onSubmit, corpname }) {
  const today = new Date();
  
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(today.getDate());
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState(''); 
  
  const isBaht = corpname && corpname.includes('ဝယ်စာရင်း');

  // 2. Static arrays for Years and Months
  const years = Array.from({ length: 3 }, (_, i) => today.getFullYear() - 1 + i); 
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 3. DYNAMIC array for Days!
  // The '0' trick in JavaScript Dates automatically returns the last day of the previous month.
  // So new Date(2023, 2, 0) gives the last day of February 2023 (28).
  const daysInSelectedMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);

  // 4. Auto-correct the day if they switch to a shorter month
  // Example: If they pick Jan 31st, then switch to Feb, it forces the day down to 28.
  useEffect(() => {
    if (day > daysInSelectedMonth) {
      setDay(daysInSelectedMonth);
    }
  }, [year, month, daysInSelectedMonth, day]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || (isBaht && !rate)) return; 
    
    // Stitch the dates together into standard YYYY-MM-DD format
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    if (isBaht){
      onSubmit({
        date: formattedDate,
        description,
        amount: Number(amount),
        rate: Number(rate)
      });
    } else {
      onSubmit({
        date: formattedDate,
        description,
        amount: Number(amount)
      });
    }

    setDescription('');
    setAmount('');
    setRate('');
    setYear(today.getFullYear());
    setMonth(today.getMonth() + 1);
    setDay(today.getDate());
  };

  //form format spacing
  const spacing = [.5,2,.5,.5];
  return (
    <div className={styles.transactionFormWrapper}>
      <h3 className={styles.formTitle}>Add New Transaction</h3>
      
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.inputRow}>
          
          <div style={{ display: 'flex', gap: '4px', flex: spacing[0] }}>
            <select 
              value={year} 
              onChange={(e) => setYear(Number(e.target.value))} 
              className={styles.flexInput} 
              style={{ padding: '8px 4px', minWidth: '70px' }}
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <select 
              value={month} 
              onChange={(e) => setMonth(Number(e.target.value))} 
              className={styles.flexInput}
              style={{ padding: '8px 4px', minWidth: '50px' }}
            >
              {months.map(m => (
                <option key={m} value={m}>
                  {new Date(2000, m - 1).toLocaleString('default', { month: 'short' })}
                </option>
              ))}
            </select>

            <select 
              value={day} 
              onChange={(e) => setDay(Number(e.target.value))} 
              className={styles.flexInput}
              style={{ padding: '8px 4px', minWidth: '50px' }}
            >
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <input style={{flex: spacing[1] }}
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={styles.flexInput}
          />
          
          <input style={{flex:spacing[2] }}
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className={styles.flexInput}
          />
          
          {isBaht && (
            <input style={{flex: spacing[3] }}
              type="number"
              placeholder="Rate"
              value={rate}
              onChange={(e) => setRate(e.target.value)} 
              required
              className={styles.flexInput}
            />
          )}
        </div>

        <button type="submit" className={styles.submitBtn}>
          Add Transaction
        </button>
      </form>
    </div>
  );
}
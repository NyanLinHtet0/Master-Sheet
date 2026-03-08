import { useState, useEffect } from 'react';
import styles from './Sheets.module.css';
import CorpList from '../components/Sheets/CorpList';
import CorpDetails from '../components/Sheets/CorpDetails';

function Sheets() {
  // 1. ALL YOUR STATE VARIABLES (Put back!)
  const [corps, setCorps] = useState([]);
  const [selectedCorpIndex, setSelectedCorpIndex] = useState(null);
  const [showAddCorpForm, setShowAddCorpForm] = useState(false);
  const [showAddTxForm, setShowAddTxForm] = useState(false);

  const [newCorpName, setNewCorpName] = useState('');
  const [newCorpBalance, setNewCorpBalance] = useState('');
  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txDate, setTxDate] = useState('');

  // 2. YOUR FETCH FUNCTION (Put back!)
  const fetchCorps = () => {
    fetch('/api/corps')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCorps(data);
        else setCorps([]);
      })
      .catch(err => console.error('Error fetching corps:', err));
  };

  // 3. YOUR USE EFFECT (Put back!)
  useEffect(() => {
    fetchCorps();
  }, []);

  const grandTotal = corps.reduce((sum, corp) => sum + Number(corp.balance), 0);
  const selectedCorp = selectedCorpIndex !== null ? corps[selectedCorpIndex] : null;

  // 4. YOUR HANDLERS (Put back!)
  const handleAddCorp = (e) => {
    e.preventDefault();
    if (corps.some(c => c.name.toLowerCase() === newCorpName.trim().toLowerCase())) {
      alert("A corporation with this name already exists!");
      return;
    }
    const newCorp = { name: newCorpName.trim(), balance: Number(newCorpBalance) || 0, transactions: [] };
    fetch('/api/corps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCorp)
    }).then(() => {
      fetchCorps();
      setNewCorpName('');
      setNewCorpBalance('');
      setShowAddCorpForm(false);
    });
  };

  const handleAddTx = (e) => {
    e.preventDefault();
    const date = txDate.trim() !== "" ? txDate : new Date().toISOString().split('T')[0];
    const newTx = { description: txDesc.trim(), amount: parseFloat(txAmount), date: date };
    const updatedCorp = { ...selectedCorp };
    updatedCorp.balance += newTx.amount;
    if (!updatedCorp.transactions) updatedCorp.transactions = [];
    updatedCorp.transactions.push(newTx);

    fetch('/api/corps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCorp)
    }).then(() => {
      fetchCorps();
      setTxDesc('');
      setTxAmount('');
      setTxDate('');
      setShowAddTxForm(false);
    });
  };

  // 5. THE UI (Passing the data down)
  return (
    <div className={styles.appContainer}>
      <CorpList 
        corps={corps}
        grandTotal={grandTotal}
        selectedCorpIndex={selectedCorpIndex}
        setSelectedCorpIndex={setSelectedCorpIndex}
        showAddCorpForm={showAddCorpForm}
        setShowAddCorpForm={setShowAddCorpForm}
        newCorpName={newCorpName}
        setNewCorpName={setNewCorpName}
        newCorpBalance={newCorpBalance}
        setNewCorpBalance={setNewCorpBalance}
        handleAddCorp={handleAddCorp}
      />

      <CorpDetails 
        selectedCorp={selectedCorp}
        showAddTxForm={showAddTxForm}
        setShowAddTxForm={setShowAddTxForm}
        txDesc={txDesc}
        setTxDesc={setTxDesc}
        txAmount={txAmount}
        setTxAmount={setTxAmount}
        txDate={txDate}
        setTxDate={setTxDate}
        handleAddTx={handleAddTx}
      />
    </div>
  );
}

export default Sheets;
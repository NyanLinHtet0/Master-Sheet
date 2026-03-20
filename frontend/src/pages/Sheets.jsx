import { useState, useEffect } from 'react';
import styles from './Sheets.module.css';
import CorpList from '../components/Sheets/CorpList';
import CorpDetails from '../components/Sheets/CorpDetails';

function Sheets() {
  const [corps, setCorps] = useState([]);
  const [selectedCorpIndex, setSelectedCorpIndex] = useState(null);
  const [showAddCorpForm, setShowAddCorpForm] = useState(false);

  const [newCorpName, setNewCorpName] = useState('');
  const [newCorpBalance, setNewCorpBalance] = useState('');
  const [newCorpRate, setNewCorpRate] = useState('');

  const fetchCorps = () => {
    fetch('/api/corps')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCorps(data);
        else setCorps([]);
      })
      .catch(err => console.error('Error fetching corps:', err));
  };

  useEffect(() => {
    fetchCorps();
  }, []);

  const grandTotal = corps.reduce((sum, corp) => {
    // Safely fallback to balance or 0 if total_mmk is missing
    const corpTotal = corp.total_mmk != null ? corp.total_mmk : (corp.balance || 0);
    return sum + Number(corpTotal);
  }, 0);

  const selectedCorp = selectedCorpIndex !== null ? corps[selectedCorpIndex] : null;

  const handleAddCorp = (e) => {
    e.preventDefault();
    if (corps.some(c => c.name.toLowerCase() === newCorpName.trim().toLowerCase())) {
      alert("A corporation with this name already exists!");
      return;
    }

    // Safely parse numbers, defaulting to 0
    const balanceVal = Number(newCorpBalance) || 0;
    const rateVal = Number(newCorpRate) || 0;
    const isBaht = newCorpName.toLowerCase().includes('ဝယ်စာရင်း');
    
    // Calculate initial total_mmk uniformly
    const initialTotalMmk = isBaht ? balanceVal * rateVal : balanceVal;

    const newCorp = {
      name: newCorpName.trim(),
      balance: balanceVal,
      total_mmk: initialTotalMmk, 
      order: corps.length + 1,
      transactions: balanceVal !== 0 ? [{
        description: "Initial Balance", 
        amount: balanceVal,
        date: new Date().toLocaleDateString('en-CA'),
        ...(isBaht && { rate: rateVal }),
        total_mmk: initialTotalMmk
      }] : []
    };
    
    fetch('/api/corps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCorp)
    }).then(() => {
      fetchCorps();
      setNewCorpName('');
      setNewCorpBalance('');
      setNewCorpRate('');
      setShowAddCorpForm(false);
    });
  };

  const handleAddTx = (newTx) => {
    if (!newTx.date) newTx.date = new Date().toLocaleDateString('en-CA');
    
    const isBaht = selectedCorp.name.toLowerCase().includes('ဝယ်စာရင်း');
    
    // 1. Calculate the transaction's total_mmk BEFORE saving
    const txTotalMmk = isBaht ? Number(newTx.amount) * Number(newTx.rate) : Number(newTx.amount);
    newTx.total_mmk = txTotalMmk;

    const updatedCorp = { 
      ...selectedCorp,
      transactions: selectedCorp.transactions ? [...selectedCorp.transactions, newTx] : [newTx] 
    };

    // 2. Ensure we have actual numbers, defaulting nulls/undefined to 0
    const currentBalance = Number(updatedCorp.balance) || 0;
    const currentTotalMmk = Number(updatedCorp.total_mmk != null ? updatedCorp.total_mmk : currentBalance);

    // 3. Update BOTH fields so they stay in perfect sync
    updatedCorp.balance = currentBalance + txTotalMmk;
    updatedCorp.total_mmk = currentTotalMmk + txTotalMmk;

    fetch('/api/corps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCorp)
    }).then(() => {
      fetchCorps();
    });
  };

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
        setNewCorpRate={setNewCorpRate}
      />
      
      <CorpDetails 
        selectedCorp={selectedCorp}
        onAddTransaction={handleAddTx}
      />
    </div>
  );
}

export default Sheets;
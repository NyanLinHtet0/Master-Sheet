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

  const grandTotal = corps.reduce((sum, corp) => sum + Number(corp.balance), 0);
  const selectedCorp = selectedCorpIndex !== null ? corps[selectedCorpIndex] : null;

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

  // --- NEW: Simplified transaction handler ---
  const handleAddTx = (newTx) => {
      const updatedCorp = { ...selectedCorp };

      // Update the overall balance directly with the transaction amount
      updatedCorp.balance += newTx.amount;

      if (!updatedCorp.transactions) updatedCorp.transactions = [];
      
      // Fallback date just in case
      if (!newTx.date) newTx.date = new Date().toISOString().split('T')[0];

      updatedCorp.transactions.push(newTx);

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
      />

      {/* Look how much cleaner this component is now! */}
      <CorpDetails 
        selectedCorp={selectedCorp}
        onAddTransaction={handleAddTx}
      />
    </div>
  );
}

export default Sheets;
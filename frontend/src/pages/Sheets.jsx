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

  const grandTotal = corps.reduce((sum, corp) => sum + Number(corp.balance), 0);
  const selectedCorp = selectedCorpIndex !== null ? corps[selectedCorpIndex] : null;

  const handleAddCorp = (e) => {
    e.preventDefault();
    if (corps.some(c => c.name.toLowerCase() === newCorpName.trim().toLowerCase())) {
      alert("A corporation with this name already exists!");
      return;
    }
    const newCorp = {
      name: newCorpName.trim(),
      balance: Number(newCorpBalance) || 0,
      order: corps.length + 1, // Added missing 'order' property!
      transactions: Number(newCorpBalance) !== 0 ? [{
        description: "Initial Balance",
        amount: Number(newCorpBalance),
        date: new Date().toLocaleDateString('en-CA')
      }] : []
    };
    if (newCorpName.toLowerCase().includes('ဝယ်စာရင်း')) {
      newCorp.rate = Number(newCorpRate) || 0; 
    }
    
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
      // Fallback date just in case
      if (!newTx.date) newTx.date = new Date().toLocaleDateString('en-CA');
      
      const updatedCorp = { 
        ...selectedCorp,
        transactions: selectedCorp.transactions ? [...selectedCorp.transactions, newTx] : [newTx] 
      };
      // Standard update
      updatedCorp.balance += Number(newTx.amount);
      // Specific updates (special updates for Baht corp)
      if (newTx.rate) {
        // Calculate the total dynamically to update the balance in Kyat
        const calculatedTotal = Number(newTx.amount) * Number(newTx.rate);
        updatedCorp.total_mmk += calculatedTotal;
      }

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
      
      <CorpDetails 
        selectedCorp={selectedCorp}
        onAddTransaction={handleAddTx}
      />
    </div>
  );
}

export default Sheets;
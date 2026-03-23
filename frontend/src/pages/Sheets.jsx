import { useState, useEffect } from 'react';
import styles from './Sheets.module.css';
import CorpList from '../components/Sheets/CorpList';
import CorpDetails from '../components/Sheets/CorpDetails';

function Sheets() {
  const [corps, setCorps] = useState([]);
  const [selectedCorpIndex, setSelectedCorpIndex] = useState(null);
  const [showAddCorpForm, setShowAddCorpForm] = useState(false);
  
  // State for tracking unsaved changes
  const [dirtyCorps, setDirtyCorps] = useState(new Set());

  const [newCorpName, setNewCorpName] = useState('');
  const [newCorpBalance, setNewCorpBalance] = useState('');
  const [newCorpForeign, setNewCorpForeign] = useState('');

  const fetchCorps = () => {
    fetch('/api/corps')
      .then(res => res.json())
      .then(data => {
        const sortedData = data.sort((a, b) => (a.order || 999) - (b.order || 999));
        setCorps(sortedData);
      })
      .catch(err => console.error("Error fetching corps:", err));
  };

  useEffect(() => {
    fetchCorps();
  }, []);

  const handleAddCorp = (e) => {
    e.preventDefault();
    if (!newCorpName.trim()) return;

    const isBaht = newCorpName.includes('ဝယ်စာရင်း');
    const newCorp = {
      name: newCorpName.trim(),
      total_mmk: Number(newCorpBalance) || 0,
      order: corps.length + 1,
      transactions: [
        {
          description: "Initial Balance",
          amount: Number(newCorpBalance) || 0,
          date: new Date().toISOString().split('T')[0],
          total_mmk: Number(newCorpBalance) || 0
        }
      ]
    };

    if (isBaht) {
      newCorp.total_foreign = Number(newCorpForeign) || 0;
    }

    fetch('/api/corps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCorp)
    }).then(() => {
      setNewCorpName('');
      setNewCorpBalance('');
      setNewCorpForeign('');
      setShowAddCorpForm(false);
      fetchCorps();
    });
  };

  const selectedCorp = selectedCorpIndex !== null ? corps[selectedCorpIndex] : null;

  // Handles adding a new transaction locally and marks it dirty
  const handleAddTx = (newTx) => {
    if (!selectedCorp) return;

    const isBaht = selectedCorp.name.includes('ဝယ်စာရင်း');
    const txTotalMmk = isBaht ? Number(newTx.amount) * Number(newTx.rate || 0) : Number(newTx.amount);
    newTx.total_mmk = txTotalMmk;

    const updatedCorp = {
      ...selectedCorp,
      transactions: selectedCorp.transactions ? [...selectedCorp.transactions, newTx] : [newTx]
    };

    const currentTotalMmk = Number(updatedCorp.total_mmk || 0);
    updatedCorp.total_mmk = currentTotalMmk + txTotalMmk;

    if (isBaht) {
      const currentTotalForeign = Number(updatedCorp.total_foreign || 0);
      updatedCorp.total_foreign = currentTotalForeign + Number(newTx.amount);
    }

    updateLocalStateAndMarkDirty(updatedCorp);
  };

  // Shared function to update local transactions
  const saveUpdatedTransactions = (newTransactions) => {
    const isBaht = selectedCorp.name.includes('ဝယ်စာရင်း');
    let newTotalMmk = 0;
    let newTotalForeign = 0;

    const finalTransactions = newTransactions.map(tx => {
      const txTotalMmk = isBaht ? Number(tx.amount) * Number(tx.rate || 0) : Number(tx.amount);
      newTotalMmk += txTotalMmk;
      if (isBaht) newTotalForeign += Number(tx.amount);

      if (isBaht) {
        return { ...tx, amount: Number(tx.amount), rate: Number(tx.rate), total_mmk: txTotalMmk };
      } else {
        return { ...tx, amount: Number(tx.amount), total_mmk: txTotalMmk };
      }
    });

    const updatedCorp = {
      ...selectedCorp,
      transactions: finalTransactions,
      total_mmk: newTotalMmk,
      ...(isBaht && { total_foreign: newTotalForeign })
    };

    updateLocalStateAndMarkDirty(updatedCorp);
  };

  // Helper function to update state and set dirty flag
  const updateLocalStateAndMarkDirty = (updatedCorp) => {
    setCorps(prevCorps => {
      const newCorps = [...prevCorps];
      newCorps[selectedCorpIndex] = updatedCorp;
      return newCorps;
    });

    setDirtyCorps(prev => {
      const newSet = new Set(prev);
      newSet.add(updatedCorp.name);
      return newSet;
    });
  };

  const handleDeleteTx = (originalIndex) => {
    const newTransactions = selectedCorp.transactions.filter((_, i) => i !== originalIndex);
    saveUpdatedTransactions(newTransactions);
  };

  const handleUpdateTx = (originalIndex, updatedTx) => {
    const newTransactions = [...selectedCorp.transactions];
    newTransactions[originalIndex] = updatedTx;
    saveUpdatedTransactions(newTransactions);
  };

  // Master function to push all dirty updates to database
  const handleSaveToDatabase = async () => {
    const corpsToSave = corps.filter(c => dirtyCorps.has(c.name));
    if (corpsToSave.length === 0) return;

    try {
      await Promise.all(corpsToSave.map(corp =>
        fetch('/api/corps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(corp)
        })
      ));

      // Clear the dirty flag upon success
      setDirtyCorps(new Set());
    } catch (error) {
      console.error('Failed to save to database', error);
      alert('Error saving data. Please check connection.');
    }
  };

  const grandTotal = corps.reduce((sum, corp) => sum + Number(corp.total_mmk || 0), 0);

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
        newCorpForeign={newCorpForeign}
        setNewCorpForeign={setNewCorpForeign}
      />
      <CorpDetails
        selectedCorp={selectedCorp}
        onAddTransaction={handleAddTx}
        onDeleteTransaction={handleDeleteTx}
        onUpdateTransaction={handleUpdateTx}
        isDirty={selectedCorp ? dirtyCorps.has(selectedCorp.name) : false}
        onSave={handleSaveToDatabase}
      />
    </div>
  );
}

export default Sheets;
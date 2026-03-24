import { useState } from 'react';
import styles from './Sheets.module.css';
import CorpList from '../components/Sheets/CorpList';
import CorpDetails from '../components/Sheets/CorpDetails';

function Sheets({ corps, fetchCorps }) {
  const [selectedCorpIndex, setSelectedCorpIndex] = useState(null);
  const [showAddCorpForm, setShowAddCorpForm] = useState(false);

  const [newCorpName, setNewCorpName] = useState('');
  const [newCorpBalance, setNewCorpBalance] = useState(''); 
  const [newCorpForeign, setNewCorpForeign] = useState('');

  const grandTotal = corps.reduce((sum, corp) => {
    const corpTotal = corp.total_mmk || 0; 
    return sum + Number(corpTotal);
  }, 0);

  const selectedCorp = selectedCorpIndex !== null ? corps[selectedCorpIndex] : null;

  const handleAddCorp = (e) => {
    e.preventDefault();

    if (corps.some(c => c?.name === newCorpName.trim())) {
      alert("A corporation with this name already exists!");
      return;
    }

    const isBaht = newCorpName.includes('ဝယ်စာရင်း');
    const kyatVal = Number(newCorpBalance) || 0;
    const foreignVal = Number(newCorpForeign) || 0;

    const calculatedRate = (isBaht && foreignVal !== 0) ? kyatVal / foreignVal : 0;
    const initialTotalMmk = kyatVal;

    const newCorp = {
      name: newCorpName.trim(),
      total_mmk: initialTotalMmk,
      ...(isBaht && { total_foreign: foreignVal }),
      order: corps.length + 1,
      transactions: (kyatVal !== 0 || foreignVal !== 0) ? [
        {
          description: "Initial Balance",
          amount: isBaht ? foreignVal : kyatVal,
          date: new Date().toLocaleDateString('en-CA'),
          ...(isBaht && { rate: calculatedRate }),
          total_mmk: initialTotalMmk
        }
      ] : []
    };

    fetch('/api/corps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCorp)
    }).then(() => {
      fetchCorps(); 
      setNewCorpName('');
      setNewCorpBalance('');
      setNewCorpForeign('');
      setShowAddCorpForm(false);
    });
  };

  const handleAddTx = (newTx) => {
    if (!newTx.date) newTx.date = new Date().toLocaleDateString('en-CA');
    const isBaht = selectedCorp.name.includes('ဝယ်စာရင်း');

    const txTotalMmk = isBaht ? Number(newTx.amount) * Number(newTx.rate) : Number(newTx.amount);
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

    fetch('/api/corps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCorp)
    }).then(() => {
      fetchCorps(); 
    });
  };

  const saveUpdatedTransactions = (newTransactions) => {
    const isBaht = selectedCorp.name.includes('ဝယ်စာရင်း');
    let newTotalMmk = 0;
    let newTotalForeign = 0;

    const finalTransactions = newTransactions.map(tx => {
      const txTotalMmk = isBaht ? Number(tx.amount) * Number(tx.rate || 0) : Number(tx.amount);
      newTotalMmk += txTotalMmk;
      if (isBaht) newTotalForeign += Number(tx.amount);
      return { 
        ...tx, 
        amount: Number(tx.amount), 
        ...(isBaht && { rate: Number(tx.rate) }), 
        total_mmk: txTotalMmk 
      };
    });

    const updatedCorp = {
      ...selectedCorp,
      transactions: finalTransactions,
      total_mmk: newTotalMmk,
      ...(isBaht && { total_foreign: newTotalForeign })
    };

    fetch('/api/corps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCorp)
    }).then(() => fetchCorps());
  };

  const handleDeleteTx = (originalIndex) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    const newTransactions = selectedCorp.transactions.filter((_, idx) => idx !== originalIndex);
    saveUpdatedTransactions(newTransactions);
  };

  const handleUpdateTx = (originalIndex, updatedTx) => {
    const newTransactions = [...selectedCorp.transactions];
    newTransactions[originalIndex] = updatedTx;
    saveUpdatedTransactions(newTransactions);
  };

  return (
    <div className={styles.appContainer}>
      <CorpList 
        corps={corps} 
        grandTotal={grandTotal} 
        selectedCorpIndex={selectedCorpIndex} 
        setSelectedCorpIndex={setSelectedCorpIndex} 
        selectedCorp={selectedCorp} // <-- Passed this down
        showAddCorpForm={showAddCorpForm} 
        setShowAddCorpForm={setShowAddCorpForm}
        newCorpName={newCorpName}
        setNewCorpName={setNewCorpName}
        newCorpBalance={newCorpBalance}
        setNewCorpBalance={setNewCorpBalance}
        handleAddCorp={handleAddCorp}
        newCorpForeign={newCorpForeign}
        setNewCorpForeign={setNewCorpForeign}
        onAddTransaction={handleAddTx} // <-- Fixed this to pass the correct function
      />
      <CorpDetails 
        selectedCorp={selectedCorp} 

        onDeleteTransaction={handleDeleteTx}
        onUpdateTransaction={handleUpdateTx}
      />
    </div>
  );
}

export default Sheets;
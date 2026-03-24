import styles from '../../pages/Sheets.module.css';
import CorpDropdown from '../CorpDropdown';
// Make sure to import TransactionForm here if you haven't already!
import TransactionForm from './TransactionForm'; 

function CorpList({ 
  corps, 
  grandTotal, 
  setSelectedCorpIndex,
  selectedCorp, // Added this prop to safely access selectedCorp.name
  showAddCorpForm, 
  setShowAddCorpForm, 
  newCorpName, 
  setNewCorpName, 
  newCorpBalance, 
  setNewCorpBalance, 
  handleAddCorp, 
  newCorpForeign, 
  setNewCorpForeign,
  onAddTransaction // We will pass handleAddTx from Sheets into this prop
}) {
  const isBahtCorp = newCorpName.includes('ဝယ်စာရင်း');

  return (
    <div className={styles.corpList}>
      <div className={styles.corpListHeader}>
        <h2>Corporations</h2>
        <button onClick={() => setShowAddCorpForm(true)}>Add</button>
      </div>

      {showAddCorpForm && (
        <form onSubmit={handleAddCorp} className={styles.formContainer}>
          <div className={styles.corpFormWrapper}>
            <div className={styles.inputFieldCont} style={{flex:'2' }}>
              <input
                type="text"
                placeholder="Corporation Name"
                required
                value={newCorpName}
                onChange={(e) => setNewCorpName(e.target.value)}
              />
            </div>
            
            <div className={styles.inputFieldCont} style={{flex:'.5' }}>
              <input
                type="text"
                placeholder={isBahtCorp ? "Initial Kyat" : "Balance"}
                value={newCorpBalance === '-' ? '-' : newCorpBalance ? Number(newCorpBalance).toLocaleString() : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/,/g, '');
                  if (raw === '' || raw === '-' || !isNaN(raw)) {
                    setNewCorpBalance(raw);
                  }
                }}
              />
            </div>
            
            {isBahtCorp && (
              <div className={styles.inputFieldCont} style={{ flex: '1' }}>
                <input
                  type="text"
                  placeholder="Initial Baht"
                  value={newCorpForeign ? Number(newCorpForeign).toLocaleString() : ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/,/g, '');
                    if (!isNaN(raw)) setNewCorpForeign(raw);
                  }}
                />
              </div>
            )}
          </div>
          <div>
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setShowAddCorpForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.grandTotal}>
        <span>Grand Total: </span>
        <span>{Number(grandTotal).toLocaleString()}</span>
      </div>

      <div className={styles.dropdownContainer}>
        <CorpDropdown 
          corps={corps}
          selectedCorp={selectedCorp}
          onSelect={(selectedCorpObject) => {
            const newIndex = corps.findIndex((c) => c === selectedCorpObject);
            setSelectedCorpIndex(newIndex !== -1 ? newIndex : null);
          }}
        />
      </div>

      {/* Added a safety check so it only renders if a corp is selected */}
      {selectedCorp && (
        <TransactionForm onSubmit={onAddTransaction} corpname={selectedCorp.name} />
      )}
      
    </div>
  );
}

export default CorpList;
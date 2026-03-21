import styles from '../../pages/Sheets.module.css';

function CorpList({ 
  corps, 
  grandTotal, 
  selectedCorpIndex, 
  setSelectedCorpIndex, 
  showAddCorpForm, 
  setShowAddCorpForm,
  newCorpName,
  setNewCorpName,
  newCorpBalance,
  setNewCorpBalance,
  handleAddCorp,
  newCorpForeign,
  setNewCorpForeign
}) {
  const isBahtCorp = newCorpName.includes('ဝယ်စာရင်း');

  return (
    <div className={styles.corpList}>
      <div className={styles.corpListHeader}>
        <h2>Corporations</h2>
        <button onClick={() => setShowAddCorpForm(true)}>+ Add Corporation</button>
      </div>

      <div className={styles.grandTotal}>
        <span>Grand Total: </span>
        <span>{Number(grandTotal).toLocaleString()}</span>
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
                type="number" 
                placeholder={isBahtCorp ? "Initial Kyat" : "Balance"} 
                value={newCorpBalance} 
                onChange={(e) => setNewCorpBalance(e.target.value)}
              />
            </div>
          
            {isBahtCorp && (
              <div className={styles.inputFieldCont} style={{ flex: '1' }}>
                <input 
                  type="number" 
                  placeholder="Initial Baht" 
                  value={newCorpForeign} 
                  onChange={(e) => setNewCorpForeign(e.target.value)}
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

      <div className={`${styles.corpItems} custom-scrollbar`}>
        {corps.map((corp, index) => (
          <div 
            key={corp.name} 
            className={styles.corpItem} 
            style={{ backgroundColor: selectedCorpIndex === index ? 'var(--bg-color)' : 'white' }}
            onClick={() => setSelectedCorpIndex(index)}
          >
            <span>{corp.name}</span>
            <span>{Number(corp.total_mmk || 0).toLocaleString()}</span>
          </div>
        ))} 
      </div>
    </div>
  );
}

export default CorpList;
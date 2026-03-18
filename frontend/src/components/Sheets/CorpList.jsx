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
  handleAddCorp 
}) {
  return (
    <div className={styles.corpList}>
      <div className={styles.corpListHeader}>
        <h2>Corporations</h2>
        <button onClick={() => setShowAddCorpForm(true)}>+ Add Corporation</button>
      </div>

      <div className={styles.grandTotal}>
        <span>Grand Total: </span>
        <span>{grandTotal.toLocaleString()}</span>
      </div>

      {showAddCorpForm && (
        <form onSubmit={handleAddCorp} className={styles.formContainer}>
        <div className={styles.corpFormWrapper}>
          <div className={styles.inputFieldCont}  style={{flex:'2' }}>
            <input id={"newcorpname"}
            type="text" placeholder="Corporation Name" required 
            value={newCorpName} onChange={(e) => setNewCorpName(e.target.value)} 
            />
          </div>

          <div className={styles.inputFieldCont} style={{flex:'.5' }}>
            <input 
            type="number" placeholder="Balance (default 0)" 
            value={newCorpBalance} onChange={(e) => setNewCorpBalance(e.target.value)}
            />
          </div>
          {/* NEW CONDITIONAL FIELD ADDED HERE */}
            {newCorpName.includes('ဝယ်စာရင်း') && (
              <div className={styles.inputFieldCont} style={{ flex: '1' }}>
                <input 
                  type="text" 
                  placeholder="Extra Bahtwalsayin Info" 
                  // Make sure to add value and onChange here for a new state variable!
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
            {(corp.name && corp.name.includes('ဝယ်စာရင်း')) ? (
              <>
                <span>{corp.name}</span>
                <span>
                  {corp.total_mmk
                    ? Number(corp.balance * corp.total_mmk).toLocaleString() 
                    : Number(corp.balance).toLocaleString()}
                </span>
              </>
            ) : (
              <>
                <span>{corp.name}</span>
                <span>{Number(corp.balance).toLocaleString()}</span>
              </>
            )}
          </div>
        ))} 
      </div>
    </div>
  ); 
}

export default CorpList;
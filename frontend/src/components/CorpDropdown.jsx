import { useState, useEffect, useRef } from 'react';
import styles from './CorpDropdown.module.css';

function CorpDropdown({ corps = [], selectedCorp, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const dropdownRef = useRef(null);

  // Sync the search term with the selected corp when it changes from the outside
  useEffect(() => {
    if (selectedCorp && !isOpen) {
      setSearchTerm(selectedCorp.name);
    }
  }, [selectedCorp, isOpen]);

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleCloseDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedCorp]);

  // Helpers to manage opening and closing cleanly
  const handleOpenDropdown = () => {
    setIsOpen(true);
    setSearchTerm(''); // Clear text immediately so they see all options
  };

  const handleCloseDropdown = () => {
    setIsOpen(false);
    // Restore the search term to the selected corp if they abandon the search
    setSearchTerm(selectedCorp ? selectedCorp.name : '');
  };

  // Filter corps based on the search term
  const filteredCorps = corps.filter(corp =>
    corp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCorp = (corp) => {
    onSelect(corp); 
    setSearchTerm(corp.name);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div className={styles.dropdownWrapper} ref={dropdownRef}>
      
      <div
        className={`${styles.dropdownHeader} ${isOpen ? styles.activeHeader : ''}`}
        onClick={() => {
          if (!isOpen) handleOpenDropdown();
        }}
      >
        <div className={styles.inputGroup}>
          <input
            type="text"
            className={styles.searchInput}
            value={isOpen ? searchTerm : (selectedCorp ? selectedCorp.name : 'None')}
            onChange={handleInputChange}
            onFocus={() => {
              if (!isOpen) handleOpenDropdown();
            }}
            placeholder="Search or select a corp..."
          />
          
          {/* Show balance inline only when closed and a corp is selected */}
          {!isOpen && selectedCorp && (
            <span className={styles.headerBalance}>
              {selectedCorp.total_mmk ? selectedCorp.total_mmk.toLocaleString() : 0} MMK
            </span>
          )}
        </div>
        
        {/* Dropdown Indicator */}
        <div
          className={`${styles.caret} ${isOpen ? styles.caretOpen : ''}`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent double-triggering from the header click
            if (isOpen) {
              handleCloseDropdown();
            } else {
              handleOpenDropdown();
            }
          }}
        >
          ▼
        </div>
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <ul className={styles.dropdownList}>
          {filteredCorps.length > 0 ? (
            filteredCorps.map((corp, index) => (
              <li
                key={index}
                className={styles.dropdownItem}
                onClick={() => handleSelectCorp(corp)}
              >
                <span className={styles.corpName}>{corp.name}</span>
                <span className={styles.corpBalance}>
                  {corp.total_mmk ? corp.total_mmk.toLocaleString() : 0} MMK
                  {corp.total_foreign ? ` / ${corp.total_foreign.toLocaleString()} Foreign` : ''}
                </span>
              </li>
            ))
          ) : (
            <li className={styles.noResults}>No corps found</li>
          )}
        </ul>
      )}

    </div>
  );
}

export default CorpDropdown;
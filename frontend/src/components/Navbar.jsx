import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  const location = useLocation(); // This tells us which page we are on

  return (
    <nav className={styles.navbar}>
      <Link 
        to="/" 
        className={location.pathname === '/' ? `${styles.link} ${styles.activeLink}` : styles.link}
      >
        Home
      </Link>
      <Link 
        to="/Sheets" 
        className={location.pathname === '/Sheets' ? `${styles.link} ${styles.activeLink}` : styles.link}
      >
        Sheets
      </Link>
    </nav>
  );
}

export default Navbar;
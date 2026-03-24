import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Sheets from './pages/Sheets';
import View from './pages/View'; // Newly imported View component

function App() {
  // Hoisted state and initialization
  const [corps, setCorps] = useState([]);

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

  return (
    <BrowserRouter>
      <Navbar /> 
      
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Passing state and the fetch function down as props */}
          <Route path="/Sheets" element={<Sheets corps={corps} fetchCorps={fetchCorps} />} />
          <Route path="/View" element={<View corps={corps} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
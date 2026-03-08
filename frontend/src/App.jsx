import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
// Importing our page components
import Home from './pages/Home';
import Sheets from './pages/Sheets';

function App() {
  return (
    <BrowserRouter>
      {/* We use the imported Navbar here */}
      <Navbar /> 
      
      <div style={{ padding: '20px' }}>
        <Routes>
          {/* We use the imported Pages here */}
          <Route path="/" element={<Home />} />
          <Route path="/Sheets" element={<Sheets />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

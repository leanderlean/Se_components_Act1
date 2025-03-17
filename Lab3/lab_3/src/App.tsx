import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterUser from './components/registerUser/RegisterUser';
import DisplayUser from './components/displayUser/DisplayUser';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterUser />} />
        <Route path="/display" element={<DisplayUser />} />
      </Routes>
    </Router>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Signup from './components/Signup';
import Post from './components/Post';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='' element={<Login />} />
        <Route path='/sign' element={<Signup />} />
        <Route path='/post' element={<Post />} />
      </Routes>
    </Router>
  );
}

export default App;

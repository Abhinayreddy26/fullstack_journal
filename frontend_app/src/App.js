import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import JournalList from './components/journals/JournalList';
import JournalDetail from './components/journals/JournalDetail';
import CreateJournal from './components/journals/CreateJournal';
import EditJournal from './components/journals/EditJournal';
import MyJournals from './components/journals/MyJournals';
import JournalSearch from './components/journals/JournalSearch';
import Navbar from './components/common/Navbar'; // Make sure this path is correct

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mx-auto px-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/journals" element={<JournalList />} />
            <Route path="/journals/:id" element={<JournalDetail />} />
            <Route path="/my-journals" element={<PrivateRoute><MyJournals /></PrivateRoute>} />
            <Route path="/create-journal" element={<PrivateRoute><CreateJournal /></PrivateRoute>} />
            <Route path="/edit-journal/:id" element={<PrivateRoute><EditJournal /></PrivateRoute>} />
            <Route path="/search" element={<PrivateRoute><JournalSearch /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/journals" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
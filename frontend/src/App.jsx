import { Routes, Route } from 'react-router-dom';
import All from './pages/All';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import RedditSuccess from './pages/RedditSuccess';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './layout/DashboardLayout';

const App = () => {
  return (
    <Routes>
      <Route path="/auth/google/callback" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<All />} />
      <Route path="/reddit-success" element={<RedditSuccess />} />
      {/* ... keep other routes */}
      <Route path="/dashboard" element={<DashboardLayout> <Dashboard /></DashboardLayout>} />
      {/* Optional: Add more routes here */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;

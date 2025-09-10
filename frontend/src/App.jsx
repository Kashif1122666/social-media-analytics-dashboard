import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import YouTubeAnalysis from './pages/YouTubeAnalysis';
import RedditAnalysis from './pages/RedditAnalysis';
// import LinkedinAnalysis from './pages/LinkedInAnalysis';

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
       <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
       <Route path="/YouTubeAnalysis" element={<ProtectedRoute><YouTubeAnalysis /></ProtectedRoute>}/>
       <Route path="/RedditAnalysis" element={<ProtectedRoute><RedditAnalysis /></ProtectedRoute>}/>
       {/* <Route path="/linkedinAnalysis" element={<ProtectedRoute><LinkedinAnalysis /></ProtectedRoute>}/> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
     <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
};

export default App;

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RedditSuccess from './pages/RedditSuccess';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reddit-success" element={<RedditSuccess />} />
      {/* Optional: Add more routes here */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;

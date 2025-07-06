import { useEffect, useState, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext.jsx';

const RedditAnalytics = () => {
  const { theme } = useContext(ThemeContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/reddit/trending')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div
      className={`mt-10 p-6 rounded-xl border transition-all duration-300
        ${theme === 'dark'
          ? 'bg-white/5 border-cyan-500 text-white'
          : 'bg-cyan-50 border-cyan-600 text-black'
        }`}
    >
      <h2 className="text-xl font-semibold text-cyan-400 mb-4">Reddit Top Posts</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#2dd4bf' : '#94a3b8'} />
          <XAxis dataKey="title" hide interval="preserveStartEnd" />
          <YAxis tickFormatter={(value) => value + ' upt'} stroke={theme === 'dark' ? '#fff' : '#000'} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
              color: theme === 'dark' ? '#ffffff' : '#000000',
              border: '1px solid #00BFFF',
              borderRadius: '10px',
            }}
          />
          <Legend />
          <Bar dataKey="upvotes" fill="#00BFFF" />
          <Bar dataKey="comments" fill="#FF4500" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RedditAnalytics;

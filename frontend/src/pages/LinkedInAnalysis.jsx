// // src/pages/LinkedInAnalysis.jsx
// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { FaLinkedin } from "react-icons/fa";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { ThemeContext } from "../context/ThemeContext";

// const LinkedInAnalysis = () => {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState("");
//   const { theme } = useContext(ThemeContext);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/linkedin/analytics`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setData(res.data);
//       } catch (err) {
//         console.error("LinkedIn fetch error:", err.response?.data || err.message);
//         if (err.response?.status === 401) {
//           setError("Unauthorized – Please reconnect your LinkedIn account.");
//         } else {
//           setError("Failed to load LinkedIn analytics.");
//         }
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div
//       className={`min-h-screen p-6 ${
//         theme === "dark"
//           ? "bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white"
//           : "bg-gradient-to-r from-blue-50 via-white to-blue-50 text-gray-900"
//       }`}
//     >
//       <motion.div
//         className="max-w-5xl mx-auto p-8 rounded-2xl shadow-lg bg-opacity-30 backdrop-blur-lg bg-gray-800/40"
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <div className="flex items-center gap-3 mb-6">
//           <FaLinkedin className="text-4xl text-blue-600" />
//           <h1 className="text-3xl font-bold">LinkedIn Analytics</h1>
//         </div>

//         {error && (
//           <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4">{error}</p>
//         )}

//         {!data ? (
//           <p>Loading analytics...</p>
//         ) : (
//           <div className="space-y-8">
//             {/* Profile Info */}
//             <div className="p-4 bg-white/10 rounded-xl shadow-md">
//               <h2 className="text-xl font-semibold">Profile</h2>
//               <p className="mt-1">{data.profile.name}</p>
//               <p className="text-sm opacity-70">ID: {data.profile.id}</p>
//             </div>

//             {/* Followers */}
//             <div className="p-4 bg-white/10 rounded-xl shadow-md">
//               <h2 className="text-xl font-semibold mb-2">Followers</h2>
//               <p className="text-3xl font-bold text-blue-400">{data.followers}</p>
//             </div>

//             {/* Posts */}
//             <div className="p-4 bg-white/10 rounded-xl shadow-md">
//               <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
//               {data.posts.length === 0 ? (
//                 <p>No recent posts found.</p>
//               ) : (
//                 <ul className="space-y-3">
//                   {data.posts.map((post) => (
//                     <li
//                       key={post.id}
//                       className="p-3 bg-gray-700/30 rounded-lg shadow-sm"
//                     >
//                       <p className="font-medium">
//                         {post.text || "📌 No text content"}
//                       </p>
//                       <p className="text-sm opacity-70">
//                         {new Date(post.createdAt).toLocaleDateString()}
//                       </p>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>

//             {/* Followers Trend Chart (example) */}
//             <div className="p-4 bg-white/10 rounded-xl shadow-md">
//               <h2 className="text-xl font-semibold mb-4">Followers Trend</h2>
//               <ResponsiveContainer width="100%" height={250}>
//                 <LineChart
//                   data={[
//                     { name: "Jan", followers: data.followers - 30 },
//                     { name: "Feb", followers: data.followers - 15 },
//                     { name: "Mar", followers: data.followers },
//                   ]}
//                 >
//                   <XAxis dataKey="name" stroke={theme === "dark" ? "#fff" : "#000"} />
//                   <YAxis stroke={theme === "dark" ? "#fff" : "#000"} />
//                   <Tooltip />
//                   <Line
//                     type="monotone"
//                     dataKey="followers"
//                     stroke="#0A66C2"
//                     strokeWidth={3}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default LinkedInAnalysis;

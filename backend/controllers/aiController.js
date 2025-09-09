// import axios from "axios";

// export const askAssistant = async (req, res) => {
//   try {
//     const { youtubeData, userQuestion } = req.body;

//     // Send data + user question to Gemini API
//     const aiRes = await axios.post(
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
//       {
//         contents: [
//           {
//             parts: [
//               { text: `Here is some YouTube data: ${JSON.stringify(youtubeData)}.` },
//               { text: `The user asks: ${userQuestion}` },
//             ],
//           },
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
//         },
//       }
//     );

//     res.json({
//       response: aiRes.data.candidates[0].content.parts[0].text,
//     });
//   } catch (error) {
//     console.error("AI Analysis Error:", error.response?.data || error.message);
//     res.status(500).json({ error: "AI analysis failed" });
//   }
// };

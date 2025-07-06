import axios from 'axios';
const getTrending = async (req, res) => {
  try {
    const response = await axios.get('https://www.reddit.com/r/webdev/top.json?limit=5');
    const posts = response.data.data.children.map(post => ({
      title: post.data.title,
      upvotes: post.data.ups,
      comments: post.data.num_comments,
    }));
    res.json(posts);
  } catch (error) {
    console.error('Reddit API Error:', error.message); // 👈 log the error
    res.status(500).json({
      message: 'Error fetching trending posts',
    });
  }
};

export default getTrending;

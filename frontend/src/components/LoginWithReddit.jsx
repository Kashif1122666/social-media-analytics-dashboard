const LoginWithReddit = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/reddit';
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-xl"
    >
      🔗 Login with Reddit
    </button>
  );
};

export default LoginWithReddit;

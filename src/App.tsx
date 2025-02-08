import { useState } from 'react';
import { ChatContainer } from './components/chat/ChatContainer';
import { LandingPage } from './components/auth/LandingPage';
import { SignUp } from './components/auth/SignUp';
import { SignIn } from './components/auth/SignIn';
import './styles/animations.css';
import './styles/theme.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState<'landing' | 'signin' | 'signup' | 'chat'>('landing');
  
  const handleLogin = (email: string, password: string) => {
    if (email === 'example@gmail.com' && password === 'example123') {
      setCurrentPage('chat');
    }
  };

  const handleLogout = () => {
    setCurrentPage('landing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onGetStarted={() => setCurrentPage('signup')} onSignIn={() => setCurrentPage('signin')} />;
      case 'signup':
        return <SignUp onSignIn={() => setCurrentPage('signin')} />;
      case 'signin':
        return <SignIn onLogin={handleLogin} onSignUp={() => setCurrentPage('signup')} />;
      case 'chat':
        return <ChatContainer onLogout={handleLogout} />;
      default:
        return <LandingPage onGetStarted={() => setCurrentPage('signup')} onSignIn={() => setCurrentPage('signin')} />;
    }
  };

  return renderPage();
};

export default App
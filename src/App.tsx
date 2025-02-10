import { useState, useEffect } from 'react';
import { ChatContainer } from './components/chat/ChatContainer';
import { LandingPage } from './components/auth/LandingPage';
import { SignUp } from './components/auth/SignUp';
import { SignIn } from './components/auth/SignIn';
import { useAuth } from './hooks/useAuth';
import './styles/animations.css';
import './styles/theme.css';

type Page = 'landing' | 'signin' | 'signup' | 'chat';

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const { user, isAuthenticated, isLoading, checkAuth, login, logout } = useAuth();
  
  const checkAuthentication = async () => {
    await checkAuth();
    if (isAuthenticated) {
      setCurrentPage('chat');
    } else {
      setCurrentPage('landing');
    }
  };
  
  useEffect(() => {
    checkAuthentication();
    console.log("User in App: ", user);
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sage-600"></div>
      </div>
    );
  }

  const handleLogin = async (email: string, password: string) => {
    const success = await login(email, password);
    console.log("Login Response: ", success);
    if (isAuthenticated && success) {
      setCurrentPage('chat');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage 
            onGetStarted={() => setCurrentPage('signup')}
            onSignIn={() => setCurrentPage('signin')}
          />
        );
      case 'signup':
        return (
          <SignUp 
            onSignIn={() => setCurrentPage('signin')}
          />
        );
      case 'signin':
        return (
          <SignIn 
            onLogin={handleLogin}
            onSignUp={() => setCurrentPage('signup')}
          />
        );
      case 'chat':
        return <ChatContainer onLogout={() => {
          logout();
          setCurrentPage('landing');
        }} />;
      default:
        return <LandingPage 
          onGetStarted={() => setCurrentPage('signup')}
          onSignIn={() => setCurrentPage('signin')}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-sage-50">
      {renderPage()}
    </div>
  );
};

export default App;
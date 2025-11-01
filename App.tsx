import React, { useState, useEffect } from 'react';
import { Language, User } from './types';
import { LOCALIZATION_STRINGS } from './constants';
import Editor from "./components/Editor";
import LandingPage from './components/LandingPage';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.AR);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  const t = LOCALIZATION_STRINGS[language];

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [theme, language]);

  useEffect(() => {
    const storedUserString = localStorage.getItem('ai-photo-magic-user');
    if (storedUserString) {
      const storedUser: User = JSON.parse(storedUserString);
      
      if (storedUser.subscription && storedUser.subscription.expiryDate) {
        if (new Date(storedUser.subscription.expiryDate) < new Date()) {
          storedUser.subscription.active = false;
          
          localStorage.setItem('ai-photo-magic-user', JSON.stringify(storedUser));
          
          const allUsers = JSON.parse(localStorage.getItem('ai-photo-magic-users') || '{}');
          if (allUsers[storedUser.email]) {
            allUsers[storedUser.email].subscription = storedUser.subscription;
            localStorage.setItem('ai-photo-magic-users', JSON.stringify(allUsers));
          }
        }
      }
      setUser(storedUser);
    }
    setIsReady(true);
  }, []);

  const handleAuthSuccess = (authedUser: User) => {
    localStorage.setItem('ai-photo-magic-user', JSON.stringify(authedUser));
    setUser(authedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('ai-photo-magic-user');
    setUser(null);
  };
  
  const isSubscribed = user?.subscription?.active && user.subscription.expiryDate 
    ? new Date(user.subscription.expiryDate) > new Date()
    : false;

  if (!isReady) {
    return (
      <div className="dark">
        <div className="min-h-screen bg-gray-900">
          <Loader t={t} />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-cairo transition-colors duration-300 ${language === 'en' ? 'font-poppins' : 'font-cairo'}`}>
      {isSubscribed ? (
        <Editor 
          user={user}
          onLogout={handleLogout}
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          setTheme={setTheme}
          t={t}
        />
      ) : (
        <LandingPage
          onAuthSuccess={handleAuthSuccess}
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          setTheme={setTheme}
          t={t}
        />
      )}
    </div>
  );
};

export default App;

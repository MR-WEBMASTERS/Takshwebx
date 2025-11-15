
import React, { useState, useEffect } from 'react';
// Fix: Import firebase to provide the 'firebase' namespace for type annotations.
import firebase from 'firebase/compat/app';
import type { User } from './types';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import { auth, db } from './firebase';

type View = 'login' | 'signup';

const ADMIN_USERNAME = 'admin'; // Hardcoded admin username

const App: React.FC = () => {
  const [firebaseUser, setFirebaseUser] = useState<firebase.User | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [view, setView] = useState<View>('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      setIsLoading(true);
      if (user && user.email) {
        setFirebaseUser(user);
        
        const username = user.email.split('@')[0];

        if (username === ADMIN_USERNAME) {
          setIsAdmin(true);
          setUserData(null);
          setIsLoading(false);
        } else {
          setIsAdmin(false);
          const userDocRef = db.collection('users').doc(user.uid);
          const unsubscribeFirestore = userDocRef.onSnapshot(doc => {
            if (doc.exists) {
              setUserData(doc.data() as User);
            } else {
              console.error("User document not found in Firestore!");
            }
            setIsLoading(false);
          }, err => {
            console.error("Error fetching user data:", err);
            setIsLoading(false);
          });
          return () => unsubscribeFirestore();
        }
      } else {
        setFirebaseUser(null);
        setUserData(null);
        setIsAdmin(false);
        setIsLoading(false);
        setView('login');
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <h1 className="text-2xl text-slate-300 font-semibold animate-pulse">Initializing...</h1>
      </div>
    );
  }

  if (firebaseUser) {
    if (isAdmin) {
      return <AdminDashboard onLogout={handleLogout} />;
    }
    if (userData) {
      return <Dashboard user={userData} onLogout={handleLogout} />;
    }
    // Render loading state while userData is being fetched
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <h1 className="text-2xl text-slate-300 font-semibold animate-pulse">Loading Your Dashboard...</h1>
        </div>
    );
  }

  switch (view) {
    case 'signup':
      return <SignupPage onSignupSuccess={() => setView('login')} onSwitchToLogin={() => setView('login')} />;
    case 'login':
    default:
      return <LoginPage onSwitchToSignup={() => setView('signup')} />;
  }
};

export default App;

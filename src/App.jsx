import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { WalletProvider } from './contexts/WalletContext';
import { GoalsProvider } from './contexts/GoalsContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import CreateGoal from './pages/CreateGoal';
import GoalDetail from './pages/GoalDetail';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import Community from './pages/Community';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WalletProvider>
          <GoalsProvider>
            <Router>
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-accent-900 dark:to-accent-800 transition-colors duration-300">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/app" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="goals" element={<Goals />} />
                  <Route path="goal/new" element={<CreateGoal />} />
                  <Route path="goal/:id" element={<GoalDetail />} />
                  <Route path="rewards" element={<Rewards />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="community" element={<Community />} />
                </Route>
              </Routes>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--toast-bg)',
                    color: 'var(--toast-color)',
                    borderRadius: '12px',
                    border: '1px solid var(--toast-border)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
            </Router>
          </GoalsProvider>
        </WalletProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import TopicSelection from './pages/TopicSelection';
import Practice from './pages/Practice';
import Pronunciation from './pages/Pronunciation';
import DailyChallenge from './pages/DailyChallenge';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="topics" element={<TopicSelection />} />
            <Route path="practice" element={<Practice />} />
            <Route path="pronunciation" element={<Pronunciation />} />
            <Route path="daily" element={<DailyChallenge />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
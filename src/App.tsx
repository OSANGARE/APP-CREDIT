import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import Layout from './components/Layout/Layout';
import CreditsPage from './pages/CreditsPage/CreditsPage';
import CreditDetailsPage from './pages/CreditDetailsPage/CreditDetailsPage';
import CreateCreditPage from './pages/CreateCreditPage/CreateCreditPage';
import './App.css';

function App() {
  return (
    <ConfigProvider 
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
          colorBgContainer: '#ffffff',
        },
      }}
    >
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<CreditsPage />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="/credits/:id" element={<CreditDetailsPage />} />
            <Route path="/credits/new" element={<CreateCreditPage />} />
          </Routes>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
import React from 'react';
import Layout from './Components/layout/Layout';
import Page from './cards/Page';
import './App.css';

function App() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#F8F8F8] p-8 text-gray-500 transition-colors dark:bg-black dark:text-gray-300">
        <Page />
      </div>
    </Layout>
  );
}

export default App;
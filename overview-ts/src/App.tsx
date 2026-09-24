import Layout from './components/Layout'
import './App.css';
import Overview from './features/overview/index'

function App() {
  return (
    <Layout>
      <div className="bg-neutral-100 min-h-full p-8 text-gray-500 transition-colors dark:bg-black dark:text-gray-300">
        <Overview />
      </div>
    </Layout>
  );
}

export default App;
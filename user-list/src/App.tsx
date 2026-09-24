import Layout from './components/Layout'
import './App.css';
import UserList from './features/user-list/index'

function App() {
  return (
    <Layout>
      <div className="bg-neutral-100 min-h-full p-8 text-gray-500 transition-colors dark:bg-black dark:text-gray-300">
        <UserList />
      </div>
    </Layout>
  );
}

export default App;
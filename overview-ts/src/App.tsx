import './App.css';
import Overview from './features/overview/index'

function App() {
  return (
      <div className="bg-neutral-100 min-h-full p-8 text-gray-500 transition-colors dark:bg-black dark:text-gray-300">
        <Overview />
      </div>
  );
}

export default App;
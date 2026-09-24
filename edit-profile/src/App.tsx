import './App.css';
import EditProfile from './features/edit-profile'

function App() {
  return (
      <div className="bg-neutral-100 min-h-full p-8 text-gray-500 transition-colors dark:bg-black dark:text-gray-300">
        <EditProfile />
      </div>
  );
}

export default App;
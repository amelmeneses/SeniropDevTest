import { ArticleProvider } from './context/ArticleContext';
import { Dashboard } from './pages/Dashboard';

// Root application component.
// Wraps the entire app with ArticleProvider so all children
// can access the global article state via React Context.
function App() {
  return (
    <ArticleProvider>
      <Dashboard />
    </ArticleProvider>
  );
}

export default App;

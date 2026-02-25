import { useState } from 'react';
import { ArticleProvider } from './context/ArticleContext';
import { Dashboard } from './pages/Dashboard';
import { LiveSite } from './pages/LiveSite';

// Root application component.
// Wraps the entire app with ArticleProvider so all children
// can access the global article state via React Context.
function App() {
  const [currentView, setCurrentView] = useState<{ page: 'dashboard' } | { page: 'live'; articleId: string }>({ page: 'dashboard' });

  return (
    <ArticleProvider
      onGotoArticle={(id) => setCurrentView({ page: 'live', articleId: id })}
    >
      {currentView.page === 'dashboard' ? (
        <Dashboard />
      ) : (
        <LiveSite
          articleId={currentView.articleId}
          onBack={() => setCurrentView({ page: 'dashboard' })}
        />
      )}
    </ArticleProvider>
  );
}

export default App;

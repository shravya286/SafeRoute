import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught React Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', textAlign: 'center', backgroundColor: '#FFF5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ color: '#D32F2F', marginBottom: '16px' }}>⚠️ Application Encountered an Error</h2>
          <p style={{ color: '#555', maxWidth: '600px', marginBottom: '20px', wordBreak: 'break-word' }}>
            {this.state.error?.toString()}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '10px 24px', backgroundColor: '#9C7568', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

import { Component } from 'react';
import { clearAppStorage } from '../../hooks/useLocalStorage';

// Catches render crashes (e.g. outdated demo data in localStorage) so the user never sees a blank page.
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info?.componentStack);
  }

  reset = () => {
    clearAppStorage();
    window.location.href = '/';
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50 p-6">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lift">
          <h1 className="font-display text-2xl font-bold text-navy-900">Not available in demo</h1>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => window.location.reload()} className="rounded-full border border-navy-200 px-5 py-2.5 text-sm font-semibold text-navy-700 hover:bg-navy-50">Reload page</button>
            <button onClick={this.reset} className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Reset saved data &amp; reload</button>
          </div>
        </div>
      </div>
    );
  }
}

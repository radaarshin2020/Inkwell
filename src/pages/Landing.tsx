import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function Landing() {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Header */}
      <header className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-ink-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
            <span className="font-logo text-xl sm:text-2xl italic text-ink-800">Inkwell</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="sm:text-base">Sign In</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button size="sm" className="sm:text-base">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-ink-800 leading-tight mb-4 sm:mb-6">
            Write with <span className="text-accent-500">Knowledge</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-ink-500 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            An intelligent document editor that understands your references. 
            Add your knowledge, and let AI help you craft the perfect document.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/auth?mode=signup" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Start Writing Free
                <svg className="w-5 h-5 sparkle-animation" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l2.4 7.2L22 12l-7.6 2.4L12 22l-2.4-7.2L2 12l7.6-2.4L12 2z" />
                </svg>
              </Button>
            </Link>
            <Link to="/auth" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">Sign In</Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Feature Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-cream-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-ink-800 text-center mb-10 sm:mb-16">
            Everything you need to write beautifully
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-8">
              <div className="w-14 h-14 bg-cream-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink-700 mb-3">Knowledge Library</h3>
              <p className="text-ink-500 leading-relaxed">
                Add reference documents, notes, and research. Your AI assistant uses them to inform every word.
              </p>
            </div>
            <div className="text-center p-4 sm:p-8">
              <div className="w-14 h-14 bg-cream-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink-700 mb-3">AI Writing Partner</h3>
              <p className="text-ink-500 leading-relaxed">
                Chat with AI that understands your context. Get suggestions, expand ideas, or let it write entire sections.
              </p>
            </div>
            <div className="text-center p-4 sm:p-8 sm:col-span-2 md:col-span-1">
              <div className="w-14 h-14 bg-cream-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink-700 mb-3">Rich Text Editing</h3>
              <p className="text-ink-500 leading-relaxed">
                A beautiful, distraction-free editor with all the formatting tools you need for professional documents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-cream-100 border-t border-cream-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
            <span className="font-logo text-lg italic text-ink-500">Inkwell</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center">
            <Link to="/style-guide" className="text-ink-400 text-sm hover:text-ink-600 transition-colors">
              Style Guide
            </Link>
            <p className="text-ink-400 text-sm">
              © 2026 Inkwell. Write beautifully.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


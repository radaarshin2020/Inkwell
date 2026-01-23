import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function StyleGuide() {
  return (
    <div className="style-guide-page min-h-screen bg-[#FAF9F6] text-[#1A1A1A] p-8 md:p-16">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .style-guide-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .style-guide-page h1, 
        .style-guide-page h2, 
        .style-guide-page h3, 
        .style-guide-page .font-serif-display {
          font-family: 'Libre Baskerville', serif;
          letter-spacing: -0.025em;
        }

        .neomorphic-surface {
          background: #FFFFFF;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
          border-radius: 24px;
        }

        .neomorphic-button-inset:active {
          box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.05);
        }

        .glass-surface {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .status-indicator {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .mention-tag {
          background: #F5F2EF;
          color: #6E6E73;
          padding: 2px 8px;
          border-radius: 100px;
          font-weight: 500;
          font-size: 0.9em;
        }

        .action-bar {
          background: var(--button-3d-bg);
          color: #FFFFFF;
          border-radius: 100px;
          padding: 12px 24px;
          box-shadow: var(--button-3d-shadow), 0 20px 40px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .action-bar:hover {
          transform: translateY(-2px);
          box-shadow: var(--button-3d-hover-shadow), 0 25px 50px rgba(0, 0, 0, 0.3);
          filter: brightness(1.1);
        }

        .action-bar button {
          transition: all 0.2s ease;
        }

        .action-bar button:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }

        .action-bar button:active {
          transform: scale(0.95);
        }

        .shadow-small {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .shadow-medium {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
        }

        .shadow-large {
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="max-w-5xl mx-auto space-y-24">
        {/* Header */}
        <header className="space-y-4">
          <Link to="/" className="text-sm font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors">← Back to App</Link>
          <h1 className="text-6xl text-[#1D1D1F]">Design Guidelines</h1>
          <p className="text-xl text-[#86868B] max-w-2xl">
            A visual representation of the Inkwell 'Mindful Productivity' design system. 
            Tactile depth, organic softness, and focused minimalism.
          </p>
        </header>

        {/* Typography Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl">Typography</h2>
            <div className="h-px flex-1 bg-[#E5E5E5]" />
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#86868B]">Heading Font: Libre Baskerville</span>
              <div className="space-y-2">
                <p className="text-6xl">The quick brown fox</p>
                <p className="text-4xl text-[#86868B]">Jumps over the lazy dog</p>
              </div>
            </div>
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#86868B]">Body Font: Plus Jakarta Sans</span>
              <div className="space-y-4 text-lg text-[#1D1D1F]">
                <p className="font-normal text-xl leading-relaxed">
                  Inkwell represents a shift toward 'Mindful Productivity'—an interface that feels as soft as paper but as powerful as modern software.
                </p>
                <p className="font-medium">Medium Weight - 500</p>
                <p className="font-semibold">Semibold Weight - 600</p>
                <p className="font-bold">Bold Weight - 700</p>
              </div>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl">Color Palette</h2>
            <div className="h-px flex-1 bg-[#E5E5E5]" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6">
            <div className="space-y-3">
              <div className="h-24 w-full rounded-2xl bg-[#FAF9F6] border border-[#E5E5E5]" />
              <div>
                <p className="font-semibold text-sm">Background</p>
                <code className="text-xs text-[#6E6E73]">#FAF9F6</code>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-24 w-full rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5]" />
              <div>
                <p className="font-semibold text-sm">Surface</p>
                <code className="text-xs text-[#6E6E73]">#FFFFFF</code>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-24 w-full rounded-2xl bg-[#2D2D30]" />
              <div>
                <p className="font-semibold text-sm">Dark Surface</p>
                <code className="text-xs text-[#6E6E73]">#2D2D30</code>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-24 w-full rounded-2xl bg-[#5858D6]" />
              <div>
                <p className="font-semibold text-sm">Action / Accent</p>
                <code className="text-xs text-[#6E6E73]">#5858D6</code>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-24 w-full rounded-2xl bg-[#1A1A1A]" />
              <div>
                <p className="font-semibold text-sm">Text Primary</p>
                <code className="text-xs text-[#6E6E73]">#1A1A1A</code>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-24 w-full rounded-2xl bg-[#6E6E73]" />
              <div>
                <p className="font-semibold text-sm">Text Secondary</p>
                <code className="text-xs text-[#6E6E73]">#6E6E73</code>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-24 w-full rounded-2xl bg-[#34C759]" />
              <div>
                <p className="font-semibold text-sm">Success</p>
                <code className="text-xs text-[#6E6E73]">#34C759</code>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-24 w-full rounded-2xl bg-[#F5F2EF] border border-[#E5E5E5]" />
              <div>
                <p className="font-semibold text-sm">Toolbar</p>
                <code className="text-xs text-[#6E6E73]">#F5F2EF</code>
              </div>
            </div>
          </div>
        </section>

        {/* Shadow Depths */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl">Shadow Depths</h2>
            <div className="h-px flex-1 bg-[#E5E5E5]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="h-32 w-full rounded-2xl bg-white shadow-small flex items-center justify-center">
                <span className="text-sm font-medium text-[#6E6E73]">Small Shadow</span>
              </div>
              <div>
                <p className="font-semibold text-sm">Shadow Small</p>
                <code className="text-xs text-[#6E6E73]">0 2px 8px rgba(0,0,0,0.04)</code>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-32 w-full rounded-2xl bg-white shadow-medium flex items-center justify-center">
                <span className="text-sm font-medium text-[#6E6E73]">Medium Shadow</span>
              </div>
              <div>
                <p className="font-semibold text-sm">Shadow Medium</p>
                <code className="text-xs text-[#6E6E73]">0 8px 30px rgba(0,0,0,0.06)</code>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-32 w-full rounded-2xl bg-white shadow-large flex items-center justify-center">
                <span className="text-sm font-medium text-[#6E6E73]">Large Shadow</span>
              </div>
              <div>
                <p className="font-semibold text-sm">Shadow Large</p>
                <code className="text-xs text-[#6E6E73]">0 16px 48px rgba(0,0,0,0.1)</code>
              </div>
            </div>
          </div>
        </section>

        {/* UI Components */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl">UI Components</h2>
            <div className="h-px flex-1 bg-[#E5E5E5]" />
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Buttons */}
            <div className="space-y-8">
              <h3 className="text-2xl text-[#6E6E73]">Buttons</h3>
              <div className="flex flex-wrap items-center gap-6">
                <Button className="px-8 py-3 gap-3">
                  Primary 3D Pill
                  <svg className="w-5 h-5 sparkle-animation text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l2.4 7.2L22 12l-7.6 2.4L12 22l-2.4-7.2L2 12l7.6-2.4L12 2z" />
                  </svg>
                </Button>
                <Button variant="secondary" className="px-8 py-3">
                  Secondary 3D Pill
                </Button>
                <Button variant="ghost" className="p-4">
                  Ghost Style
                </Button>
              </div>
            </div>

            {/* Mentions & Tags */}
            <div className="space-y-8">
              <h3 className="text-2xl text-[#6E6E73]">Mentions & Tags</h3>
              <div className="flex flex-wrap items-center gap-4">
                <p className="text-lg">
                  Here are the files you needed <span className="mention-tag">@masum</span> 📁 🏀
                </p>
                <div className="flex gap-2">
                  <span className="mention-tag">#research</span>
                  <span className="mention-tag">#planning</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cards & Previews */}
          <div className="space-y-8 pt-8">
            <h3 className="text-2xl text-[#6E6E73]">Cards & Previews</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="neomorphic-surface p-4 relative group cursor-pointer hover:scale-[1.02] transition-transform">
                  <div className="aspect-[4/3] bg-[#F5F2EF] rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                    <svg className="w-12 h-12 text-[#E5E5E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="font-semibold">Preview Document {i}</p>
                  <p className="text-sm text-[#6E6E73]">Modified 2 hours ago</p>
                  
                  {/* Status Indicator */}
                  <div className="absolute top-2 right-2 status-indicator">
                    {i === 1 ? (
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="w-3 h-3 border-2 border-[#E5E5E5] border-t-[#2D2D30] rounded-full animate-spin" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Toolbars & Action Bars */}
          <div className="space-y-8 pt-8">
            <h3 className="text-2xl text-[#6E6E73]">Toolbars & Action Bars</h3>
            <div className="space-y-12">
              {/* Rich Text Toolbar */}
              <div className="flex items-center justify-center p-12 bg-white rounded-[32px] border border-[#E5E5E5]">
                <div className="flex items-center gap-1 p-2 neomorphic-surface">
                  <div className="px-4 py-2 hover:bg-[#FAF9F6] rounded-xl cursor-pointer font-medium border-r border-[#FAF9F6] mr-1">
                    Regular Font <span className="text-xs ml-2 text-[#6E6E73]">▾</span>
                  </div>
                  <button className="p-3 bg-[#FAF9F6] neomorphic-button-inset rounded-xl">
                    <span className="font-bold">B</span>
                  </button>
                  <button className="p-3 hover:bg-[#FAF9F6] rounded-xl transition-colors italic">I</button>
                  <button className="p-3 hover:bg-[#FAF9F6] rounded-xl transition-colors line-through">S</button>
                  <button className="p-3 hover:bg-[#FAF9F6] rounded-xl transition-colors underline">U</button>
                  <div className="w-px h-6 bg-[#E5E5E5] mx-1" />
                  <button className="p-3 hover:bg-[#FAF9F6] rounded-xl transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.1-1.1" /></svg>
                  </button>
                  <div className="w-px h-6 bg-[#E5E5E5] mx-1" />
                  <button className="p-3 hover:bg-[#FAF9F6] rounded-xl transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                  </button>
                </div>
              </div>

              {/* Floating Action Bar */}
              <div className="flex justify-center pt-8">
                <div className="action-bar flex items-center gap-8">
                  <Button variant="ghost" className="p-2 !rounded-full hover:bg-white/10 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </Button>
                  <Button variant="ghost" className="p-2 !rounded-full hover:bg-white/10 transition-colors">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </Button>
                  <Button variant="ghost" className="p-2 !rounded-full hover:bg-white/10 transition-colors">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </Button>
                  <div className="w-px h-8 bg-white/20" />
                  <Button variant="ghost" className="p-2 !rounded-full hover:bg-white/10 transition-colors">
                    <svg className="w-7 h-7" style={{ color: '#5858D6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </Button>
                  <Button variant="ghost" className="p-2 !rounded-full hover:bg-white/10 transition-colors">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Statement Footer */}
        <footer className="pt-24 pb-12 border-t border-[#E5E5E5] text-center space-y-4">
          <p className="text-sm font-bold uppercase tracking-widest text-[#6E6E73]">Creative Vision</p>
          <p className="text-3xl max-w-3xl mx-auto italic font-serif-display">
            "Inkwell represents a shift toward 'Mindful Productivity'—an interface that feels as soft as paper but as powerful as modern software."
          </p>
        </footer>
      </div>
    </div>
  );
}

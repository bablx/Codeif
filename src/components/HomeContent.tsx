'use client';

import Navbar from '@/components/Navbar';
import IDE from '@/components/IDE';

function isLoggedIn() {
  try { return !!localStorage.getItem('sf_user'); } catch { return false; }
}

export default function HomeContent() {
  const handleStartClick = () => {
    window.location.href = isLoggedIn() ? '/dashboard' : '/login';
  };

  const handleLearnMoreClick = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSignupClick = () => {
    window.location.href = isLoggedIn() ? '/dashboard' : '/signup';
  };

  const handleEnterGarageClick = () => {
    window.location.href = isLoggedIn() ? '/dashboard' : '/signup';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Side - Text Content */}
          <div className="lg:w-1/2 text-left">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
              PROVE YOUR <span className="text-purple-400">STACK</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Engineering challenges that matter
            </p>
            <div className="text-lg text-gray-400 mb-8 max-w-xl space-y-1">
              <p>Focus on the logic, not the dev-ops</p>
              <p>We provide the infrastructure</p>
              <p>You provide the solution</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <button
                onClick={handleStartClick}
                className="group relative bg-[#7030E0] text-white px-10 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-[#8B4CFF] transition-all duration-300 shadow-lg shadow-[#7030E0]/50 hover:shadow-[#7030E0]/70 transform hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">START</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
              </button>
              <button
                onClick={handleSignupClick}
                className="border border-purple-400/50 text-purple-400 px-8 py-3 rounded-lg font-medium hover:bg-purple-400/10 hover:border-purple-400 transition-all duration-300"
              >
                SIGN UP
              </button>
              <button
                onClick={handleLearnMoreClick}
                className="border border-[#7030E0]/50 text-[#7030E0] px-8 py-3 rounded-lg font-medium hover:bg-[#7030E0]/10 hover:border-[#7030E0] transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Side - IDE */}
          <div className="lg:w-1/2 flex items-center justify-center">
            <IDE />
          </div>
        </div>
      </main>

      {/* Bottom Section - Feature Boxes */}
      <div id="features" className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800 hover:border-[#7030E0]/50 transition-all duration-300">
              <div className="w-12 h-12 bg-[#7030E0] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Fast Performance</h3>
              <p className="text-gray-500 text-sm">Run code instantly with our high-speed execution engine. No setup, no wait.</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800 hover:border-[#7030E0]/50 transition-all duration-300">
              <div className="w-12 h-12 bg-[#7030E0] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Multi-Language</h3>
              <p className="text-gray-500 text-sm">Python, JavaScript, C++, Java — all supported out of the box.</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800 hover:border-[#7030E0]/50 transition-all duration-300">
              <div className="w-12 h-12 bg-[#7030E0] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Verified Rankings</h3>
              <p className="text-gray-500 text-sm">Compete on a fair leaderboard with verified, proctored submissions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Problem/Pain Points Section */}
      <div className="bg-gray-950 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-2xl font-bold text-gray-600 mb-8">The Friction</h2>
              <div className="space-y-4">
                {["Daily environment rebuilding.", "Mental fatigue from context-switching.", "Account authentication hurdles.", "Volatile, non-persistent layouts."].map((item) => (
                  <div key={item} className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-red-900/30 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="text-gray-400">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2">
              <h2 className="text-2xl font-bold text-white mb-8">The Standard</h2>
              <div className="relative bg-gray-900 rounded-lg border border-[#7030E0] shadow-2xl shadow-[#7030E0]/30 overflow-hidden">
                <div className="absolute inset-0 bg-[#7030E0]/5 rounded-lg"></div>
                <div className="relative bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="bg-gray-700 rounded px-3 py-1 text-xs text-gray-400 inline-block">State-Locked</div>
                  </div>
                  <div className="w-16"></div>
                </div>
                <div className="relative p-4">
                  <div className="flex space-x-2 mb-4">
                    <div className="bg-gray-800 px-3 py-1 rounded text-xs text-[#7030E0] border border-[#7030E0]/30">project-alpha</div>
                    <div className="bg-gray-800 px-3 py-1 rounded text-xs text-gray-400 border border-gray-700">project-beta</div>
                    <div className="bg-gray-800 px-3 py-1 rounded text-xs text-gray-400 border border-gray-700">project-gamma</div>
                  </div>
                  <div className="absolute bottom-2 left-4 right-4 bg-gray-800 rounded px-3 py-1 text-xs text-[#7030E0] border border-[#7030E0]/20">
                    STATUS: PERSISTENT | LATENCY: 0ms
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THE CODEIF STANDARD Comparison Section */}
      <div className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">THE CODEIF STANDARD</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">Professional workspaces. Zero friction.</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="divide-y divide-gray-800 border border-gray-800">
              <div className="grid grid-cols-3 text-sm">
                <div className="text-left text-gray-400 py-3 px-4 border-r border-gray-800"><div className="font-mono uppercase tracking-wider">FEATURE</div></div>
                <div className="text-center py-3 px-4 border-r border-gray-800"><div className="font-mono uppercase tracking-wider text-[#7030E0]">CODEIF</div></div>
                <div className="text-center py-3 px-4 text-red-400"><div className="font-mono uppercase tracking-wider">SYSTEM</div></div>
              </div>
              {[["MEMORY","[✓] Permanent","[✗] Temporary"],["SECURITY","[✓] Hardened","[✗] Exposed"],["SETUP","[✓] Zero","[✗] Manual"],["CREDENTIALS","[✓] Official","[✗] Missing"],["RESOURCES","[✓] Dedicated","[✗] Shared"]].map(([feature, good, bad]) => (
                <div key={feature} className="grid grid-cols-3 text-sm">
                  <div className="text-gray-400 py-3 px-4 border-r border-gray-800">{feature}</div>
                  <div className="text-center py-3 px-4 border-r border-gray-800 text-[#7030E0]">{good}</div>
                  <div className="text-center py-3 px-4 text-red-400">{bad}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">READY TO CODEIF?</h2>
            <p className="text-lg text-gray-500 mb-8">Claim your workspace. Secure your state.</p>
            <button
              onClick={handleEnterGarageClick}
              className="bg-[#7030E0] text-white px-12 py-4 rounded-lg font-bold text-lg hover:bg-[#8B4CFF] transition-all duration-300 shadow-lg shadow-[#7030E0]/50 hover:shadow-[#7030E0]/70 transform hover:scale-105"
            >
              ENTER THE GARAGE
            </button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div className="text-center md:text-left">
              <div className="text-white font-bold mb-1">CODEIF</div>
              <div className="text-gray-500">The Engineering Standard</div>
            </div>
            <div className="text-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-gray-500">
                <a href="/privacy" className="hover:text-[#7030E0] transition-colors">Privacy Policy</a>
                <span className="hidden md:inline">|</span>
                <a href="/terms" className="hover:text-[#7030E0] transition-colors">Terms of Service</a>
                <span className="hidden md:inline">|</span>
                <a href="/faq" className="hover:text-[#7030E0] transition-colors">FAQ</a>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-pulse"></div>
                <span className="text-gray-500">SYSTEM STATUS: NOMINAL</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-6 text-xs text-gray-600">CODEIF PROTOCOL v1.0.26</div>
        </div>
      </footer>
    </div>
  );
}

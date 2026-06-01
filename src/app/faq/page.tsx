import Navbar from "@/components/Navbar";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* FAQ Section */}
      <div className="bg-black py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              FAQ
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about Codeif.
            </p>
          </div>
          
          {/* FAQ Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* FAQ Item 1 */}
            <div className="border border-gray-700 rounded-lg p-6 bg-black">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-[#7030E0] rounded-full shadow-lg shadow-[#7030E0]/50 animate-pulse"></div>
                <h3 className="text-white text-lg font-bold">Is my work safe and private?</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Yes. Codeif gives you a private, armored workspace. Your code is locked away from everyone else, and a crash in one project never touches the rest of your system.
              </p>
            </div>
            
            {/* FAQ Item 2 */}
            <div className="border border-gray-700 rounded-lg p-6 bg-black">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-[#7030E0] rounded-full shadow-lg shadow-[#7030E0]/50 animate-pulse"></div>
                <h3 className="text-white text-lg font-bold">How do I earn trophies?</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                By solving real problems. Once our system verifies your fix is perfect, we issue an official digital badge that proves your skill to the world.
              </p>
            </div>
            
            {/* FAQ Item 3 */}
            <div className="border border-gray-700 rounded-lg p-6 bg-black">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-[#7030E0] rounded-full shadow-lg shadow-[#7030E0]/50 animate-pulse"></div>
                <h3 className="text-white text-lg font-bold">Can I switch between computers?</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Seamlessly. Your entire workspace—every open tab and terminal—follows you. Just log in on any device and pick up exactly where you left off, no setup required.
              </p>
            </div>
            
            {/* FAQ Item 4 */}
            <div className="border border-gray-700 rounded-lg p-6 bg-black">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-[#7030E0] rounded-full shadow-lg shadow-[#7030E0]/50 animate-pulse"></div>
                <h3 className="text-white text-lg font-bold">Do I need a powerful laptop?</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                No. Codeif handles the heavy lifting in our high-speed engine room. You can build massive, complex projects on any basic device without it ever slowing down.
              </p>
            </div>
            
            {/* FAQ Item 5 */}
            <div className="border border-gray-700 rounded-lg p-6 bg-black">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-[#7030E0] rounded-full shadow-lg shadow-[#7030E0]/50 animate-pulse"></div>
                <h3 className="text-white text-lg font-bold">Is Codeif hard to learn?</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Not at all. If you know how to use a web browser, you know how to use Codeif. We designed the interface to feel familiar, clean, and intuitive from the second you log in.
              </p>
            </div>
            
            {/* FAQ Item 6 */}
            <div className="border border-gray-700 rounded-lg p-6 bg-black">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-[#7030E0] rounded-full shadow-lg shadow-[#7030E0]/50 animate-pulse"></div>
                <h3 className="text-white text-lg font-bold">Does it work with my languages?</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Absolutely. From web development in React to backend scripting in Python or Rust, Codeif comes pre-configured with the engines you need to build anything.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Codeif &copy; 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

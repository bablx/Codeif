import Navbar from '@/components/Navbar';
import RankSection from '@/components/dashboard/RankSection';

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Leaderboard
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            See how you rank against other competitors. Rankings are based on the number of questions solved and total time taken.
          </p>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
          <RankSection />
        </div>
      </main>
    </div>
  );
}

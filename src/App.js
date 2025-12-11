import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

function App() {
  const [creators, setCreators] = useState([]);
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [newCreator, setNewCreator] = useState({
    handle: '',
    platform: 'Instagram',
    tier: '',
    followerCount: '',
    avgViews: '',
    organicRate: '',
    sponsoredRate: ''
  });

  // Mock database of creator data that auto-populates based on handle + platform
  const creatorDatabase = {
    '@example_creator_1-Instagram': {
      tier: 'Micro',
      followerCount: 50000,
      avgViews: 25000,
      organicRate: 5.2,
      sponsoredRate: 3.8
    },
    '@example_creator_2-YouTube': {
      tier: 'Mid',
      followerCount: 250000,
      avgViews: 150000,
      organicRate: 4.8,
      sponsoredRate: 3.2
    },
    '@example_creator_3-TikTok': {
      tier: 'Macro',
      followerCount: 500000,
      avgViews: 400000,
      organicRate: 6.5,
      sponsoredRate: 4.5
    },
    '@creator_alpha-Instagram': {
      tier: 'Nano',
      followerCount: 15000,
      avgViews: 8000,
      organicRate: 6.8,
      sponsoredRate: 4.2
    },
    '@creator_beta-TikTok': {
      tier: 'Mega',
      followerCount: 2000000,
      avgViews: 1500000,
      organicRate: 7.2,
      sponsoredRate: 5.1
    },
    '@tech_guru-YouTube': {
      tier: 'Mid',
      followerCount: 180000,
      avgViews: 95000,
      organicRate: 5.5,
      sponsoredRate: 3.9
    }
  };

  // Handle creator lookup when handle or platform changes
  const handleCreatorLookup = (handle, platform) => {
    const key = `${handle}-${platform}`;
    const creatorData = creatorDatabase[key];
    
    if (creatorData) {
      setNewCreator({
        handle,
        platform,
        tier: creatorData.tier,
        followerCount: creatorData.followerCount,
        avgViews: creatorData.avgViews,
        organicRate: creatorData.organicRate,
        sponsoredRate: creatorData.sponsoredRate
      });
    } else {
      // Reset if no match found
      setNewCreator({
        handle,
        platform,
        tier: '',
        followerCount: '',
        avgViews: '',
        organicRate: '',
        sponsoredRate: ''
      });
    }
  };

  const addCreator = () => {
    if (newCreator.handle && newCreator.tier) {
      setCreators([...creators, {
        ...newCreator,
        id: Date.now(),
        followerCount: parseInt(newCreator.followerCount),
        avgViews: parseInt(newCreator.avgViews),
        organicRate: parseFloat(newCreator.organicRate),
        sponsoredRate: parseFloat(newCreator.sponsoredRate)
      }]);
      setNewCreator({
        handle: '',
        platform: 'Instagram',
        tier: '',
        followerCount: '',
        avgViews: '',
        organicRate: '',
        sponsoredRate: ''
      });
      setShowCreatorModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-slate-900 mb-2">Creator Management</h1>
          <p className="text-slate-600">Build and manage your influencer creator database</p>
        </div>

        {/* Creator Database */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-cyan-600">Creator Database</h2>
              <p className="text-slate-600 text-sm">Add creators to build your roster</p>
            </div>
            <button
              onClick={() => setShowCreatorModal(true)}
              className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition"
            >
              <Plus size={20} />
              Add Creator
            </button>
          </div>

          {creators.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg">
              <p className="text-slate-500 text-lg mb-2">No creators added yet</p>
              <p className="text-slate-400 text-sm">Click "Add Creator" to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-cyan-50 text-left">
                    <th className="p-3 font-semibold text-slate-700">Handle</th>
                    <th className="p-3 font-semibold text-slate-700">Platform</th>
                    <th className="p-3 font-semibold text-slate-700">Tier</th>
                    <th className="p-3 font-semibold text-slate-700">Followers</th>
                    <th className="p-3 font-semibold text-slate-700">Avg Views</th>
                    <th className="p-3 font-semibold text-slate-700">Organic Rate %</th>
                    <th className="p-3 font-semibold text-slate-700">Sponsored Rate %</th>
                  </tr>
                </thead>
                <tbody>
                  {creators.map((creator, idx) => (
                    <tr key={creator.id} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="p-3 font-medium text-slate-900">{creator.handle}</td>
                      <td className="p-3 text-slate-700">{creator.platform}</td>
                      <td className="p-3 text-slate-700">{creator.tier}</td>
                      <td className="p-3 text-slate-700">{creator.followerCount.toLocaleString()}</td>
                      <td className="p-3 text-slate-700">{creator.avgViews.toLocaleString()}</td>
                      <td className="p-3 text-slate-700">{creator.organicRate}%</td>
                      <td className="p-3 text-slate-700">{creator.sponsoredRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Creator Modal */}
        {showCreatorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Add New Creator</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Handle</label>
                  <input
                    type="text"
                    value={newCreator.handle}
                    onChange={(e) => handleCreatorLookup(e.target.value, newCreator.platform)}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Platform</label>
                  <select
                    value={newCreator.platform}
                    onChange={(e) => handleCreatorLookup(newCreator.handle, e.target.value)}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-cyan-500 focus:outline-none"
                  >
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>YouTube</option>
                    <option>Twitter</option>
                  </select>
                </div>

                {/* Auto-populated fields */}
                {newCreator.tier && (
                  <>
                    <div className="bg-cyan-50 p-4 rounded-lg border-2 border-cyan-200">
                      <p className="text-sm font-semibold text-cyan-800 mb-3">✓ Creator data loaded from database</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Tier</label>
                          <p className="text-sm font-bold text-slate-900">{newCreator.tier}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Follower Count</label>
                          <p className="text-sm font-bold text-slate-900">{newCreator.followerCount.toLocaleString()}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Avg Views</label>
                          <p className="text-sm font-bold text-slate-900">{newCreator.avgViews.toLocaleString()}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Organic Rate</label>
                          <p className="text-sm font-bold text-slate-900">{newCreator.organicRate}%</p>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">Sponsored Rate</label>
                          <p className="text-sm font-bold text-slate-900">{newCreator.sponsoredRate}%</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {!newCreator.tier && newCreator.handle && (
                  <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-200">
                    <p className="text-sm font-semibold text-amber-800 mb-2">
                      ⚠️ Creator not found in database
                    </p>
                    <p className="text-xs text-amber-700">
                      Try: @example_creator_1, @example_creator_2, @example_creator_3, @creator_alpha, @creator_beta, or @tech_guru
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={addCreator}
                  disabled={!newCreator.tier}
                  className={`flex-1 py-2 rounded-lg transition font-semibold ${
                    newCreator.tier 
                      ? 'bg-cyan-500 text-white hover:bg-cyan-600' 
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Add Creator
                </button>
                <button
                  onClick={() => {
                    setShowCreatorModal(false);
                    setNewCreator({
                      handle: '',
                      platform: 'Instagram',
                      tier: '',
                      followerCount: '',
                      avgViews: '',
                      organicRate: '',
                      sponsoredRate: ''
                    });
                  }}
                  className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
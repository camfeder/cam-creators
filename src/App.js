import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';

function App() {
  const [campaignSetup, setCampaignSetup] = useState(null);
  const [creators, setCreators] = useState([]);
  const [selectedCreators, setSelectedCreators] = useState([]);
  const [campaignCreators, setCampaignCreators] = useState([]);
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCreatorData, setNewCreatorData] = useState(null);
  const [platformSelections, setPlatformSelections] = useState({});
  const [simulationResults, setSimulationResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Collapse/expand state for sections
  const [isCreatorDatabaseExpanded, setIsCreatorDatabaseExpanded] = useState(true);
  const [isCampaignExpanded, setIsCampaignExpanded] = useState(true);
  const [isSimulationResultsExpanded, setIsSimulationResultsExpanded] = useState(true);

  // Campaign setup form state
  const [setupForm, setSetupForm] = useState({
    budget: '',
    campaignType: 'Awareness',
    targetImpressions: '',
    creatorCount: ''
  });

  // Mock database of creator data grouped by creator name with social network breakdowns
  const creatorDatabase = {
    'Brett Chody': {
      name: 'Brett Chody',
      platforms: {
        'Instagram': {
          handle: '@brettchody',
          tier: 'Micro',
          followerCount: 50000,
          avgViews: 25000,
          organicRate: 5.2,
          sponsoredRate: 3.8
        },
        'TikTok': {
          handle: '@brettchody',
          tier: 'Mid',
          followerCount: 125000,
          avgViews: 85000,
          organicRate: 6.8,
          sponsoredRate: 4.5
        },
        'YouTube': {
          handle: '@brettchodyvlogs',
          tier: 'Micro',
          followerCount: 35000,
          avgViews: 18000,
          organicRate: 4.9,
          sponsoredRate: 3.2
        }
      }
    },
    'Sarah Martinez': {
      name: 'Sarah Martinez',
      platforms: {
        'Instagram': {
          handle: '@sarahmartinez',
          tier: 'Macro',
          followerCount: 850000,
          avgViews: 520000,
          organicRate: 7.2,
          sponsoredRate: 5.1
        },
        'TikTok': {
          handle: '@sarahmartinez',
          tier: 'Mega',
          followerCount: 2500000,
          avgViews: 1800000,
          organicRate: 8.1,
          sponsoredRate: 6.2
        }
      }
    },
    'Tech Guru': {
      name: 'Tech Guru',
      platforms: {
        'YouTube': {
          handle: '@techguru',
          tier: 'Mid',
          followerCount: 180000,
          avgViews: 95000,
          organicRate: 5.5,
          sponsoredRate: 3.9
        },
        'Twitter': {
          handle: '@techguru',
          tier: 'Mid',
          followerCount: 95000,
          avgViews: 45000,
          organicRate: 4.8,
          sponsoredRate: 3.1
        }
      }
    }
  };

  // Handle creator selection
  const handleCreatorSelection = (creatorName) => {
    setSearchQuery(creatorName);
    const creatorData = creatorDatabase[creatorName];
    setNewCreatorData(creatorData || null);
  };

  // Filter creators based on search query
  const getFilteredCreators = () => {
    if (!searchQuery) return Object.keys(creatorDatabase);
    return Object.keys(creatorDatabase).filter(name =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const addCreator = () => {
    if (newCreatorData) {
      // Create a new creator entry with all platform data
      const newCreator = {
        id: Date.now(),
        name: newCreatorData.name,
        platforms: newCreatorData.platforms
      };

      setCreators([...creators, newCreator]);
      setSearchQuery('');
      setNewCreatorData(null);
      setShowCreatorModal(false);
    }
  };

  const toggleCreatorSelection = (creatorId) => {
    setSelectedCreators(prev =>
      prev.includes(creatorId)
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCreators.length === creators.length) {
      setSelectedCreators([]);
    } else {
      setSelectedCreators(creators.map(c => c.id));
    }
  };

  const openPlatformModal = () => {
    // Initialize platform selections for selected creators
    const initialSelections = {};
    creators
      .filter(c => selectedCreators.includes(c.id))
      .forEach(creator => {
        initialSelections[creator.id] = {
          name: creator.name,
          platforms: Object.keys(creator.platforms).reduce((acc, platform) => {
            acc[platform] = {
              selected: false,
              postType: 'Feed Post',
              postCount: 1,
              data: creator.platforms[platform]
            };
            return acc;
          }, {})
        };
      });

    setPlatformSelections(initialSelections);
    setShowPlatformModal(true);
  };

  const togglePlatformSelection = (creatorId, platform) => {
    setPlatformSelections(prev => ({
      ...prev,
      [creatorId]: {
        ...prev[creatorId],
        platforms: {
          ...prev[creatorId].platforms,
          [platform]: {
            ...prev[creatorId].platforms[platform],
            selected: !prev[creatorId].platforms[platform].selected
          }
        }
      }
    }));
  };

  const updatePlatformPostType = (creatorId, platform, postType) => {
    setPlatformSelections(prev => ({
      ...prev,
      [creatorId]: {
        ...prev[creatorId],
        platforms: {
          ...prev[creatorId].platforms,
          [platform]: {
            ...prev[creatorId].platforms[platform],
            postType: postType
          }
        }
      }
    }));
  };

  const updatePlatformPostCount = (creatorId, platform, count) => {
    setPlatformSelections(prev => ({
      ...prev,
      [creatorId]: {
        ...prev[creatorId],
        platforms: {
          ...prev[creatorId].platforms,
          [platform]: {
            ...prev[creatorId].platforms[platform],
            postCount: parseInt(count) || 1
          }
        }
      }
    }));
  };

  const confirmPlatformSelection = () => {
    const newCampaignCreators = [];

    Object.entries(platformSelections).forEach(([creatorId, creatorData]) => {
      Object.entries(creatorData.platforms).forEach(([platform, platformData]) => {
        if (platformData.selected) {
          newCampaignCreators.push({
            id: `${creatorId}-${platform}-${Date.now()}`,
            creatorId: creatorId,
            creatorName: creatorData.name,
            platform: platform,
            postType: platformData.postType,
            handle: platformData.data.handle,
            tier: platformData.data.tier,
            followerCount: platformData.data.followerCount,
            avgViews: platformData.data.avgViews,
            organicRate: platformData.data.organicRate,
            sponsoredRate: platformData.data.sponsoredRate,
            postCount: platformData.postCount
          });
        }
      });
    });

    setCampaignCreators([...campaignCreators, ...newCampaignCreators]);
    setSelectedCreators([]);
    setShowPlatformModal(false);
    setPlatformSelections({});
  };

  const updatePostCount = (creatorId, count) => {
    setCampaignCreators(prev =>
      prev.map(c => c.id === creatorId ? { ...c, postCount: parseInt(count) || 0 } : c)
    );
  };

  const removeFromCampaign = (creatorId) => {
    setCampaignCreators(prev => prev.filter(c => c.id !== creatorId));
  };

  const runSimulation = () => {
    setIsSimulating(true);

    // Simulate processing time with a delay
    setTimeout(() => {
      // Calculate target CPM
      const targetCPM = (campaignSetup.budget / campaignSetup.targetImpressions) * 1000;

      // Calculate results for each creator
      const creatorResults = campaignCreators.map(creator => {
        const expectedImpressions = creator.avgViews * creator.postCount;
        const estimatedCost = (expectedImpressions / 1000) *
          (creator.sponsoredRate * 10); // Rough cost calculation based on sponsored rate
        const cpm = (estimatedCost / expectedImpressions) * 1000;

        // Determine if creator is overvalued or undervalued
        // Undervalued = their CPM is lower than target (better value)
        // Overvalued = their CPM is higher than target (worse value)
        const cpmDifference = cpm - targetCPM;
        const cpmPercentageDifference = ((cpm - targetCPM) / targetCPM) * 100;

        let valueStatus = 'fair';
        if (cpmPercentageDifference < -15) {
          valueStatus = 'undervalued';
        } else if (cpmPercentageDifference > 15) {
          valueStatus = 'overvalued';
        }

        return {
          ...creator,
          expectedImpressions,
          estimatedCost,
          cpm,
          valueStatus,
          cpmDifference,
          cpmPercentageDifference
        };
      });

      // Calculate totals
      const totalImpressions = creatorResults.reduce((sum, c) => sum + c.expectedImpressions, 0);
      const totalCost = creatorResults.reduce((sum, c) => sum + c.estimatedCost, 0);
      const averageCPM = (totalCost / totalImpressions) * 1000;

      // Compare to targets
      const impressionDifference = totalImpressions - campaignSetup.targetImpressions;
      const impressionPercentage = (totalImpressions / campaignSetup.targetImpressions) * 100;
      const budgetDifference = totalCost - campaignSetup.budget;
      const budgetPercentage = (totalCost / campaignSetup.budget) * 100;
      const cpmDifference = averageCPM - ((campaignSetup.budget / campaignSetup.targetImpressions) * 1000);

      setSimulationResults({
        creatorResults,
        totals: {
          impressions: totalImpressions,
          cost: totalCost,
          cpm: averageCPM
        },
        comparison: {
          impressionDifference,
          impressionPercentage,
          budgetDifference,
          budgetPercentage,
          cpmDifference
        }
      });

      setIsSimulating(false);
    }, 2500); // 2.5 second delay for dramatic effect
  };

  const handleSetupFormChange = (field, value) => {
    setSetupForm(prev => ({ ...prev, [field]: value }));
  };

  const submitCampaignSetup = () => {
    if (setupForm.budget && setupForm.targetImpressions && setupForm.creatorCount) {
      setCampaignSetup({
        budget: parseFloat(setupForm.budget),
        campaignType: setupForm.campaignType,
        targetImpressions: parseInt(setupForm.targetImpressions),
        creatorCount: parseInt(setupForm.creatorCount)
      });
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Campaign Performance Simulator</h1>
          <p className="text-gray-600">Select creators to meet your campaign goals and optimize performance</p>
        </div>

        {/* Campaign Setup Form - Shows if no campaign setup exists */}
        {!campaignSetup ? (
          <div className="bg-white rounded-xl shadow-card p-8 mb-6 border border-gray-100 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-brand-500 mb-2">Campaign Setup</h2>
            <p className="text-gray-600 text-sm mb-6">Let's start by setting up your campaign parameters</p>

            <div className="space-y-6">
              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Campaign Budget ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={setupForm.budget}
                  onChange={(e) => handleSetupFormChange('budget', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
                  placeholder="50000"
                />
              </div>

              {/* Campaign Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Campaign Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSetupFormChange('campaignType', 'Awareness')}
                    className={`py-3 px-4 rounded-lg border-2 font-semibold transition ${
                      setupForm.campaignType === 'Awareness'
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Awareness
                  </button>
                  <button
                    onClick={() => handleSetupFormChange('campaignType', 'Performance')}
                    className={`py-3 px-4 rounded-lg border-2 font-semibold transition ${
                      setupForm.campaignType === 'Performance'
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Performance
                  </button>
                </div>
              </div>

              {/* Target Impressions */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Impressions
                </label>
                <input
                  type="number"
                  min="0"
                  value={setupForm.targetImpressions}
                  onChange={(e) => handleSetupFormChange('targetImpressions', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
                  placeholder="1000000"
                />
              </div>

              {/* Creator Count */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  How many creators would you like to source?
                </label>
                <input
                  type="number"
                  min="1"
                  value={setupForm.creatorCount}
                  onChange={(e) => handleSetupFormChange('creatorCount', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
                  placeholder="10"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={submitCampaignSetup}
                disabled={!setupForm.budget || !setupForm.targetImpressions || !setupForm.creatorCount}
                className={`w-full py-3 rounded-lg font-semibold transition shadow-sm ${
                  setupForm.budget && setupForm.targetImpressions && setupForm.creatorCount
                    ? 'bg-brand-500 text-white hover:bg-brand-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue to Creator Database
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Campaign Summary Header */}
            <div className="bg-brand-50 rounded-xl p-6 mb-6 border border-brand-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-brand-900">Campaign Overview</h3>
                <button
                  onClick={() => setCampaignSetup(null)}
                  className="text-sm text-brand-600 hover:text-brand-700 font-semibold"
                >
                  Edit Setup
                </button>
              </div>
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <p className="text-xs text-brand-700 mb-1">Budget</p>
                  <p className="text-xl font-bold text-brand-900">${campaignSetup.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-brand-700 mb-1">Campaign Type</p>
                  <p className="text-xl font-bold text-brand-900">{campaignSetup.campaignType}</p>
                </div>
                <div>
                  <p className="text-xs text-brand-700 mb-1">Target Impressions</p>
                  <p className="text-xl font-bold text-brand-900">{campaignSetup.targetImpressions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-brand-700 mb-1">Target CPM</p>
                  <p className="text-xl font-bold text-brand-900">
                    ${((campaignSetup.budget / campaignSetup.targetImpressions) * 1000).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-brand-700 mb-1">Target Creators</p>
                  <p className="text-xl font-bold text-brand-900">{campaignSetup.creatorCount}</p>
                </div>
              </div>
            </div>

            {/* Creator Database */}
            <div className="bg-white rounded-xl shadow-card p-6 mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCreatorDatabaseExpanded(!isCreatorDatabaseExpanded)}
                className="flex items-center gap-2 text-brand-500 hover:text-brand-600 transition"
              >
                {isCreatorDatabaseExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                <div className="text-left">
                  <h2 className="text-2xl font-bold">Creator Database</h2>
                  <p className="text-gray-600 text-sm">
                    {selectedCreators.length > 0
                      ? `${selectedCreators.length} creator${selectedCreators.length === 1 ? '' : 's'} selected`
                      : 'Add creators to build your roster'}
                  </p>
                </div>
              </button>
              {creators.length > 0 && isCreatorDatabaseExpanded && (
                <button
                  onClick={toggleSelectAll}
                  className="text-sm text-brand-500 hover:text-brand-600 font-semibold"
                >
                  {selectedCreators.length === creators.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>
            <button
              onClick={() => setShowCreatorModal(true)}
              className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition shadow-sm"
            >
              <Plus size={20} />
              Add Creator
            </button>
          </div>

          {isCreatorDatabaseExpanded && (
            <>
              {creators.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-500 text-lg mb-2">No creators added yet</p>
                  <p className="text-gray-400 text-sm">Click "Add Creator" to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {creators.map((creator) => (
                    <div
                      key={creator.id}
                      className={`border rounded-lg overflow-hidden transition ${
                        selectedCreators.includes(creator.id) ? 'border-brand-500 bg-brand-50' : 'border-gray-200'
                      }`}
                    >
                      {/* Creator Header */}
                      <div className="bg-gray-50 p-4 flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedCreators.includes(creator.id)}
                          onChange={() => toggleCreatorSelection(creator.id)}
                          className="w-5 h-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500 cursor-pointer"
                        />
                        <h3 className="text-lg font-bold text-gray-900">{creator.name}</h3>
                        <span className="ml-auto text-sm text-gray-600">
                          {Object.keys(creator.platforms).length} platform{Object.keys(creator.platforms).length === 1 ? '' : 's'}
                        </span>
                      </div>

                      {/* Platform Breakdown Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-white border-b border-gray-200">
                              <th className="p-3 text-left font-semibold text-gray-700">Social Network</th>
                              <th className="p-3 text-left font-semibold text-gray-700">Handle</th>
                              <th className="p-3 text-left font-semibold text-gray-700">Tier</th>
                              <th className="p-3 text-left font-semibold text-gray-700">Followers</th>
                              <th className="p-3 text-left font-semibold text-gray-700">Avg Views</th>
                              <th className="p-3 text-left font-semibold text-gray-700">Organic Rate %</th>
                              <th className="p-3 text-left font-semibold text-gray-700">Sponsored Rate %</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(creator.platforms).map(([platform, data]) => (
                              <tr key={platform} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-900">{platform}</td>
                                <td className="p-3 text-gray-700">{data.handle}</td>
                                <td className="p-3 text-gray-700">{data.tier}</td>
                                <td className="p-3 text-gray-700">{data.followerCount.toLocaleString()}</td>
                                <td className="p-3 text-gray-700">{data.avgViews.toLocaleString()}</td>
                                <td className="p-3 text-gray-700">{data.organicRate}%</td>
                                <td className="p-3 text-gray-700">{data.sponsoredRate}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add to Campaign Button */}
              {selectedCreators.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={openPlatformModal}
                    className="bg-brand-500 text-white px-6 py-3 rounded-lg hover:bg-brand-600 transition shadow-sm font-semibold"
                  >
                    Add {selectedCreators.length} Creator{selectedCreators.length === 1 ? '' : 's'} to Campaign
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Campaign Section */}
        {campaignCreators.length > 0 && (
          <div className="bg-white rounded-xl shadow-card p-6 mb-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setIsCampaignExpanded(!isCampaignExpanded)}
                className="flex items-center gap-2 text-brand-500 hover:text-brand-600 transition"
              >
                {isCampaignExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                <div className="text-left">
                  <h2 className="text-2xl font-bold">Campaign</h2>
                  <p className="text-gray-600 text-sm">
                    {campaignCreators.length} platform{campaignCreators.length === 1 ? '' : 's'} in campaign
                  </p>
                </div>
              </button>
            </div>

            {isCampaignExpanded && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left border-b border-gray-200">
                        <th className="p-3 font-semibold text-gray-700">Creator</th>
                        <th className="p-3 font-semibold text-gray-700">Platform</th>
                        <th className="p-3 font-semibold text-gray-700">Handle</th>
                        <th className="p-3 font-semibold text-gray-700">Post Type</th>
                        <th className="p-3 font-semibold text-gray-700">Tier</th>
                        <th className="p-3 font-semibold text-gray-700">Followers</th>
                        <th className="p-3 font-semibold text-gray-700">Number of Posts</th>
                        <th className="p-3 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaignCreators.map((creator) => (
                        <tr key={creator.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="p-3 font-medium text-gray-900">{creator.creatorName}</td>
                          <td className="p-3 text-gray-700">{creator.platform}</td>
                          <td className="p-3 text-gray-700">{creator.handle}</td>
                          <td className="p-3 text-gray-700">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">{creator.postType}</span>
                          </td>
                          <td className="p-3 text-gray-700">{creator.tier}</td>
                          <td className="p-3 text-gray-700">{creator.followerCount.toLocaleString()}</td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="1"
                              value={creator.postCount}
                              onChange={(e) => updatePostCount(creator.id, e.target.value)}
                              className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
                            />
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => removeFromCampaign(creator.id)}
                              className="text-red-600 hover:text-red-700 font-semibold text-sm"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Run Simulation Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={runSimulation}
                    disabled={isSimulating}
                    className={`px-8 py-4 rounded-lg transition shadow-lg font-bold text-lg flex items-center gap-3 ${
                      isSimulating
                        ? 'bg-brand-400 text-white cursor-not-allowed'
                        : 'bg-brand-500 text-white hover:bg-brand-600'
                    }`}
                  >
                    {isSimulating ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing Campaign Performance...
                      </>
                    ) : (
                      'Run Simulation'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Simulation Results */}
        {simulationResults && (
          <div className="bg-white rounded-xl shadow-card p-6 mb-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setIsSimulationResultsExpanded(!isSimulationResultsExpanded)}
                className="flex items-center gap-2 text-brand-500 hover:text-brand-600 transition"
              >
                {isSimulationResultsExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                <h2 className="text-2xl font-bold">Simulation Results</h2>
              </button>
            </div>

            {isSimulationResultsExpanded && (
              <>
                {/* Overall Performance Summary */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Campaign Performance Overview</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Impressions</p>
                  <p className="text-2xl font-bold text-gray-900">{simulationResults.totals.impressions.toLocaleString()}</p>
                  <p className={`text-sm font-semibold mt-1 ${simulationResults.comparison.impressionDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {simulationResults.comparison.impressionDifference >= 0 ? '+' : ''}{simulationResults.comparison.impressionDifference.toLocaleString()}
                    ({simulationResults.comparison.impressionPercentage.toFixed(1)}% of target)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                  <p className="text-2xl font-bold text-gray-900">${simulationResults.totals.cost.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                  <p className={`text-sm font-semibold mt-1 ${simulationResults.comparison.budgetDifference <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {simulationResults.comparison.budgetDifference >= 0 ? '+' : ''}{simulationResults.comparison.budgetDifference.toLocaleString(undefined, {maximumFractionDigits: 2})}
                    ({simulationResults.comparison.budgetPercentage.toFixed(1)}% of budget)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average CPM</p>
                  <p className="text-2xl font-bold text-gray-900">${simulationResults.totals.cpm.toFixed(2)}</p>
                  <p className={`text-sm font-semibold mt-1 ${simulationResults.comparison.cpmDifference <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {simulationResults.comparison.cpmDifference >= 0 ? '+' : ''}${Math.abs(simulationResults.comparison.cpmDifference).toFixed(2)} vs target
                  </p>
                </div>
              </div>
            </div>

            {/* Creator-by-Creator Results */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Performance by Creator</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left border-b border-gray-200">
                      <th className="p-3 font-semibold text-gray-700">Creator</th>
                      <th className="p-3 font-semibold text-gray-700">Platform</th>
                      <th className="p-3 font-semibold text-gray-700">Post Type</th>
                      <th className="p-3 font-semibold text-gray-700">Posts</th>
                      <th className="p-3 font-semibold text-gray-700">Expected Impressions</th>
                      <th className="p-3 font-semibold text-gray-700">Estimated Cost</th>
                      <th className="p-3 font-semibold text-gray-700">CPM</th>
                      <th className="p-3 font-semibold text-gray-700">Value Assessment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulationResults.creatorResults.map((creator) => (
                      <tr key={creator.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="p-3 font-medium text-gray-900">{creator.creatorName}</td>
                        <td className="p-3 text-gray-700">{creator.platform}</td>
                        <td className="p-3 text-gray-700">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">{creator.postType}</span>
                        </td>
                        <td className="p-3 text-gray-700">{creator.postCount}</td>
                        <td className="p-3 text-gray-700 font-semibold">{creator.expectedImpressions.toLocaleString()}</td>
                        <td className="p-3 text-gray-700 font-semibold">${creator.estimatedCost.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                        <td className="p-3 text-gray-700">${creator.cpm.toFixed(2)}</td>
                        <td className="p-3">
                          {creator.valueStatus === 'undervalued' && (
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded inline-block">
                                UNDERVALUED
                              </span>
                              <span className="text-xs text-green-600 mt-1">
                                {creator.cpmPercentageDifference.toFixed(1)}% below target
                              </span>
                            </div>
                          )}
                          {creator.valueStatus === 'overvalued' && (
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded inline-block">
                                OVERVALUED
                              </span>
                              <span className="text-xs text-red-600 mt-1">
                                {creator.cpmPercentageDifference.toFixed(1)}% above target
                              </span>
                            </div>
                          )}
                          {creator.valueStatus === 'fair' && (
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded inline-block">
                                FAIR VALUE
                              </span>
                              <span className="text-xs text-gray-600 mt-1">
                                {creator.cpmPercentageDifference >= 0 ? '+' : ''}{creator.cpmPercentageDifference.toFixed(1)}% vs target
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
              </>
            )}
          </div>
        )}

        {/* Platform Selection Modal */}
        {showPlatformModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Platforms & Post Types</h3>
              <p className="text-gray-600 text-sm mb-6">Choose which platforms and post types you want to include in your campaign</p>

              <div className="space-y-6">
                {Object.entries(platformSelections).map(([creatorId, creatorData]) => (
                  <div key={creatorId} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">{creatorData.name}</h4>

                    <div className="space-y-3">
                      {Object.entries(creatorData.platforms).map(([platform, platformData]) => (
                        <div
                          key={platform}
                          className={`border rounded-lg p-4 transition ${
                            platformData.selected ? 'border-brand-500 bg-brand-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={platformData.selected}
                              onChange={() => togglePlatformSelection(creatorId, platform)}
                              className="w-5 h-5 mt-1 rounded border-gray-300 text-brand-500 focus:ring-brand-500 cursor-pointer"
                            />

                            {/* Platform Info */}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h5 className="font-bold text-gray-900">{platform}</h5>
                                  <p className="text-sm text-gray-600">{platformData.data.handle}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-600">Tier: <span className="font-semibold">{platformData.data.tier}</span></p>
                                  <p className="text-xs text-gray-600">{platformData.data.followerCount.toLocaleString()} followers</p>
                                </div>
                              </div>

                              {/* Post Type and Count - Only show if selected */}
                              {platformData.selected && (
                                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200">
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Post Type</label>
                                    <select
                                      value={platformData.postType}
                                      onChange={(e) => updatePlatformPostType(creatorId, platform, e.target.value)}
                                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
                                    >
                                      <option>Feed Post</option>
                                      <option>Story</option>
                                      <option>Reel</option>
                                      <option>Video</option>
                                      <option>Carousel</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Number of Posts</label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={platformData.postCount}
                                      onChange={(e) => updatePlatformPostCount(creatorId, platform, e.target.value)}
                                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={confirmPlatformSelection}
                  className="flex-1 bg-brand-500 text-white py-3 rounded-lg hover:bg-brand-600 transition font-semibold shadow-sm"
                >
                  Add to Campaign
                </button>
                <button
                  onClick={() => {
                    setShowPlatformModal(false);
                    setPlatformSelections({});
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-semibold border border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Creator Modal */}
        {showCreatorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Add New Creator</h3>

              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Creator Name</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setNewCreatorData(null);
                    }}
                    placeholder="Start typing a creator name..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition"
                  />

                  {/* Filtered Creator List */}
                  {searchQuery && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {getFilteredCreators().length > 0 ? (
                        getFilteredCreators().map(name => (
                          <button
                            key={name}
                            onClick={() => handleCreatorSelection(name)}
                            className="w-full text-left px-4 py-3 hover:bg-brand-50 transition border-b border-gray-100 last:border-0"
                          >
                            <p className="font-semibold text-gray-900">{name}</p>
                            <p className="text-xs text-gray-600">
                              {Object.keys(creatorDatabase[name].platforms).length} platform
                              {Object.keys(creatorDatabase[name].platforms).length === 1 ? '' : 's'}
                            </p>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-sm">
                          No creators found matching "{searchQuery}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Platform breakdown preview */}
                {newCreatorData && (
                  <>
                    <div className="bg-brand-50 p-4 rounded-lg border border-brand-200">
                      <p className="text-sm font-semibold text-brand-800 mb-3">✓ Creator data loaded from database</p>

                      <div className="space-y-3">
                        {Object.entries(newCreatorData.platforms).map(([platform, data]) => (
                          <div key={platform} className="bg-white p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-gray-900">{platform}</span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{data.handle}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <span className="text-gray-600">Tier:</span>
                                <span className="ml-1 font-semibold text-gray-900">{data.tier}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Followers:</span>
                                <span className="ml-1 font-semibold text-gray-900">{data.followerCount.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Avg Views:</span>
                                <span className="ml-1 font-semibold text-gray-900">{data.avgViews.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Organic:</span>
                                <span className="ml-1 font-semibold text-gray-900">{data.organicRate}%</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Sponsored:</span>
                                <span className="ml-1 font-semibold text-gray-900">{data.sponsoredRate}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={addCreator}
                  disabled={!newCreatorData}
                  className={`flex-1 py-2 rounded-lg transition font-semibold ${
                    newCreatorData
                      ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Add Creator
                </button>
                <button
                  onClick={() => {
                    setShowCreatorModal(false);
                    setSearchQuery('');
                    setNewCreatorData(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-semibold border border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
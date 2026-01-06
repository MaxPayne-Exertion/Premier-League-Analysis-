import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import TeamTable from './components/TeamTable';
import PlayerTable from './components/PlayerTable';
import TopStats from './components/TopStats';
import ComparisonView from './components/ComparisonView';
import { ClinicalityScatter } from './components/EvaluationCharts';
import { PlotlyRadar } from './components/PlotlyRadar';

// Configure Axios base URL
axios.defaults.baseURL = 'http://localhost:8000/api';

function App() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [teamsRes, playersRes] = await Promise.all([
          axios.get('/teams/'),
          axios.get('/players/')
        ]);
        setTeams(teamsRes.data);
        setPlayers(playersRes.data);
        if (playersRes.data.length > 0) {
          // Default select top scorer
          const top = [...playersRes.data].sort((a, b) => b.goals - a.goals)[0];
          setSelectedPlayer(top);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Ensure backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="main-content">
        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message p-4 border border-red-500 rounded text-red-400 bg-red-900/20 text-center">
            {error}
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* DASHBOARD VIEW */}
            {activeTab === 'dashboard' && (
              <>
                <TopStats players={players} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <ClinicalityScatter teams={teams} />
                  <div className="glass-panel p-6 flex flex-col justify-center items-center text-center">
                    <h3 className="section-title text-sm uppercase text-slate-400">Featured Player</h3>
                    {selectedPlayer ? (
                      <>
                        <PlotlyRadar player={selectedPlayer} showTitle={false} />
                        <h2 className="text-xl font-bold mt-2">{selectedPlayer.name}</h2>
                      </>
                    ) : (
                      <p>Loading stats...</p>
                    )}
                  </div>
                </div>

                <section>
                  <h2 className="section-title">
                    <span className="accent-bar"></span>
                    Team Overview
                  </h2>
                  <TeamTable teams={teams} />
                </section>
              </>
            )}

            {/* PLAYERS VIEW */}
            {activeTab === 'players' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <PlayerTable
                    players={players}
                    onSelectPlayer={setSelectedPlayer}
                    selectedPlayerId={selectedPlayer?.id || selectedPlayer?.player_id}
                  />
                </div>
                <div className="lg:col-span-1">
                  <div className="sticky top-4 space-y-4">
                    <div className="glass-panel p-6">
                      <h3 className="font-bold mb-4 header-accent">Player Profile</h3>
                      {selectedPlayer ? (
                        <>
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl font-bold">
                              {selectedPlayer.name[0]}
                            </div>
                            <div>
                              <div className="text-xl font-bold">{selectedPlayer.name}</div>
                              <div className="text-slate-400">{selectedPlayer.team_name}</div>
                              <div className="flex gap-2 mt-1">
                                {selectedPlayer.flag_url && selectedPlayer.flag_url.split(',').map((url, i) => (
                                  url.trim() && <img key={i} src={url.trim()} className="w-6 rounded-sm" alt="" />
                                ))}
                                <span className="text-sm text-slate-500">{selectedPlayer.nationality}</span>
                              </div>
                            </div>
                          </div>
                          <PlotlyRadar player={selectedPlayer} showTitle={false} />
                        </>
                      ) : (
                        <p className="text-slate-500">Select a player to view details</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* COMPARISON VIEW */}
            {activeTab === 'comparison' && (
              <ComparisonView players={players} teams={teams} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

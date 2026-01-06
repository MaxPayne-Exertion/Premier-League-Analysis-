import React, { useState, useMemo } from 'react';
import { PlotlyComparisonRadar } from './PlotlyRadar';

const ComparisonView = ({ players, teams }) => {
    const [player1Id, setPlayer1Id] = useState('');
    const [player2Id, setPlayer2Id] = useState('');

    const p1 = players.find(p => (p.id || p.player_id) == player1Id);
    const p2 = players.find(p => (p.id || p.player_id) == player2Id);

    // Filter players for dropdown (maybe limit to top 500 or search? For now all)
    // Sort by name for easier finding
    const sortedPlayers = useMemo(() => [...players].sort((a, b) => a.name.localeCompare(b.name)), [players]);

    const radarData = useMemo(() => {
        if (!p1 && !p2) return [];

        // Normalize logic: very basic / max in dataset would be better
        // Here we use arbitrary "elite" standards for 0-1 scaling
        // Goals: /30, xG: /30, Assists: /20, ProgRuns: /100, ProgPass: /100
        // Better: Rank percentile pre-calculated in backend, but we do raw here.

        const metrics = [
            { label: 'Goals', key: 'goals', max: 30 },
            { label: 'Assists', key: 'assists', max: 20 },
            { label: 'xG', key: 'xg', max: 30 },
            { label: 'xAG', key: 'xag', max: 15 },
            { label: 'Chances Created', key: 'shot_creating_actions', max: 100 }, // If available
            { label: 'Prg. Carries', key: 'progressive_carries', max: 150 },
            { label: 'Prg. Passes', key: 'progressive_passes', max: 150 },
        ];

        return metrics.map(m => ({
            subject: m.label,
            fullMark: 100,
            A: p1 ? Math.min((p1[m.key] || 0) / m.max * 100, 100) : 0,
            B: p2 ? Math.min((p2[m.key] || 0) / m.max * 100, 100) : 0,
            valA: p1 ? p1[m.key] : 0,
            valB: p2 ? p2[m.key] : 0,
        }));
    }, [p1, p2]);

    return (
        <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Selectors */}
                <div className="glass-panel p-6">
                    <h3 className="section-title text-sm uppercase text-blue-400">Player 1</h3>
                    <select
                        className="w-full bg-slate-800 text-white p-3 rounded border border-slate-600 focus:border-blue-500 outline-none"
                        value={player1Id}
                        onChange={e => setPlayer1Id(e.target.value)}
                    >
                        <option value="">Select Player...</option>
                        {sortedPlayers.map(p => (
                            <option key={p.id || p.player_id} value={p.id || p.player_id}>
                                {p.name} ({p.team_name})
                            </option>
                        ))}
                    </select>
                    {p1 && (
                        <div className="mt-4 flex flex-col items-center">
                            <h2 className="text-3xl font-bold">{p1.name}</h2>
                            <p className="text-xl text-slate-400">{p1.team_name}</p>
                            <div className="mt-2 text-4xl font-bold text-blue-500">{p1.goals} <span className="text-sm text-white">G</span></div>
                        </div>
                    )}
                </div>

                <div className="glass-panel p-6">
                    <h3 className="section-title text-sm uppercase text-red-400">Player 2</h3>
                    <select
                        className="w-full bg-slate-800 text-white p-3 rounded border border-slate-600 focus:border-red-500 outline-none"
                        value={player2Id}
                        onChange={e => setPlayer2Id(e.target.value)}
                    >
                        <option value="">Select Player...</option>
                        {sortedPlayers.map(p => (
                            <option key={p.id || p.player_id} value={p.id || p.player_id}>
                                {p.name} ({p.team_name})
                            </option>
                        ))}
                    </select>
                    {p2 && (
                        <div className="mt-4 flex flex-col items-center">
                            <h2 className="text-3xl font-bold">{p2.name}</h2>
                            <p className="text-xl text-slate-400">{p2.team_name}</p>
                            <div className="mt-2 text-4xl font-bold text-red-500">{p2.goals} <span className="text-sm text-white">G</span></div>
                        </div>
                    )}
                </div>
            </div>

            {(p1 || p2) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Radar Chart */}
                    <div className="glass-panel p-6 h-96 flex flex-col items-center">
                        <h3 className="text-center mb-4 font-bold header-accent">Attribute Comparison</h3>
                        <PlotlyComparisonRadar player1={p1} player2={p2} />
                    </div>

                    {/* Head to Head Table */}
                    <div className="glass-panel p-6">
                        <h3 className="text-center mb-4 font-bold header-accent">Head-to-Head Stats</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-700 text-slate-400">
                                        <th className="py-2 text-left">Metric</th>
                                        <th className="py-2 text-right text-blue-400">{p1?.name || 'P1'}</th>
                                        <th className="py-2 text-right text-red-400">{p2?.name || 'P2'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { l: 'Matches', k: 'matches_played' },
                                        { l: 'Goals', k: 'goals' },
                                        { l: 'Assists', k: 'assists' },
                                        { l: 'xG', k: 'xg' },
                                        { l: 'xAG', k: 'xag' },
                                        { l: 'Prog. Carries', k: 'progressive_carries' },
                                        { l: 'Prog. Passes', k: 'progressive_passes' },
                                    ].map(row => (
                                        <tr key={row.k} className="border-b border-slate-700/50">
                                            <td className="py-3 text-slate-300 font-medium">{row.l}</td>
                                            <td className="py-3 text-right font-bold text-white">
                                                {p1 ? p1[row.k] : '-'}
                                            </td>
                                            <td className="py-3 text-right font-bold text-white">
                                                {p2 ? p2[row.k] : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComparisonView;

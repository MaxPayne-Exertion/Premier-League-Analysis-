import React, { useState } from 'react';
import { Search } from 'lucide-react';

const PlayerTable = ({ players, onSelectPlayer, selectedPlayerId }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPlayers = players.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.team_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="glass-panel p-6">
            <div className="table-header">
                <h2 className="section-title header-accent">Player Stats</h2>
                <div className="search-wrapper">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search players..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Team</th>
                            <th>Pos</th>
                            <th>Nationality</th>
                            <th>Age</th>
                            <th className="text-right">Matches</th>
                            <th className="text-right">Goals</th>
                            <th className="text-right">Assists</th>
                            <th className="text-right">xG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPlayers.slice(0, 50).map((player) => (
                            <tr
                                key={player.id || player.player_id}
                                onClick={() => onSelectPlayer && onSelectPlayer(player)}
                                className={`cursor-pointer transition-colors hover:bg-slate-800 ${selectedPlayerId === (player.id || player.player_id) ? 'bg-slate-800 border-l-4 border-blue-500' : ''}`}
                            >
                                <td className="font-semibold">{player.name}</td>
                                <td className="text-secondary">{player.team_name}</td>
                                <td>
                                    <span className={`pos-badge pos-${player.position}`}>
                                        {player.position}
                                    </span>
                                </td>
                                <td className="flex items-center gap-1">
                                    {player.flag_url && player.flag_url.split(',').map((url, i) => (
                                        url.trim() && <img key={i} src={url.trim()} alt="" className="flag-icon" />
                                    ))}
                                    <span className="text-sm ml-1">{player.nationality}</span>
                                </td>
                                <td>{player.age}</td>
                                <td className="text-right">{player.matches_played}</td>
                                <td className="text-right font-bold text-white">{player.goals}</td>
                                <td className="text-right">{player.assists}</td>
                                <td className="text-right text-secondary">{player.xg.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredPlayers.length === 0 && (
                    <div className="empty-state">No players found</div>
                )}
            </div>
        </div>
    );
};

export default PlayerTable;

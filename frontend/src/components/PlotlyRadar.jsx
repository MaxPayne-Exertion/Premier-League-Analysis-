import React from 'react';
import Plot from 'react-plotly.js';

export const PlotlyRadar = ({ player, showTitle = true }) => {
    if (!player) return null;

    // Normalized (0-100) and raw values
    // Simple heuristic maxes
    const metrics = [
        { label: 'Goals', key: 'goals', max: 30 },
        { label: 'Assists', key: 'assists', max: 20 },
        { label: 'xG', key: 'xg', max: 30 },
        { label: 'Prg. Carries', key: 'progressive_carries', max: 150 },
        { label: 'Prg. Passes', key: 'progressive_passes', max: 150 },
    ];

    const values = metrics.map(m => Math.min((player[m.key] || 0) / m.max * 100, 100));
    const labels = metrics.map(m => m.label);

    // Close the loop
    const plotValues = [...values, values[0]];
    const plotLabels = [...labels, labels[0]];

    return (
        <div className="glass-panel p-4 flex flex-col items-center justify-center">
            {showTitle && <h3 className="text-lg font-bold mb-2 header-accent">{player.name}</h3>}
            <Plot
                data={[
                    {
                        type: 'scatterpolar',
                        r: plotValues,
                        theta: plotLabels,
                        fill: 'toself',
                        name: player.name,
                        line: { color: '#3b82f6' },
                        fillcolor: 'rgba(59, 130, 246, 0.3)'
                    },
                ]}
                layout={{
                    width: 320,
                    height: 320,
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: '#cbd5e1' },
                    polar: {
                        radialaxis: {
                            visible: true,
                            range: [0, 100],
                            showticklabels: false,
                            gridcolor: '#475569'
                        },
                        angularaxis: {
                            gridcolor: '#475569',
                            linecolor: '#475569'
                        },
                        bgcolor: 'rgba(0,0,0,0)'
                    },
                    margin: { l: 30, r: 30, t: 30, b: 30 },
                    showlegend: false
                }}
                config={{ displayModeBar: false }}
            />
        </div>
    );
};

export const PlotlyComparisonRadar = ({ player1, player2 }) => {
    // Shared metric logic
    const metrics = [
        { label: 'Goals', key: 'goals', max: 30 },
        { label: 'Assists', key: 'assists', max: 20 },
        { label: 'xG', key: 'xg', max: 30 },
        { label: 'Prg. Carries', key: 'progressive_carries', max: 150 },
        { label: 'Prg. Passes', key: 'progressive_passes', max: 150 },
    ];

    // Helper
    const getValues = (p) => {
        if (!p) return metrics.map(() => 0);
        const v = metrics.map(m => Math.min((p[m.key] || 0) / m.max * 100, 100));
        return [...v, v[0]];
    };

    const labels = metrics.map(m => m.label);
    const plotLabels = [...labels, labels[0]];

    const data = [];
    if (player1) {
        data.push({
            type: 'scatterpolar',
            r: getValues(player1),
            theta: plotLabels,
            fill: 'toself',
            name: player1.name,
            line: { color: '#3b82f6' },
            fillcolor: 'rgba(59, 130, 246, 0.3)'
        });
    }
    if (player2) {
        data.push({
            type: 'scatterpolar',
            r: getValues(player2),
            theta: plotLabels,
            fill: 'toself',
            name: player2.name,
            line: { color: '#ef4444' },
            fillcolor: 'rgba(239, 68, 68, 0.3)'
        });
    }

    return (
        <div className="glass-panel p-4 flex justify-center">
            <Plot
                data={data}
                layout={{
                    width: 450,
                    height: 400,
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: '#cbd5e1' },
                    polar: {
                        radialaxis: {
                            visible: true,
                            range: [0, 100],
                            showticklabels: false,
                            gridcolor: '#475569'
                        },
                        angularaxis: {
                            gridcolor: '#475569',
                            linecolor: '#475569'
                        },
                        bgcolor: 'rgba(0,0,0,0)'
                    },
                    margin: { l: 50, r: 50, t: 30, b: 30 },
                    legend: {
                        orientation: 'h',
                        y: -0.1
                    }
                }}
                config={{ displayModeBar: false }}
            />
        </div>
    );
};

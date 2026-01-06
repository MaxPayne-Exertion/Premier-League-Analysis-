import React from 'react';
import { LayoutDashboard, Users, GitCompare, Trophy } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'players', label: 'Players', icon: Users },
        { id: 'comparison', label: 'Comparison', icon: GitCompare },
    ];

    return (
        <div className="sidebar glass-panel">
            <div className="sidebar-header">
                <div className="logo-container">
                    <Trophy size={24} className="text-white" />
                </div>
                <h1 className="brand-text header-accent">PL Analytics</h1>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <p>© 2024 PL Analytics</p>
                <p>Data Source: Real 23/24</p>
            </div>
        </div>
    );
};

export default Sidebar;

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Planning from './pages/Planning';
import History from './pages/History';
import Team from './pages/Team';
import Reports from './pages/Reports';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Reception, User } from './types';

export default function App() {
  const [receptions, setReceptions] = useState<Reception[]>([]);
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Admin',
      email: 'admin@psec.fr',
      role: 'admin',
      lastActive: new Date().toISOString(),
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddReception = (reception: Omit<Reception, 'id' | 'createdAt' | 'createdBy'>) => {
    const newReception: Reception = {
      id: Date.now().toString(),
      ...reception,
      createdAt: new Date().toISOString(),
      createdBy: users[0].id,
    };
    setReceptions(prev => [...prev, newReception]);
  };

  const handleUpdateReception = (id: string, updates: Partial<Reception>) => {
    setReceptions(prev =>
      prev.map(reception =>
        reception.id === id
          ? { ...reception, ...updates }
          : reception
      )
    );
  };

  const handleAddUser = (userData: Omit<User, 'id'>) => {
    setUsers(prev => [...prev, { ...userData, id: Date.now().toString() }]);
  };

  const handleUpdateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id
          ? { ...user, ...updates }
          : user
      )
    );
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const mockUser = users[0];

  const handleLogout = () => {
    console.log('Déconnexion');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredReceptions = receptions.filter(reception => {
    const searchLower = searchQuery.toLowerCase();
    return (
      reception.transporteur.toLowerCase().includes(searchLower) ||
      (reception.reference?.toLowerCase().includes(searchLower)) ||
      (reception.notes?.toLowerCase().includes(searchLower))
    );
  });

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar user={mockUser} onLogout={handleLogout} />
        <div className="flex-1">
          <Header 
            user={mockUser} 
            onSearch={handleSearch}
            unreadNotifications={3}
          />
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  receptions={filteredReceptions} 
                  onUpdateNote={(id, note) => handleUpdateReception(id, { notes: note })}
                />
              } 
            />
            <Route
              path="/planning"
              element={
                <Planning
                  receptions={filteredReceptions}
                  onAddReception={handleAddReception}
                  onUpdateStatus={(id, status) => handleUpdateReception(id, { status })}
                  onUpdateNote={(id, note) => handleUpdateReception(id, { notes: note })}
                />
              }
            />
            <Route
              path="/history"
              element={
                <History
                  receptions={filteredReceptions}
                />
              }
            />
            <Route
              path="/team"
              element={
                <Team
                  users={users}
                  onAddUser={handleAddUser}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                  currentUser={mockUser}
                />
              }
            />
            <Route
              path="/reports"
              element={
                <Reports
                  receptions={filteredReceptions}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

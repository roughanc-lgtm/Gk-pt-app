
import React, { useState, useEffect } from 'react';
import { View, Routine, WorkoutSession } from './types';
import { storageService } from './services/storageService';
import { parseSpreadsheetData, getDefaultData } from './services/parserService';
import Dashboard from './components/Dashboard';
import WorkoutView from './components/WorkoutView';
import HistoryView from './components/HistoryView';
import DataImporter from './components/DataImporter';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);

  useEffect(() => {
    const savedRoutines = storageService.getRoutines();
    if (savedRoutines.length === 0) {
      // Auto-populate with the requested exercises if empty
      const defaultRoutines = parseSpreadsheetData(getDefaultData());
      setRoutines(defaultRoutines);
      storageService.saveRoutines(defaultRoutines);
    } else {
      setRoutines(savedRoutines);
    }
    setHistory(storageService.getHistory());
  }, []);

  const handleImportRoutines = (newRoutines: Routine[]) => {
    setRoutines(newRoutines);
    storageService.saveRoutines(newRoutines);
    setCurrentView('dashboard');
  };

  const handleSelectRoutine = (routine: Routine) => {
    setActiveRoutine(routine);
    setCurrentView('workout');
  };

  const handleFinishWorkout = (session: WorkoutSession) => {
    storageService.saveWorkout(session);
    setHistory(storageService.getHistory());
    setCurrentView('dashboard');
    setActiveRoutine(null);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            routines={routines} 
            history={history}
            onSelectRoutine={handleSelectRoutine}
            onNavigateToImport={() => setCurrentView('import')}
            onNavigateToHistory={() => setCurrentView('history')}
          />
        );
      case 'workout':
        if (!activeRoutine) return null;
        return (
          <WorkoutView 
            routine={activeRoutine} 
            onCancel={() => setCurrentView('dashboard')}
            onFinish={handleFinishWorkout}
          />
        );
      case 'history':
        return (
          <HistoryView 
            history={history} 
            onBack={() => setCurrentView('dashboard')} 
          />
        );
      case 'import':
        return (
          <DataImporter 
            onImport={handleImportRoutines} 
            onCancel={() => setCurrentView('dashboard')} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white selection:bg-neon selection:text-black">
      <div className="max-w-md mx-auto min-h-screen">
        {renderView()}
      </div>
    </div>
  );
};

export default App;


import React, { useState, useCallback } from 'react';
import { Point, VisualizationType, GraphType } from './types';
import { parsePoints } from './services/parser';
import InputPanel from './components/InputPanel';
import VisualizationPanel from './components/VisualizationPanel';

const App: React.FC = () => {
  const [input, setInput] = useState<string>('[[8,10], [2,7], [9,2], [4,10]]\n(12, 6) {1, 4}');
  const [points, setPoints] = useState<Point[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<VisualizationType>('plot');
  const [graphType, setGraphType] = useState<GraphType>('undirected');

  const handleVisualize = useCallback(() => {
    try {
      setError(null);
      const parsedPoints = parsePoints(input);
      if (parsedPoints.length === 0) {
        setError("No valid points found. Please check your input.");
        setPoints(null);
        return;
      }
      setPoints(parsedPoints);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred during parsing.");
      }
      setPoints(null);
    }
  }, [input]);
  
  const handleClear = useCallback(() => {
    setInput('');
    setPoints(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">Point Visualizer</h1>
          <p className="text-lg text-gray-600 mt-2">Input 2D coordinates and see them as a plot or a graph.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputPanel
            input={input}
            setInput={setInput}
            onVisualize={handleVisualize}
            onClear={handleClear}
            visualizationType={visualizationType}
            setVisualizationType={setVisualizationType}
            graphType={graphType}
            setGraphType={setGraphType}
          />
          <VisualizationPanel
            points={points}
            error={error}
            visualizationType={visualizationType}
            graphType={graphType}
          />
        </main>
      </div>
       <footer className="w-full max-w-7xl mx-auto mt-12 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Point Visualizer. Built with React, D3, Recharts, and Tailwind CSS.</p>
        </footer>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { Point } from '../types';

// The Recharts library is loaded via a script tag in index.html, making it available globally.
declare const Recharts: any;

interface ScatterPlotProps {
  data: Point[];
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data }) => {
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(typeof Recharts !== 'undefined');

  useEffect(() => {
    // If the library is already loaded when the component mounts, do nothing.
    if (typeof Recharts !== 'undefined') {
      setIsLibraryLoaded(true);
      return;
    }

    // If not loaded, poll every 100ms to check for it.
    const intervalId = setInterval(() => {
      if (typeof Recharts !== 'undefined') {
        setIsLibraryLoaded(true);
        clearInterval(intervalId);
      }
    }, 100);

    // Cleanup function to clear the interval when the component unmounts.
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount.

  if (!isLibraryLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-full text-gray-500">
        <p>Loading chart library...</p>
      </div>
    );
  }

  const { ResponsiveContainer, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Scatter, Legend } = Recharts;

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="x"
            label={{ value: 'X-axis', position: 'insideBottom', offset: -10 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="y"
            label={{ value: 'Y-axis', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name="Points" data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlot;
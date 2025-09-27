
import React from 'react';
import { Point, VisualizationType, GraphType } from '../types';
import ScatterPlot from './ScatterPlot';
import Graph from './Graph';

interface VisualizationPanelProps {
  points: Point[] | null;
  error: string | null;
  visualizationType: VisualizationType;
  graphType: GraphType;
}

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ points, error, visualizationType, graphType }) => {
  const renderContent = () => {
    if (error) {
      return (
        <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="font-bold">Parsing Error</h3>
          <p>{error}</p>
        </div>
      );
    }

    if (!points) {
      return (
        <div className="text-center text-gray-500">
          <p>Enter coordinate data and click "Visualize" to see the output here.</p>
        </div>
      );
    }

    if (visualizationType === 'plot') {
      return <ScatterPlot data={points} />;
    }

    if (visualizationType === 'graph') {
      return <Graph data={points} type={graphType} />;
    }
    
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center justify-center min-h-[500px] lg:h-full">
      {renderContent()}
    </div>
  );
};

export default VisualizationPanel;

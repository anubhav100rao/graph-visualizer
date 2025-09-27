
import React from 'react';
import { VisualizationType, GraphType } from '../types';

interface InputPanelProps {
  input: string;
  setInput: (value: string) => void;
  onVisualize: () => void;
  onClear: () => void;
  visualizationType: VisualizationType;
  setVisualizationType: (type: VisualizationType) => void;
  graphType: GraphType;
  setGraphType: (type: GraphType) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
  input,
  setInput,
  onVisualize,
  onClear,
  visualizationType,
  setVisualizationType,
  graphType,
  setGraphType
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col h-full">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Input Data</h2>
      <p className="text-sm text-gray-500 mb-4">
        Enter point data. Supported formats: <code>[x,y]</code>, <code>(x,y)</code>, <code>{`{x,y}`}</code>, or just <code>x y</code>. Separate points with commas, spaces, or new lines.
      </p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g., [[1, 5], [4, 8], [7, 2]]"
        className="w-full flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out font-mono text-sm"
        rows={10}
      />
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Visualization Options</h3>
        <div className="flex space-x-4 mb-4">
          {(['plot', 'graph'] as VisualizationType[]).map((type) => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="visType"
                value={type}
                checked={visualizationType === type}
                onChange={() => setVisualizationType(type)}
                className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-gray-700 capitalize">{type === 'plot' ? '2D Scatter Plot' : 'Graph'}</span>
            </label>
          ))}
        </div>

        {visualizationType === 'graph' && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 transition-all duration-300 ease-in-out">
            <h4 className="text-md font-semibold text-gray-600 mb-2">Graph Type</h4>
             <div className="flex space-x-4">
              {(['undirected', 'directed'] as GraphType[]).map((type) => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="graphType"
                    value={type}
                    checked={graphType === type}
                    onChange={() => setGraphType(type)}
                    className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex space-x-3">
        <button
          onClick={onVisualize}
          className="flex-1 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
        >
          Visualize
        </button>
        <button
          onClick={onClear}
          className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-150"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default InputPanel;

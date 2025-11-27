import React, { useMemo } from 'react';
import { DataRow, SelectionState } from '../types';
import { Search } from 'lucide-react';

interface QlikFilterPaneProps {
  field: string;
  data: DataRow[];
  globalSelections: Map<string, Set<string | number>>;
  onToggle: (field: string, value: string | number) => void;
}

export const QlikFilterPane: React.FC<QlikFilterPaneProps> = ({ field, data, globalSelections, onToggle }) => {
  
  // Calculate states for each value in this field based on Qlik associative logic
  const valueStates = useMemo(() => {
    const allValues = Array.from(new Set(data.map(row => row[field]))).sort();
    
    // 1. Determine what is currently selected in THIS field
    const currentFieldSelection = globalSelections.get(field) || new Set();

    // 2. Determine the "Possible" set. 
    // This is the set of values for THIS field that are compatible with selections in OTHER fields.
    const otherFieldSelections = new Map<string, Set<string | number>>(globalSelections);
    otherFieldSelections.delete(field); // Remove self to check possibility

    let possibleRows = data;
    if (otherFieldSelections.size > 0) {
      possibleRows = data.filter(row => {
        for (const [otherField, selectedValues] of otherFieldSelections.entries()) {
          if (!selectedValues.has(row[otherField] as string | number)) {
            return false;
          }
        }
        return true;
      });
    }
    const possibleValues = new Set(possibleRows.map(row => row[field]));

    return allValues.map(val => {
      let state = SelectionState.EXCLUDED;
      if (currentFieldSelection.has(val)) {
        state = SelectionState.SELECTED;
      } else if (possibleValues.has(val)) {
        state = SelectionState.POSSIBLE;
      }
      // "Alternative" state is usually for excluded items within a selected field, skipping for simplicity in mockup
      
      return { value: val, state };
    });

  }, [data, field, globalSelections]);

  return (
    <div className="flex flex-col h-full bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-2 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <h3 className="font-semibold text-gray-700 text-sm truncate" title={field}>{field}</h3>
        <Search className="w-3 h-3 text-gray-400" />
      </div>
      <div className="overflow-y-auto flex-grow">
        <ul>
          {valueStates.map((item) => {
            let bgClass = 'bg-gray-200 text-gray-400'; // Excluded
            if (item.state === SelectionState.SELECTED) bgClass = 'bg-[#009845] text-white border-b border-white/20';
            if (item.state === SelectionState.POSSIBLE) bgClass = 'bg-white text-gray-800 hover:bg-gray-100 cursor-pointer border-b border-gray-50';

            return (
              <li 
                key={String(item.value)}
                onClick={() => onToggle(field, item.value)}
                className={`px-3 py-1.5 text-xs transition-colors duration-150 cursor-pointer flex justify-between items-center ${bgClass}`}
              >
                <span className="truncate">{item.value}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
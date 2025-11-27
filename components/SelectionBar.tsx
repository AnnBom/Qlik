import React from 'react';
import { X, RotateCcw } from 'lucide-react';

interface SelectionBarProps {
  selections: Map<string, Set<string | number>>;
  onClearAll: () => void;
  onClearField: (field: string) => void;
}

export const SelectionBar: React.FC<SelectionBarProps> = ({ selections, onClearAll, onClearField }) => {
  const selectionArray = Array.from(selections.entries()).filter(([_, values]) => values.size > 0);

  if (selectionArray.length === 0) {
    return (
      <div className="h-12 bg-[#404040] text-gray-300 flex items-center px-4 text-sm font-light shadow-md">
        <span className="italic opacity-70">Aucune sélection active</span>
      </div>
    );
  }

  return (
    <div className="h-12 bg-[#404040] flex items-center px-2 shadow-md overflow-x-auto whitespace-nowrap">
      <div className="flex space-x-2 items-center">
        <button 
          onClick={onClearAll}
          className="bg-[#595959] hover:bg-[#666] text-white px-3 py-1 rounded-sm text-xs font-semibold flex items-center transition-colors mr-2"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          EFFACER
        </button>
        
        {selectionArray.map(([field, values]) => (
          <div key={field} className="bg-white rounded-sm flex items-center h-8 min-w-[100px] max-w-[200px] shadow-sm animate-fadeIn">
            <div className="bg-[#595959] text-white text-[10px] px-2 h-full flex items-center justify-center rounded-l-sm uppercase font-bold tracking-wider">
              {field}
            </div>
            <div className="px-2 text-xs text-gray-700 truncate flex-grow">
               {values.size > 1 ? `${values.size} sur ${values.size}` : Array.from(values)[0]} 
               {/* Simplified display for mockup */}
            </div>
            <button 
              onClick={() => onClearField(field)}
              className="px-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
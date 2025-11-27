
import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  Table as TableIcon, 
  Type, 
  LayoutGrid, 
  Calculator, 
  X, 
  Edit3, 
  Check, 
  Save,
  Info,
  Minus,
  Plus,
  Trash2,
  Database
} from 'lucide-react';
import { Widget, WidgetType } from './types';
import { ResponsiveContainer, BarChart, Bar, LineChart as ReLineChart, Line, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, Tooltip, Label, Legend } from 'recharts';

// --- TYPES ---
interface Sheet {
  id: string;
  name: string;
  title?: string; // Titre affiché sur la page
  widgets: Widget[];
}

// --- MOCK DATA FOR VISUALS ---
const MOCK_DATA = [
  { name: 'A', value: 400 },
  { name: 'B', value: 300 },
  { name: 'C', value: 550 },
  { name: 'D', value: 200 },
  { name: 'E', value: 450 },
];
const COLORS = ['#4477AA', '#7DB8DA', '#B6D7EA', '#46c646', '#F9BA00'];

// --- COMPOSANTS ---

const WidgetRenderer: React.FC<{ widget: Widget }> = ({ widget }) => {
  const dimLabel = widget.config?.dimension || 'Dimension';
  const measureLabel = widget.config?.measure || 'Mesure';

  switch (widget.type) {
    case 'kpi':
      return (
        <div className="flex flex-col items-center justify-center h-full pb-4">
          <span className="text-gray-500 text-sm uppercase">{measureLabel}</span>
          <span className="text-4xl font-bold text-[#4477AA]">124.5K</span>
        </div>
      );
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MOCK_DATA} margin={{top: 10, right: 10, left: 10, bottom: 20}}>
            <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={true} tickLine={false}>
               <Label value={dimLabel} offset={0} position="insideBottom" style={{fontSize: '10px', fill: '#666', fontWeight: 500}} dy={10} />
            </XAxis>
            <YAxis tick={{fontSize: 10}} axisLine={true} tickLine={false}>
               <Label value={measureLabel} angle={-90} position="insideLeft" style={{fontSize: '10px', fill: '#666', fontWeight: 500}} />
            </YAxis>
            <Tooltip 
              cursor={{fill: '#f4f4f4'}}
              formatter={(value: number) => [value, measureLabel]}
              labelFormatter={(label) => `${dimLabel}: ${label}`}
              contentStyle={{ borderRadius: '4px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" fill="#4477AA" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'line':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ReLineChart data={MOCK_DATA} margin={{top: 10, right: 10, left: 10, bottom: 20}}>
             <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={true} tickLine={false}>
                <Label value={dimLabel} offset={0} position="insideBottom" style={{fontSize: '10px', fill: '#666', fontWeight: 500}} dy={10} />
             </XAxis>
             <YAxis tick={{fontSize: 10}} axisLine={true} tickLine={false}>
                <Label value={measureLabel} angle={-90} position="insideLeft" style={{fontSize: '10px', fill: '#666', fontWeight: 500}} />
             </YAxis>
             <Tooltip 
                formatter={(value: number) => [value, measureLabel]}
                labelFormatter={(label) => `${dimLabel}: ${label}`}
                contentStyle={{ borderRadius: '4px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
             />
            <Line type="monotone" dataKey="value" stroke="#4477AA" strokeWidth={3} dot={{r:4}} />
          </ReLineChart>
        </ResponsiveContainer>
      );
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart margin={{bottom: 20}}>
            <Pie data={MOCK_DATA} innerRadius={30} outerRadius={60} paddingAngle={2} dataKey="value">
              {MOCK_DATA.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
                formatter={(value: number) => [value, measureLabel]}
                contentStyle={{ borderRadius: '4px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
             />
             <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{fontSize: '10px', paddingTop: '10px'}}
             />
          </RePieChart>
        </ResponsiveContainer>
      );
    case 'filter':
      return (
        <div className="h-full flex flex-col">
          {[dimLabel, 'Année', 'Mois', 'Région'].slice(0, 4).map((item, i) => (
            <div key={i} className="px-3 py-2 border-b border-gray-100 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
              {item}
            </div>
          ))}
        </div>
      );
    case 'table':
        return (
            <div className="h-full w-full overflow-hidden text-xs">
                <div className="flex bg-gray-100 p-2 font-semibold text-gray-700">
                    <div className="flex-1">{dimLabel}</div>
                    <div className="w-20 text-right">{measureLabel}</div>
                </div>
                {MOCK_DATA.map((row, i) => (
                    <div key={i} className="flex border-b border-gray-50 p-2 hover:bg-gray-50">
                        <div className="flex-1">Élément {row.name}</div>
                        <div className="w-20 text-right">{row.value}</div>
                    </div>
                ))}
            </div>
        );
    case 'text':
      return (
        <div className="h-full flex items-center justify-center p-4 text-center text-gray-600">
            {widget.content || "Ajouter un titre ou une description ici."}
        </div>
      );
    default:
      return null;
  }
};

const DraggableAsset: React.FC<{ type: WidgetType; label: string; icon: any }> = ({ type, label, icon: Icon }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('widgetType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div 
      draggable 
      onDragStart={handleDragStart}
      className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-sm cursor-grab hover:shadow-md hover:border-[#F9BA00] transition-all group"
    >
      <Icon className="w-6 h-6 text-gray-500 group-hover:text-[#F9BA00] mb-2" />
      <span className="text-xs text-center text-gray-600 font-medium">{label}</span>
    </div>
  );
};

// --- PROPERTIES PANEL (RIGHT SIDEBAR) ---

interface PropertiesPanelProps {
  widget: Widget;
  onUpdate: (updated: Widget) => void;
  onClose: () => void;
  onRemove: (id: string) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ widget, onUpdate, onClose, onRemove }) => {
  
  const handleResize = (dim: 'w' | 'h', delta: number) => {
    const newVal = widget[dim] + delta;
    if (dim === 'w' && (newVal < 1 || newVal > 12)) return;
    if (dim === 'h' && newVal < 1) return;
    onUpdate({ ...widget, [dim]: newVal });
  };

  const updateConfig = (key: string, value: string) => {
      const newConfig = { ...widget.config, [key]: value };
      onUpdate({ ...widget, config: newConfig });
  };

  const getAxisLabels = () => {
    switch (widget.type) {
        case 'pie': return { dim: 'Dimension (Secteurs)', meas: 'Mesure (Taille/Angle)' };
        case 'table': return { dim: 'Dimension (Lignes)', meas: 'Mesure (Colonnes)' };
        case 'kpi': return { dim: '-', meas: 'Mesure (Chiffre)' };
        default: return { dim: 'Dimension (Axe X)', meas: 'Mesure (Axe Y)' };
    }
  };

  const axisLabels = getAxisLabels();

  return (
    <div className="w-80 bg-white border-l border-gray-300 flex flex-col h-full shadow-lg z-30 animate-slideInRight">
       <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50">
          <span className="font-semibold text-gray-700 uppercase text-xs tracking-wider">Propriétés</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
             <X className="w-4 h-4" />
          </button>
       </div>

       <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/50">
          
          {/* Section: General */}
          <div className="space-y-3">
             <h4 className="text-xs font-bold text-gray-900 uppercase border-b border-gray-200 pb-1">Général</h4>
             <div>
                <label className="block text-[11px] text-gray-500 font-medium mb-1">Titre</label>
                <input 
                   type="text" 
                   value={widget.title} 
                   onChange={(e) => onUpdate({...widget, title: e.target.value})}
                   className="w-full text-sm p-2 border border-gray-300 rounded-sm bg-white focus:border-[#F9BA00] focus:ring-1 focus:ring-[#F9BA00] outline-none transition-all shadow-sm"
                />
             </div>
             <div>
                <label className="block text-[11px] text-gray-500 font-medium mb-1">Commentaire / Info-bulle</label>
                <textarea 
                   value={widget.comment || ''} 
                   onChange={(e) => onUpdate({...widget, comment: e.target.value})}
                   className="w-full text-sm p-2 border border-gray-300 rounded-sm bg-white focus:border-[#F9BA00] outline-none h-20 resize-none placeholder-gray-400 shadow-sm"
                   placeholder="Ce texte s'affichera au survol de l'icône Info..."
                />
             </div>
          </div>

          {/* Section: Data (Axes) */}
          {['bar', 'line', 'pie', 'table', 'kpi'].includes(widget.type) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
                    <Database className="w-3 h-3 text-[#009845]" />
                    <h4 className="text-xs font-bold text-gray-900 uppercase">Données</h4>
                </div>
                
                {widget.type !== 'kpi' && (
                    <div>
                        <label className="block text-[11px] text-gray-500 font-medium mb-1">{axisLabels.dim}</label>
                        <input 
                        type="text" 
                        value={widget.config?.dimension || ''} 
                        onChange={(e) => updateConfig('dimension', e.target.value)}
                        placeholder="Ex: Mois, Produit..."
                        className="w-full text-sm p-2 border border-gray-300 rounded-sm bg-white focus:border-[#F9BA00] focus:ring-1 focus:ring-[#F9BA00] outline-none transition-all shadow-sm"
                        />
                    </div>
                )}
                
                {widget.type !== 'filter' && (
                    <div>
                        <label className="block text-[11px] text-gray-500 font-medium mb-1">{axisLabels.meas}</label>
                        <input 
                        type="text" 
                        value={widget.config?.measure || ''} 
                        onChange={(e) => updateConfig('measure', e.target.value)}
                        placeholder="Ex: Ventes, Marge..."
                        className="w-full text-sm p-2 border border-gray-300 rounded-sm bg-white focus:border-[#F9BA00] focus:ring-1 focus:ring-[#F9BA00] outline-none transition-all shadow-sm"
                        />
                    </div>
                )}
              </div>
          )}

          {/* Section: Appearance / Layout */}
          <div className="space-y-3">
             <h4 className="text-xs font-bold text-gray-900 uppercase border-b border-gray-200 pb-1">Apparence & Grille</h4>
             
             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[11px] text-gray-500 font-medium mb-1">Largeur (Cols)</label>
                    <div className="flex items-center bg-white border border-gray-300 rounded-sm shadow-sm">
                       <button onClick={() => handleResize('w', -1)} className="p-2 hover:bg-gray-100 text-gray-600 disabled:opacity-30 border-r border-gray-100" disabled={widget.w <= 1}><Minus className="w-3 h-3"/></button>
                       <span className="flex-1 text-center text-sm font-semibold">{widget.w}</span>
                       <button onClick={() => handleResize('w', 1)} className="p-2 hover:bg-gray-100 text-gray-600 disabled:opacity-30 border-l border-gray-100" disabled={widget.w >= 12}><Plus className="w-3 h-3"/></button>
                    </div>
                 </div>
                 <div>
                    <label className="block text-[11px] text-gray-500 font-medium mb-1">Hauteur (Lignes)</label>
                    <div className="flex items-center bg-white border border-gray-300 rounded-sm shadow-sm">
                       <button onClick={() => handleResize('h', -1)} className="p-2 hover:bg-gray-100 text-gray-600 disabled:opacity-30 border-r border-gray-100" disabled={widget.h <= 1}><Minus className="w-3 h-3"/></button>
                       <span className="flex-1 text-center text-sm font-semibold">{widget.h}</span>
                       <button onClick={() => handleResize('h', 1)} className="p-2 hover:bg-gray-100 text-gray-600 border-l border-gray-100"><Plus className="w-3 h-3"/></button>
                    </div>
                 </div>
             </div>
             <p className="text-[10px] text-gray-400 italic">
                Ajustez la taille de l'objet sur la grille de 12 colonnes.
             </p>
          </div>

          {/* Section: Content (Text Widget only) */}
          {widget.type === 'text' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-900 uppercase border-b border-gray-200 pb-1">Contenu</h4>
              <div>
                <textarea 
                    value={widget.content || ''} 
                    onChange={(e) => onUpdate({...widget, content: e.target.value})}
                    className="w-full text-sm p-2 border border-gray-300 rounded-sm bg-white focus:border-[#F9BA00] outline-none h-32 shadow-sm"
                    placeholder="Contenu affiché..."
                />
              </div>
            </div>
          )}

       </div>

       {/* Footer Actions */}
       <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button 
             onClick={() => onRemove(widget.id)}
             className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-red-600 py-2 rounded-sm text-sm hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
          >
             <Trash2 className="w-4 h-4" />
             Supprimer l'objet
          </button>
       </div>
    </div>
  );
};


// --- DASHBOARD ITEM ---

interface DashboardItemProps {
  widget: Widget;
  editMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: (id: string) => void;
  onUpdate: (updated: Widget) => void;
}

const DashboardItem: React.FC<DashboardItemProps> = ({ widget, editMode, isSelected, onSelect, onRemove, onUpdate }) => {
  const itemRef = useRef<HTMLDivElement>(null);

  // --- RESIZE HANDLER ---
  const handleResizeStart = (e: React.MouseEvent, direction: 'e' | 's' | 'se') => {
    e.preventDefault();
    e.stopPropagation();

    const gridEl = itemRef.current?.closest('.grid-container');
    if (!gridEl) return;

    const gridRect = gridEl.getBoundingClientRect();
    const gap = 8; 
    const totalGapWidth = 11 * gap; 
    const colWidth = (gridRect.width - totalGapWidth) / 12;
    const rowHeight = 60 + gap;

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = widget.w;
    const startH = widget.h;

    const onMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      
      let newW = startW;
      let newH = startH;

      if (direction.includes('e')) {
         const deltaCols = Math.round(dx / (colWidth + gap));
         newW = Math.max(1, Math.min(12, startW + deltaCols));
      }

      if (direction.includes('s')) {
         const deltaRows = Math.round(dy / rowHeight);
         newH = Math.max(1, startH + deltaRows);
      }

      if (newW !== widget.w || newH !== widget.h) {
        onUpdate({ ...widget, w: newW, h: newH });
      }
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div 
      ref={itemRef}
      className={`
        bg-white rounded-sm shadow-sm flex flex-col group relative transition-all duration-75
        ${editMode 
            ? isSelected 
                ? 'border-2 border-[#F9BA00] ring-1 ring-[#F9BA00]/20 z-20' 
                : 'border border-dashed border-gray-300 hover:border-solid hover:border-gray-400' 
            : 'border border-transparent hover:shadow-md'
        }
      `}
      style={{
        gridColumn: `span ${widget.w}`,
        gridRow: `span ${widget.h}`
      }}
    >
       {/* --- VIEW MODE: COMMENT TOOLTIP --- */}
       {!editMode && widget.comment && (
         <div className="absolute top-2 right-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="relative group/tooltip">
                <div className="bg-white p-1.5 rounded-full shadow-md border border-gray-200 cursor-help hover:bg-gray-50">
                    <Info className="w-4 h-4 text-gray-600" />
                </div>
                <div className="absolute right-0 top-full mt-2 w-64 bg-white text-gray-700 text-xs p-3 rounded-md shadow-xl border border-gray-200 hidden group-hover/tooltip:block z-50 whitespace-pre-wrap leading-relaxed">
                   <div className="absolute -top-1.5 right-3 w-3 h-3 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
                   {widget.comment}
                </div>
            </div>
         </div>
       )}

       {/* --- EDIT MODE: CONTROLS & RESIZERS --- */}
       {editMode && (
         <>
            <div 
               onClick={(e) => { e.stopPropagation(); onSelect(); }}
               className="absolute inset-0 bg-transparent z-10 cursor-pointer" 
            />

            <button
               onClick={(e) => {
                  e.stopPropagation();
                  onRemove(widget.id);
               }}
               className="absolute top-[-8px] right-[-8px] z-50 bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
               title="Supprimer"
            >
               <X className="w-3 h-3" />
            </button>
            
            {isSelected && (
              <div className="absolute -top-2.5 -right-2.5 bg-[#F9BA00] text-white p-1 rounded-full shadow-sm z-30 pointer-events-none hidden group-hover:block">
                 <Check className="w-3 h-3" />
              </div>
            )}

            {isSelected && (
              <>
                 <div 
                    className="absolute top-1/2 right-[-6px] transform -translate-y-1/2 w-3 h-8 bg-white border border-[#F9BA00] rounded-sm cursor-ew-resize z-40 flex items-center justify-center hover:bg-[#F9BA00] group/handle shadow-sm"
                    onMouseDown={(e) => handleResizeStart(e, 'e')}
                 >
                    <div className="w-0.5 h-4 bg-[#F9BA00] group-hover/handle:bg-white"></div>
                 </div>

                 <div 
                    className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-8 h-3 bg-white border border-[#F9BA00] rounded-sm cursor-ns-resize z-40 flex items-center justify-center hover:bg-[#F9BA00] group/handle shadow-sm"
                    onMouseDown={(e) => handleResizeStart(e, 's')}
                 >
                    <div className="w-4 h-0.5 bg-[#F9BA00] group-hover/handle:bg-white"></div>
                 </div>

                 <div 
                    className="absolute bottom-[-6px] right-[-6px] w-4 h-4 bg-[#F9BA00] border border-white rounded-full cursor-nwse-resize z-50 shadow-sm hover:scale-125 transition-transform"
                    onMouseDown={(e) => handleResizeStart(e, 'se')}
                 />
              </>
            )}
         </>
       )}


       {/* Header */}
       {widget.title && (
          <div className="px-3 py-2 border-b border-gray-50 shrink-0 h-9 flex items-center">
             <h3 className="font-semibold text-gray-700 text-xs truncate select-none w-full" title={widget.title}>
               {widget.title}
             </h3>
          </div>
       )}

       {/* Body */}
       <div className="flex-1 min-h-0 p-2 relative">
          <WidgetRenderer widget={widget} />
       </div>
    </div>
  );
};


// --- MAIN APP ---

const App: React.FC = () => {
  const [editMode, setEditMode] = useState(true);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [sheetToDelete, setSheetToDelete] = useState<string | null>(null);
  
  // -- Sheets State --
  const [sheets, setSheets] = useState<Sheet[]>(() => {
    try {
        const savedSheets = localStorage.getItem('qlik_mock_sheets');
        if (savedSheets) {
            const parsed = JSON.parse(savedSheets);
            // Migrate old sheets without title
            return parsed.map((s: any) => ({
                ...s,
                title: s.title || s.name // Default title to sheet name if missing
            }));
        }

        // Migration from legacy structure
        const legacyWidgets = localStorage.getItem('qlik_mock_widgets');
        if (legacyWidgets) {
            return [{ id: 'sheet-1', name: 'Feuille 1', title: 'Feuille 1', widgets: JSON.parse(legacyWidgets) }];
        }
        return [{ id: 'sheet-1', name: 'Feuille 1', title: 'Feuille 1', widgets: [] }];
    } catch (e) {
        return [{ id: 'sheet-1', name: 'Feuille 1', title: 'Feuille 1', widgets: [] }];
    }
  });

  const [activeSheetId, setActiveSheetId] = useState<string>(() => {
      const saved = localStorage.getItem('qlik_mock_active_sheet');
      return saved || 'sheet-1';
  });

  const [title, setTitle] = useState(() => {
    return localStorage.getItem('qlik_mock_title') || "Mon Application";
  });

  // -- Persistence --
  useEffect(() => {
    localStorage.setItem('qlik_mock_sheets', JSON.stringify(sheets));
  }, [sheets]);

  useEffect(() => {
    localStorage.setItem('qlik_mock_active_sheet', activeSheetId);
  }, [activeSheetId]);

  useEffect(() => {
    localStorage.setItem('qlik_mock_title', title);
  }, [title]);

  // -- Helpers --
  // Ensure activeSheet is robust
  const activeSheet = sheets.find(s => s.id === activeSheetId) || sheets[0];
  const activeWidgets = activeSheet?.widgets || [];

  // If activeSheetId points to nothing (e.g. invalid state), reset it to first sheet
  useEffect(() => {
      if (sheets.length > 0 && !sheets.find(s => s.id === activeSheetId)) {
          setActiveSheetId(sheets[0].id);
      }
  }, [sheets, activeSheetId]);

  const updateSheet = (sheetId: string, newWidgets: Widget[]) => {
      setSheets(prev => prev.map(s => s.id === sheetId ? { ...s, widgets: newWidgets } : s));
  };

  const updateSheetName = (sheetId: string, newName: string) => {
      setSheets(prev => prev.map(s => s.id === sheetId ? { ...s, name: newName } : s));
  };

  const updateSheetTitle = (sheetId: string, newTitle: string) => {
      setSheets(prev => prev.map(s => s.id === sheetId ? { ...s, title: newTitle } : s));
  };

  const addSheet = () => {
      const newId = `sheet-${Date.now()}`;
      const name = `Feuille ${sheets.length + 1}`;
      const newSheet: Sheet = { id: newId, name: name, title: name, widgets: [] };
      setSheets([...sheets, newSheet]);
      setActiveSheetId(newId);
  };

  const removeSheet = (id: string) => {
      if (sheets.length <= 1) return; // Prevent deleting last sheet
      const newSheets = sheets.filter(s => s.id !== id);
      setSheets(newSheets);
      if (activeSheetId === id) {
          setActiveSheetId(newSheets[0].id);
      }
  };

  // Deselect if switching modes
  useEffect(() => {
      if (!editMode) setSelectedWidgetId(null);
  }, [editMode]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('widgetType') as WidgetType;
    
    if (type) {
      let w = 4;
      let h = 4;
      
      if (type === 'kpi') { w = 2; h = 2; }
      if (type === 'filter') { w = 2; h = 6; }
      if (type === 'text') { w = 3; h = 2; }
      if (['bar', 'line', 'pie', 'table'].includes(type)) { w = 6; h = 5; }

      const newId = Math.random().toString(36).substr(2, 9);
      const newWidget: Widget = {
        id: newId,
        type,
        title: type === 'kpi' ? 'KPI' : type === 'text' ? '' : 'Titre du graphique',
        w,
        h,
        config: {
            dimension: 'Dimension',
            measure: 'Mesure'
        }
      };
      
      updateSheet(activeSheetId, [...activeWidgets, newWidget]);
      setSelectedWidgetId(newId);
    }
  };

  const removeWidget = (id: string) => {
    updateSheet(activeSheetId, activeWidgets.filter(w => w.id !== id));
    if (selectedWidgetId === id) setSelectedWidgetId(null);
  };

  const updateWidget = (updated: Widget) => {
    updateSheet(activeSheetId, activeWidgets.map(w => w.id === updated.id ? updated : w));
  };

  const selectedWidget = activeWidgets.find(w => w.id === selectedWidgetId);

  return (
    <div className="flex flex-col h-screen bg-[#F2F2F2] text-[#404040] font-sans overflow-hidden">
      
      {/* 1. GLOBAL TOP BAR */}
      <header className="h-12 bg-white border-b border-gray-300 flex items-center justify-between px-4 z-20 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="font-bold text-lg text-[#009845] tracking-tight">QlikMock</div>
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          {editMode ? (
             <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="font-semibold text-lg bg-transparent border-b border-dashed border-gray-400 focus:border-solid focus:border-[#009845] outline-none"
             />
          ) : (
             <h1 className="font-semibold text-lg">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-400 italic flex items-center gap-1">
             <Save className="w-3 h-3" /> Sauvegardé
          </div>
          <button 
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-sm text-sm font-medium transition-colors ${
              editMode 
              ? 'bg-[#009845] text-white shadow-sm hover:bg-green-700' 
              : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {editMode ? <><Check className="w-4 h-4" /> Terminé</> : <><Edit3 className="w-4 h-4" /> Éditer la feuille</>}
          </button>
        </div>
      </header>

      {/* 2. TAB NAVIGATION BAR */}
      <div className="h-10 bg-gray-100 border-b border-gray-300 flex items-end px-2 space-x-1 shrink-0 overflow-x-auto">
          {sheets.map(sheet => {
              const isActive = sheet.id === activeSheetId;
              return (
                  <div 
                    key={sheet.id}
                    onClick={() => setActiveSheetId(sheet.id)}
                    className={`
                        group relative flex items-center px-4 py-2 text-sm cursor-pointer rounded-t-sm border-t border-l border-r select-none min-w-[120px] max-w-[200px]
                        ${isActive 
                            ? 'bg-[#F2F2F2] border-gray-300 text-gray-900 font-medium -mb-[1px] z-10 pb-[9px]' 
                            : 'bg-white/50 border-transparent text-gray-500 hover:bg-white'
                        }
                    `}
                  >
                      {editMode ? (
                          <input 
                            value={sheet.name}
                            onChange={(e) => updateSheetName(sheet.id, e.target.value)}
                            onFocus={() => setActiveSheetId(sheet.id)} // Activer la feuille au focus
                            className={`bg-transparent outline-none w-full cursor-text ${isActive ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}
                            // Plus de stopPropagation ici pour permettre l'activation
                          />
                      ) : (
                          <span className="truncate">{sheet.name}</span>
                      )}

                      {/* Delete Tab Button (Edit Mode only, if more than 1 sheet) */}
                      {editMode && sheets.length > 1 && (
                          <button 
                             onClick={(e) => {
                                 e.stopPropagation();
                                 setSheetToDelete(sheet.id);
                             }}
                             className="ml-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                             title="Supprimer la feuille"
                          >
                              <X className="w-3 h-3" />
                          </button>
                      )}
                  </div>
              );
          })}

          {/* Add Sheet Button */}
          {editMode && (
              <button 
                onClick={addSheet}
                className="mb-1 ml-1 p-1 rounded-sm text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                title="Ajouter une feuille"
              >
                  <Plus className="w-5 h-5" />
              </button>
          )}
      </div>

      {/* 3. MAIN WORKSPACE */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT SIDEBAR (ASSETS) */}
        {editMode && (
          <aside className="w-64 bg-[#F2F2F2] border-r border-gray-300 flex flex-col z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)] animate-slideInLeft shrink-0">
             <div className="bg-white p-3 border-b border-gray-200 font-semibold text-xs text-gray-500 uppercase tracking-wide">
                Graphiques & Objets
             </div>
             <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto custom-scrollbar">
                <DraggableAsset type="bar" label="Barres" icon={BarChart3} />
                <DraggableAsset type="line" label="Courbes" icon={LineChart} />
                <DraggableAsset type="pie" label="Secteurs" icon={PieChart} />
                <DraggableAsset type="kpi" label="KPI" icon={Calculator} />
                <DraggableAsset type="table" label="Tableau" icon={TableIcon} />
                <DraggableAsset type="filter" label="Filtres" icon={LayoutGrid} />
                <DraggableAsset type="text" label="Texte" icon={Type} />
             </div>
             
             <div className="mt-auto p-4 text-[10px] text-gray-400 text-center">
                Glissez les objets sur la grille à droite.
             </div>
          </aside>
        )}

        {/* CENTER CANVAS */}
        <main 
          className="flex-1 relative overflow-y-auto bg-[#F2F2F2] p-4 transition-all"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => setSelectedWidgetId(null)} // Click background to deselect
        >
            
          {/* SHEET TITLE */}
          <div className="mb-4 ml-1">
              {editMode ? (
                  <input 
                    value={activeSheet.title || activeSheet.name} 
                    onChange={(e) => updateSheetTitle(activeSheet.id, e.target.value)}
                    className="text-2xl font-bold text-[#404040] bg-transparent border-b border-dashed border-gray-300 hover:border-gray-400 focus:border-[#009845] focus:outline-none w-full max-w-2xl px-1"
                    placeholder="Titre de la feuille"
                  />
              ) : (
                  <h2 className="text-2xl font-bold text-[#404040] px-1">
                      {activeSheet.title || activeSheet.name}
                  </h2>
              )}
          </div>

          {/* Empty State */}
          {editMode && activeWidgets.length === 0 && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="text-center">
                   <LayoutGrid className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                   <h2 className="text-2xl text-gray-400 font-light">Cette feuille est vide</h2>
                   <p className="text-gray-400">Glissez des objets depuis le panneau de gauche</p>
                </div>
             </div>
          )}

          {/* Grid Layout */}
          <div 
            className="grid-container grid grid-cols-12 gap-2 auto-rows-[60px] min-h-full content-start pb-20 relative z-10"
            onClick={(e) => e.stopPropagation()} // Prevent deselecting when clicking grid gap
          >
             {activeWidgets.map((widget) => (
                <DashboardItem 
                   key={widget.id} 
                   widget={widget} 
                   editMode={editMode}
                   isSelected={widget.id === selectedWidgetId}
                   onSelect={() => setSelectedWidgetId(widget.id)}
                   onRemove={removeWidget}
                   onUpdate={updateWidget}
                />
             ))}
          </div>
        </main>

        {/* RIGHT SIDEBAR (PROPERTIES) */}
        {editMode && selectedWidget && (
           <div className="absolute top-0 right-0 bottom-0 z-50 h-full shadow-2xl">
              <PropertiesPanel 
                  widget={selectedWidget} 
                  onUpdate={updateWidget}
                  onClose={() => setSelectedWidgetId(null)}
                  onRemove={removeWidget}
              />
           </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {sheetToDelete && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-[1px]" onClick={() => setSheetToDelete(null)}>
                <div 
                    className="bg-white rounded-md shadow-2xl w-[400px] transform transition-all scale-100 border border-gray-200" 
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-red-50 rounded-full shrink-0">
                                <Trash2 className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Supprimer la feuille ?</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Vous êtes sur le point de supprimer <strong>{sheets.find(s => s.id === sheetToDelete)?.name}</strong>.<br/>
                                    Tous les graphiques présents sur cette feuille seront perdus.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-3 bg-gray-50 rounded-b-md flex justify-end gap-3 border-t border-gray-100">
                        <button 
                            onClick={() => setSheetToDelete(null)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009845]"
                        >
                            Annuler
                        </button>
                        <button 
                            onClick={() => {
                                if (sheetToDelete) removeSheet(sheetToDelete);
                                setSheetToDelete(null);
                            }}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm"
                        >
                            Supprimer définitivement
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default App;

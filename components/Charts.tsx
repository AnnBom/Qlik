import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DataRow, WidgetConfig } from '../types';

interface ChartProps {
  config: WidgetConfig;
  data: DataRow[];
}

const COLORS = ['#4477AA', '#7DB8DA', '#B6D7EA', '#46c646', '#F9BA00', '#F76000'];

const aggregateData = (data: DataRow[], dim: string, meas: string | undefined, op: string | undefined) => {
  if (!meas) return [];
  
  const grouped: Record<string, { sum: number; count: number }> = {};

  data.forEach(row => {
    const key = String(row[dim]);
    const val = Number(row[meas]) || 0;
    
    if (!grouped[key]) grouped[key] = { sum: 0, count: 0 };
    grouped[key].sum += val;
    grouped[key].count += 1;
  });

  return Object.keys(grouped).map(key => {
    const { sum, count } = grouped[key];
    let value = sum;
    if (op === 'avg') value = sum / count;
    if (op === 'count') value = count;
    
    return { name: key, value: Math.round(value * 100) / 100 };
  }).sort((a, b) => b.value - a.value).slice(0, 15); // Top 15
};

export const SimpleBarChart: React.FC<ChartProps> = ({ config, data }) => {
  const chartData = aggregateData(data, config.dimension, config.measure, config.measureOp);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
        <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} />
        <YAxis tick={{fontSize: 10}} />
        <Tooltip cursor={{fill: 'transparent'}} />
        <Bar dataKey="value" fill="#4477AA" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SimpleLineChart: React.FC<ChartProps> = ({ config, data }) => {
  const chartData = aggregateData(data, config.dimension, config.measure, config.measureOp);
  // Sort by name for line charts usually (e.g. dates)
  chartData.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
        <XAxis dataKey="name" tick={{fontSize: 10}} />
        <YAxis tick={{fontSize: 10}} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#4477AA" strokeWidth={2} dot={{r: 3}} activeDot={{r: 5}} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const SimplePieChart: React.FC<ChartProps> = ({ config, data }) => {
  const chartData = aggregateData(data, config.dimension, config.measure, config.measureOp);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={70}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const KPIWidget: React.FC<ChartProps> = ({ config, data }) => {
  if (!config.measure) return null;
  const total = data.reduce((acc, row) => acc + (Number(row[config.measure!]) || 0), 0);
  
  let val = total;
  let label = "Total";
  if (config.measureOp === 'avg') {
    val = total / (data.length || 1);
    label = "Moyenne";
  } else if (config.measureOp === 'count') {
    val = data.length;
    label = "Nombre";
  }

  const formatted = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1, notation: "compact" }).format(val);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-2">
      <span className="text-gray-500 text-sm uppercase tracking-wide truncate w-full">{label} {config.measure}</span>
      <span className="text-4xl font-bold text-[#4477AA] mt-1 truncate w-full">{formatted}</span>
    </div>
  );
};

export const TableWidget: React.FC<ChartProps> = ({ config, data }) => {
  // Aggregate if measure exists, otherwise list unique dims
  let tableData: {name: string, value: string | number}[] = [];
  
  if (config.measure) {
    tableData = aggregateData(data, config.dimension, config.measure, config.measureOp);
  } else {
    // Just list unique values
     const uniques = Array.from(new Set(data.map(d => d[config.dimension])));
     tableData = uniques.map(u => ({ name: String(u), value: '-' }));
  }

  return (
    <div className="overflow-auto h-full w-full">
      <table className="w-full text-left text-xs text-gray-600">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="p-2 font-semibold">{config.dimension}</th>
            <th className="p-2 font-semibold text-right">{config.measure || '-'}</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, i) => (
             <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
               <td className="p-2 truncate max-w-[120px]" title={row.name}>{row.name}</td>
               <td className="p-2 text-right">{typeof row.value === 'number' ? row.value.toLocaleString() : row.value}</td>
             </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const TextWidget: React.FC<ChartProps> = ({ config }) => {
  return (
    <div className="h-full w-full p-4 flex items-center justify-center text-center">
       <div className="text-gray-700 w-full overflow-hidden">
          {config.text ? (
            <div className="font-medium text-lg whitespace-pre-wrap">{config.text}</div>
          ) : (
            <div className="text-gray-400 italic">Double-cliquez pour éditer</div>
          )}
       </div>
    </div>
  );
};
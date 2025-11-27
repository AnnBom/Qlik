
export type WidgetType = 'kpi' | 'bar' | 'line' | 'pie' | 'table' | 'filter' | 'text';

export type DataRow = Record<string, string | number>;

export interface FieldMetadata {
  name: string;
  type: 'string' | 'number' | 'date';
}

export type Dataset = DataRow[];

export enum SelectionState {
  SELECTED = 'SELECTED',
  POSSIBLE = 'POSSIBLE',
  EXCLUDED = 'EXCLUDED',
  ALTERNATIVE = 'ALTERNATIVE'
}

export interface WidgetConfig {
  dimension: string;
  measure?: string;
  measureOp?: 'sum' | 'count' | 'avg';
  text?: string;
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  x?: number; // Grid column start (optional for flow layout)
  y?: number; // Grid row start (optional for flow layout)
  w: number; // Grid column span
  h: number; // Grid row span
  content?: string; // For text widgets
  comment?: string; // Description or tooltip content
  config?: WidgetConfig;
}

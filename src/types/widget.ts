export type WidgetType = 'profile' | 'social' | 'map' | 'text' | 'image' | 'link';

export interface Widget {
  id: string;
  user_id: string;
  type: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
  content: any;
  created_at: string;
}

export const GRID_COLUMNS = 4;
export const ROW_HEIGHT = 150;
export const MIN_W = 1;
export const MAX_W = 4;
export const MIN_H = 1;
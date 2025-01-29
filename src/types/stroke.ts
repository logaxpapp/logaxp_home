export interface IStroke {
    type: string; // e.g. 'line', 'rectangle', 'text', ...
    color: string;
    points: { x: number; y: number }[]; // The path of the stroke
    [key: string]: any;
    width: number;
  }
  
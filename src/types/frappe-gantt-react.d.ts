declare module 'frappe-gantt-react' {
  import { FC } from 'react';

  /**
   * Define a shape for the tasks you will pass in.
   * Adjust fields as needed.
   */
  export interface GanttTask {
    id: string;
    name: string;
    start: string;    // e.g. "YYYY-MM-DD"
    end: string;      // e.g. "YYYY-MM-DD"
    progress?: number;
    dependencies?: string;
  }

  /**
   * Define prop types for the FrappeGantt component.
   * Add or remove props to match how the library is used in your code.
   */
  export interface FrappeGanttProps {
    tasks: GanttTask[];
    viewMode?: string;            // e.g. "Day" | "Week" | "Month"
    onClick?: (task: GanttTask) => void;
    onDateChange?: (task: GanttTask) => void;
    onProgressChange?: (task: GanttTask) => void;
    onTasksChange?: (tasks: GanttTask[]) => void;
    customPopupHtml?: (task: any) => string; // Add customPopupHtml here
    popup?: (task: any) => string;           // Add popup here
    barBackgroundColor?: string; // Add missing props
    barProgressColor?: string;
    milestoneBackgroundColor?: string;
    todayColor?: string;
    arrowColor?: string;
    fontFamily?: string;
    fontSize?: string;
    rtl?: boolean;
    locale?: string;
  }

  /**
   * Declare a named export 'FrappeGantt'.
   * This matches how the JS library actually exports its component.
   */
  export const FrappeGantt: FC<FrappeGanttProps>;

  /**
   * Optionally re-export 'GanttTask' if you want to import it easily elsewhere.
   */
  export { GanttTask };
}

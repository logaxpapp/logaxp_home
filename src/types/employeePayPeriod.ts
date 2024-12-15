// src/types/employeePayPeriod.ts

import { IPayPeriod } from './payPeriodTypes';
import { IUser } from './user';

export interface IEmployeePayPeriod {
  _id: string;
  payPeriod: IPayPeriod | string; // Reference to the PayPeriod or its ID
  employee: IUser | string; // Reference to the User or their ID
  totalHours: number; // Total hours worked in the pay period
  regularHours: number; // Regular hours worked (non-overtime)
  overtimeHours: number; // Overtime hours worked
  hourlyRate: number; // Hourly rate
  overtimeRate: number; // Overtime rate
  totalPay: number; // Total pay for the pay period
  regularPay: number; // Regular pay
  overtimePay: number; // Overtime pay
  deductions: number; // Total deductions (e.g., taxes, benefits)
  netPay: number; // Net pay after deductions
  createdAt: Date; // Record creation timestamp
  updatedAt: Date; // Record update timestamp
}

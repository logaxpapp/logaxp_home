// src/types/payPeriodTypes.ts

export enum PayPeriodStatus {
    Open = 'Open',
    Closed = 'Closed',
    Processed = 'Processed',
  }
  
  export interface IShift {
    _id: string;
    shiftType: string;
    date: string;
    startTime: string;
    endTime: string;
    assignedTo?: string;
    status: string;
    isExcess?: boolean;
    createdBy: string;
    applicationManaged: string[];
    payPeriod?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface IPayPeriod {
    _id: string;
    startDate: string;
    endDate: string;
    status: PayPeriodStatus;
    createdBy: {
      _id: string;
      name: string;
      email: string;
    };
    shifts: IShift[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface PayrollCalculation {
    totalHours: number;
    regularHours: number;
    overtimeHours: number;
    regularPay: number;
    overtimePay: number;
    totalPay: number;
  }
  
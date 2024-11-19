import React from 'react';
import Modal from '../common/Feedback/Modal';
import { PayrollCalculation } from '../../types/payPeriodTypes';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  payroll: PayrollCalculation | null;
}

const PayrollModal: React.FC<Props> = ({ isOpen, onClose, payroll }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Payroll Calculation</h2>
      {payroll ? (
        <div>
          <p>Total Hours: {payroll.totalHours.toFixed(2)}</p>
          <p>Regular Hours: {payroll.regularHours.toFixed(2)}</p>
          <p>Overtime Hours: {payroll.overtimeHours.toFixed(2)}</p>
          <p>Regular Pay: ${payroll.regularPay.toFixed(2)}</p>
          <p>Overtime Pay: ${payroll.overtimePay.toFixed(2)}</p>
          <p>Total Pay: ${payroll.totalPay.toFixed(2)}</p>
        </div>
      ) : (
        <p>No payroll data available.</p>
      )}
    </Modal>
  );
};

export default PayrollModal;

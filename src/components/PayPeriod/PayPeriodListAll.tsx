import React, { useState } from 'react';
import PayPeriodTable from './PayPeriodTable';
import CreatePayPeriodModal from './CreatePayPeriodModal';
import EditPayPeriodModal from './EditPayPeriodModal';
import ShiftsModal from './ShiftsModal';
import PayrollModal from './PayrollModal';
import { useFetchAllPayPeriodsQuery } from '../../api/payPeriodApiSlice';
import { usePayPeriodActions } from './PayPeriodActions';
import { IPayPeriod, IShift, PayrollCalculation } from '../../types/payPeriodTypes';

const PayPeriodAllList: React.FC = () => {
  const { data, refetch } = useFetchAllPayPeriodsQuery();
  const { createPayPeriod, updatePayPeriod, deletePayPeriod, closePayPeriod, processPayPeriod } =
    usePayPeriodActions();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShiftsModalOpen, setIsShiftsModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);

  const [selectedPayPeriod, setSelectedPayPeriod] = useState<IPayPeriod | null>(null);
  const [selectedShifts, setSelectedShifts] = useState<IShift[]>([]);
  const [payroll, setPayroll] = useState<PayrollCalculation | null>(null);

  const handleCreate = async (startDate: string, endDate: string) => {
    await createPayPeriod({ startDate, endDate });
    refetch();
  };

  const handleEdit = (payPeriod: IPayPeriod) => {
    setSelectedPayPeriod(payPeriod);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (id: string, startDate: string, endDate: string) => {
    await updatePayPeriod({ id, startDate, endDate });
    refetch();
  };

  const handleViewShifts = (shifts: IShift[]) => {
    setSelectedShifts(shifts);
    setIsShiftsModalOpen(true);
  };

  const handleProcess = async (id: string) => {
    const hourlyRate = 20;
    const overtimeRate = 1.5;
  
    try {
      const { data } = await processPayPeriod({ id, hourlyRate, overtimeRate });
      if (data) {
        setPayroll(data); // Update payroll state with the calculation
        setIsPayrollModalOpen(true); // Open the PayrollModal
      } else {
        console.error("Failed to process pay period: No data returned.");
      }
    } catch (error) {
      console.error("Error processing pay period:", error);
      alert("Failed to process pay period. Please try again.");
    }
  };
  

  return (
    <div>
      <button onClick={() => setIsCreateModalOpen(true)}>Create Pay Period</button>
      <PayPeriodTable
        payPeriods={data || []}
        onEdit={handleEdit}
        onViewShifts={handleViewShifts}
        onDelete={async (id) => {
          await deletePayPeriod(id);
          refetch();
        }}
        onClose={async (id) => {
          await closePayPeriod(id);
          refetch();
        }}
        onProcess={handleProcess}
      />
      <CreatePayPeriodModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />
      <EditPayPeriodModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        payPeriod={selectedPayPeriod}
        onUpdate={handleUpdate}
      />
      <ShiftsModal
        isOpen={isShiftsModalOpen}
        onClose={() => setIsShiftsModalOpen(false)}
        shifts={selectedShifts}
      />
      <PayrollModal
        isOpen={isPayrollModalOpen}
        onClose={() => setIsPayrollModalOpen(false)}
        payroll={payroll}
      />
    </div>
  );
};

export default PayPeriodAllList;

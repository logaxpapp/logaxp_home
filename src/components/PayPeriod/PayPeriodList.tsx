import React, { useState } from "react";
import PayPeriodTable from "./PayPeriodTable";
import CreatePayPeriodModal from "./CreatePayPeriodModal";
import EditPayPeriodModal from "./EditPayPeriodModal";
import ShiftsModal from "./ShiftsModal";
import PayrollModal from "./PayrollModal";
import { useFetchAllPayPeriodsQuery } from "../../api/payPeriodApiSlice";
import { usePayPeriodActions } from "./PayPeriodActions";
import { IPayPeriod, IShift, PayrollCalculation } from "../../types/payPeriodTypes";
import { FaPlus, FaSpinner } from "react-icons/fa";
import Button from "../common/Button";

const PayPeriodList: React.FC = () => {
  const { data, refetch, isLoading, isFetching } = useFetchAllPayPeriodsQuery();
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
        setPayroll(data);
        setIsPayrollModalOpen(true);
      } else {
        console.error("Failed to process pay period: No data returned.");
      }
    } catch (error) {
      console.error("Error processing pay period:", error);
      alert("Failed to process pay period. Please try again.");
    }
  };

  return (
    <div className="bg-blue-50 p-4 dark:bg-gray-700">
      <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg dark:bg-gray-600">
        <h1 className="text-3xl font-bold text-blue-800 font-primary dark:text-lemonGreen-light">Manage Pay Periods</h1>
        <Button 
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <FaPlus className="mr-2" />
          Create Pay Period
        </Button>
      </div>

      {/* Feedback Loading State */}
      {isFetching && (
        <div className="flex justify-center items-center mb-4">
          <FaSpinner className="animate-spin h-6 w-6 text-blue-500 mr-2" />
          <span>Loading Pay Periods...</span>
        </div>
      )}

      {/* PayPeriod Table */}
      {data ? (
        <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
          <PayPeriodTable
            payPeriods={data}
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
        </div>
      ) : (
        <div className="text-center text-gray-500">No Pay Periods Found</div>
      )}

      {/* Modals */}
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

export default PayPeriodList;

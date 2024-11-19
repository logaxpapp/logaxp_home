import {
    useCreatePayPeriodMutation,
    useUpdatePayPeriodMutation,
    useDeletePayPeriodMutation,
    useClosePayPeriodMutation,
    useProcessPayPeriodMutation,
  } from '../../api/payPeriodApiSlice';
  
  export const usePayPeriodActions = () => {
    const [createPayPeriod] = useCreatePayPeriodMutation();
    const [updatePayPeriod] = useUpdatePayPeriodMutation();
    const [deletePayPeriod] = useDeletePayPeriodMutation();
    const [closePayPeriod] = useClosePayPeriodMutation();
    const [processPayPeriod] = useProcessPayPeriodMutation();
  
    return {
      createPayPeriod,
      updatePayPeriod,
      deletePayPeriod,
      closePayPeriod,
      processPayPeriod,
    };
  };
  
// src/components/ApprovalRequestItem.tsx

import React from 'react';
import { IApprovalRequest } from '../types/approval';
import { Button, Stack } from '@mui/material';

interface ApprovalRequestItemProps {
  approval: IApprovalRequest;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}

const ApprovalRequestItem: React.FC<ApprovalRequestItemProps> = ({
 
  onApprove,
  onReject,
  onDelete,
}) => {
  return (
    <Stack direction="row" spacing={1}>
      <Button variant="contained" color="success" size="small" onClick={onApprove}>
        Approve
      </Button>
      <Button variant="contained" color="warning" size="small" onClick={onReject}>
        Reject
      </Button>
      <Button variant="outlined" color="error" size="small" onClick={onDelete}>
        Delete
      </Button>
    </Stack>
  );
};

export default ApprovalRequestItem;

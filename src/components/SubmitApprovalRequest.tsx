import React, { useState } from 'react';
import {
  Button,
  TextField,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
} from '@mui/material';
import { useSubmitApprovalRequestMutation } from '../api/approvalsApi';
import Notification from './Notification';
import { isFetchBaseQueryError, isSerializedError } from '../types/typeGuards';
import { IApprovalRequest, ApprovalRequestType } from '../types/approval';

const SubmitApprovalRequest: React.FC = () => {
  const [submitApproval, { isLoading }] = useSubmitApprovalRequestMutation();
  const [requestType, setRequestType] = useState<ApprovalRequestType | ''>(''); // Updated to enforce valid types
  const [requestDetails, setRequestDetails] = useState('');
  const [errors, setErrors] = useState<{ request_type?: string; request_details?: string }>({});
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side Validation
    const newErrors: { request_type?: string; request_details?: string } = {};
    if (!requestType) newErrors.request_type = 'Request type is required';
    if (!requestDetails.trim()) newErrors.request_details = 'Request details are required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload: IApprovalRequest = {
        request_type: requestType as ApprovalRequestType, // Cast to ensure type safety
        request_details: requestDetails,
      } as unknown as IApprovalRequest; // Ensure it matches the IApprovalRequest interface

      await submitApproval(payload).unwrap();

      setNotification({
        open: true,
        message: 'Approval request submitted successfully!',
        severity: 'success',
      });
      setRequestType('');
      setRequestDetails('');
      setErrors({});
    } catch (err: unknown) {
      if (isFetchBaseQueryError(err)) {
        // Handle Validation Errors
        if (err.data && typeof err.data === 'object' && 'errors' in err.data) {
          const serverErrors = (err.data as any).errors;
          const fieldErrors: { request_type?: string; request_details?: string } = {};
          serverErrors.forEach((error: any) => {
            if (error.path === 'request_type') {
              fieldErrors.request_type = error.msg;
            }
            if (error.path === 'request_details') {
              fieldErrors.request_details = error.msg;
            }
          });
          setErrors(fieldErrors);
        }
        setNotification({
          open: true,
          message: (err.data as { message: string })?.message || 'Failed to submit request.',
          severity: 'error',
        });
      } else if (isSerializedError(err)) {
        setNotification({
          open: true,
          message: err.message || 'Failed to submit request.',
          severity: 'error',
        });
      } else {
        setNotification({
          open: true,
          message: 'An unknown error occurred.',
          severity: 'error',
        });
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Submit Approval Request
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          {/* Request Type Field */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Request Type
            </Typography>
            <Select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value as ApprovalRequestType)}
              displayEmpty
              fullWidth
              error={Boolean(errors.request_type)}
            >
              <MenuItem value="" disabled>
                Select Request Type
              </MenuItem>
              <MenuItem value="Leave">Leave</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
              <MenuItem value="Appraisal">Appraisal</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            {errors.request_type && (
              <Typography color="error" variant="caption">
                {errors.request_type}
              </Typography>
            )}
          </Grid>

          {/* Request Details Field */}
          <Grid item xs={12}>
            <TextField
              label="Request Details"
              variant="outlined"
              fullWidth
              required
              multiline
              rows={4}
              value={requestDetails}
              onChange={(e) => setRequestDetails(e.target.value)}
              error={Boolean(errors.request_details)}
              helperText={errors.request_details}
            />
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </Box>
      </Box>

      {/* Notification */}
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </Paper>
  );
};

export default SubmitApprovalRequest;

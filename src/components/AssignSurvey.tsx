// src/components/AssignSurvey.tsx

import React, { useState } from 'react';
import {
  Button,
  TextField,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import {
  useAssignSurveyMutation,
  useGetAllSurveysQuery,
} from '../api/apiSlice';
import { useFetchAllUsersQuery } from '../api/usersApi';
import Notification from './Notification';

interface IUser {
  _id: string;
  name: string;
  // ... other user properties
}

interface ISurvey {
  _id: string;
  title: string;
  // ... other survey properties
}

const AssignSurvey: React.FC = () => {
  const [assignSurvey, { isLoading }] = useAssignSurveyMutation();
  const { data: usersData, isLoading: isUsersLoading } = useFetchAllUsersQuery({ page: 1, limit: 10 });
  const { data: surveysData, isLoading: isSurveysLoading } = useGetAllSurveysQuery();
  const [selectedSurvey, setSelectedSurvey] = useState<ISurvey | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [dueDate, setDueDate] = useState('');
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
    if (!selectedSurvey || selectedUsers.length === 0) {
      setNotification({
        open: true,
        message: 'Please select a survey and at least one user.',
        severity: 'error',
      });
      return;
    }
    try {
      await assignSurvey({
        surveyId: selectedSurvey._id,
        userIds: selectedUsers.map((user) => user._id),
        dueDate,
      }).unwrap();
      setNotification({
        open: true,
        message: 'Survey assigned successfully!',
        severity: 'success',
      });
      setSelectedSurvey(null);
      setSelectedUsers([]);
      setDueDate('');
    } catch (err: any) {
      setNotification({
        open: true,
        message: err?.data?.message || 'Failed to assign survey.',
        severity: 'error',
      });
    }
  };

  // Define the renderActions function (if needed)
  const renderActions = (row: ISurvey) => (
    <Button
      variant="outlined"
      color="primary"
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        // Define any actions like editing the survey
      }}
      aria-label={`Edit survey ${row.title}`}
    >
      Edit
    </Button>
  );

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Assign Survey to Users
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Autocomplete
          options={surveysData || []} // Assuming useGetAllSurveysQuery returns ISurvey[]
          getOptionLabel={(option) => option.title}
          loading={isSurveysLoading}
          value={selectedSurvey}
          onChange={(event, newValue) => {
            setSelectedSurvey(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Survey"
              variant="outlined"
              margin="normal"
              required
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isSurveysLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        <Autocomplete
          multiple
          options={usersData?.users || []} // Corrected: Access 'users' array
          getOptionLabel={(option) => option.name}
          loading={isUsersLoading}
          value={selectedUsers}
          onChange={(event, newValue) => {
            setSelectedUsers(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Users"
              variant="outlined"
              margin="normal"
              required
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isUsersLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        <TextField
          label="Due Date"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Assign Survey'}
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

export default AssignSurvey;

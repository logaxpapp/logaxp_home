// src/components/CreateSurvey.tsx

import React, { useState } from 'react';
import {
  Button,
  TextField,
  Paper,
  Typography,
  Box,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { useCreateSurveyMutation } from '../api/apiSlice';
import { IQuestion } from '../types/survey';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import Notification from './Notification';

const questionTypes = ['Multiple Choice', 'Text', 'Rating', 'Checkbox'];

const CreateSurvey: React.FC = () => {
  const [createSurvey, { isLoading }] = useCreateSurveyMutation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<IQuestion[]>([
    { question_text: '', question_type: 'Text' },
  ]);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleQuestionChange = (index: number, field: keyof IQuestion, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', question_type: 'Text' }]);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, idx) => idx !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSurvey = {
        title,
        description,
        questions,
      };
      await createSurvey(newSurvey).unwrap();
      setNotification({ open: true, message: 'Survey created successfully!', severity: 'success' });
      setTitle('');
      setDescription('');
      setQuestions([{ question_text: '', question_type: 'Text' }]);
    } catch (err: any) {
      setNotification({ open: true, message: err?.data?.message || 'Failed to create survey.', severity: 'error' });
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Create New Survey
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Survey Title"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Survey Description"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Questions
        </Typography>
        {questions.map((question, index) => (
          <Box key={index} sx={{ mb: 2, padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1">Question {index + 1}</Typography>
              <IconButton
                color="error"
                onClick={() => removeQuestion(index)}
                disabled={questions.length === 1}
              >
                <RemoveCircle />
              </IconButton>
            </Box>
            <TextField
              label="Question Text"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              value={question.question_text}
              onChange={(e) => handleQuestionChange(index, 'question_text', e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id={`question-type-label-${index}`}>Question Type</InputLabel>
              <Select
                labelId={`question-type-label-${index}`}
                label="Question Type"
                value={question.question_type}
                onChange={(e) => handleQuestionChange(index, 'question_type', e.target.value)}
              >
                {questionTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {(question.question_type === 'Multiple Choice' || question.question_type === 'Checkbox') && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Options</Typography>
                {question.options?.map((option, optIndex) => (
                  <Box key={optIndex} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TextField
                      label={`Option ${optIndex + 1}`}
                      variant="outlined"
                      fullWidth
                      value={option}
                      onChange={(e) => {
                        const updatedOptions = [...(question.options || [])];
                        updatedOptions[optIndex] = e.target.value;
                        handleQuestionChange(index, 'options', updatedOptions);
                      }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => {
                        const updatedOptions = [...(question.options || [])].filter((_, i) => i !== optIndex);
                        handleQuestionChange(index, 'options', updatedOptions);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <RemoveCircle />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  variant="text"
                  startIcon={<AddCircle />}
                  onClick={() => {
                    const updatedOptions = [...(question.options || []), ''];
                    handleQuestionChange(index, 'options', updatedOptions);
                  }}
                  sx={{ mt: 1 }}
                >
                  Add Option
                </Button>
              </Box>
            )}
          </Box>
        ))}
        <Button
          variant="text"
          startIcon={<AddCircle />}
          onClick={addQuestion}
          sx={{ mb: 2 }}
        >
          Add Question
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Create Survey'}
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

export default CreateSurvey;

// src/types/contractorEditForm.ts

import * as yup from 'yup';

// Define the structure of the address
export interface AddressForm {
  street: string;
  city: string;
  state: string;
  country: string;
}

// Define the form data interface
export interface ContractorEditForm {
  name: string;
  email: string;
  phone_number: string;
  role: string;
  status: 'Active' | 'Pending' | 'Suspended';
  employee_id: string;
  address: AddressForm;
  hourlyRate: number;
  overtimeRate: number;
  // Add or remove fields as necessary based on what can be edited
}

// Define the Yup validation schema
export const contractorEditSchema = yup.object().shape({
  name: yup.string().required('Name is required.'),
  email: yup
    .string()
    .email('Invalid email format.')
    .required('Email is required.'),
  phone_number: yup
    .string()
    .matches(/^\d{10,15}$/, 'Phone number must be between 10 and 15 digits.')
    .required('Phone number is required.'),
  role: yup.string().required('Role is required.'),
  status: yup
    .string()
    .oneOf(['Active', 'Pending', 'Suspended'], 'Invalid status.')
    .required('Status is required.'),
  employee_id: yup.string().required('Employee ID is required.'),
  address: yup.object().shape({
    street: yup.string().required('Street is required.'),
    city: yup.string().required('City is required.'),
    state: yup.string().required('State is required.'),
    country: yup.string().required('Country is required.'),
  }),
  hourlyRate: yup
    .number()
    .typeError('Hourly rate must be a number.')
    .min(0, 'Hourly rate cannot be negative.')
    .required('Hourly rate is required.'),
  overtimeRate: yup
    .number()
    .typeError('Overtime rate must be a number.')
    .min(0, 'Overtime rate cannot be negative.')
    .required('Overtime rate is required.'),
});

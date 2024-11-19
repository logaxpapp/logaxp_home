// src/types/permissions.ts
import { Permission } from './enums';

export const permissionsByCategory: {
  [category: string]: Permission[];
} = {
  'User Management': [
    Permission.READ_USERS,
    Permission.EDIT_USERS,
    Permission.DELETE_USERS,
    // ... other user-related permissions
  ],
  'Role Management': [
    Permission.MANAGE_ROLES,
    // ... other role-related permissions
  ],
  'Settings': [
    Permission.READ_SETTINGS,
    Permission.EDIT_SETTINGS,
    // ... other settings-related permissions
  ],
  // ... other categories
};

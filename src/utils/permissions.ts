// src/utils/permissions.ts

import { UserRole } from '../types/enums';

export interface Permissions {
  canCreateTeam: boolean;
  canEditTeam: boolean;
  canDeleteTeam: boolean;
  canAddMember: boolean;
  canRemoveMember: boolean;
  // Add other permissions as needed
}

export const getPermissions = (role: UserRole): Permissions => {
  switch (role) {
    case UserRole.Admin:
      return {
        canCreateTeam: true,
        canEditTeam: true,
        canDeleteTeam: true,
        canAddMember: true,
        canRemoveMember: true,
      };
    case UserRole.Contractor:
      return {
        canCreateTeam: true,
        canEditTeam: true,
        canDeleteTeam: true,
        canAddMember: true,
        canRemoveMember: true,
      };
    case UserRole.SubContractor:
      return {
        canCreateTeam: false,
        canEditTeam: false,
        canDeleteTeam: false,
        canAddMember: false,
        canRemoveMember: false,
      };
    default:
      return {
        canCreateTeam: false,
        canEditTeam: false,
        canDeleteTeam: false,
        canAddMember: false,
        canRemoveMember: false,
      };
  }
};

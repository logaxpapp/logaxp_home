// src/types/team.ts
import { IUser } from './user';

// Define possible roles as an enum for better type safety
export enum TeamMemberRole {
  Leader = 'Leader',
  Member = 'Member',
  Viewer = 'Viewer',
  // Add other roles as needed
}

// Define the structure of a team member
export interface ITeamMember {
  user: ITeamUser;
  role: TeamMemberRole;
}

// Update ITeamUser if more fields are needed
export type ITeamUser = Pick<IUser, '_id' | 'name' | 'email' | 'profile_picture_url'>;

// Update the ITeam interface
export interface ITeam {
  _id: string;
  name: string;
  description?: string;
  owner: ITeamUser;
  members: ITeamMember[];
  createdAt: string;
  updatedAt: string;
}

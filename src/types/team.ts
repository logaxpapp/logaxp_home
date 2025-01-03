// src/types/team.ts
import { IUser } from './user';

// If you only need _id, name, email for team members:
export type ITeamUser = Pick<IUser, '_id' | 'name' | 'email'>;

export interface ITeam {
  _id: string;
  name: string;
  description?: string;
  owner: ITeamUser;         // Minimally use just { _id, name, email }
  members: ITeamUser[];     // Minimally use just { _id, name, email }
  createdAt: string;
  updatedAt: string;
}

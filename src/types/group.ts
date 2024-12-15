
import { IUserMinimal } from './user';
import { OnlineStatus } from './enums'; 

export interface IGroup {
  _id: string;
  name: string;
  members: IUserMinimal[]; 
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  profile_picture_url?: string;
  onlineStatus?: OnlineStatus; 

}

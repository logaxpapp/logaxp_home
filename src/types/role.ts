import { IPermission } from './permission';

export interface IRole {
  _id: string;
  name: string;
  permissions: IPermission[];
}

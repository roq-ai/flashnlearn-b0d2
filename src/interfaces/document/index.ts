import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface DocumentInterface {
  id?: string;
  file_path: string;
  is_legit: boolean;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface DocumentGetQueryInterface extends GetQueryInterface {
  id?: string;
  file_path?: string;
  user_id?: string;
}

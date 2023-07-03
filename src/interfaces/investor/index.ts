import { FollowInterface } from 'interfaces/follow';
import { InvestmentInterface } from 'interfaces/investment';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface InvestorInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  follow_follow_followed_idToinvestor?: FollowInterface[];
  follow_follow_follower_idToinvestor?: FollowInterface[];
  investment?: InvestmentInterface[];
  user?: UserInterface;
  _count?: {
    follow_follow_followed_idToinvestor?: number;
    follow_follow_follower_idToinvestor?: number;
    investment?: number;
  };
}

export interface InvestorGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}

import { InvestorInterface } from 'interfaces/investor';
import { GetQueryInterface } from 'interfaces';

export interface FollowInterface {
  id?: string;
  follower_id?: string;
  followed_id?: string;
  created_at?: any;
  updated_at?: any;

  investor_follow_follower_idToinvestor?: InvestorInterface;
  investor_follow_followed_idToinvestor?: InvestorInterface;
  _count?: {};
}

export interface FollowGetQueryInterface extends GetQueryInterface {
  id?: string;
  follower_id?: string;
  followed_id?: string;
}

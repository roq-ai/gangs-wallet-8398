import { InvestorInterface } from 'interfaces/investor';
import { GetQueryInterface } from 'interfaces';

export interface InvestmentInterface {
  id?: string;
  cryptocurrency: string;
  amount: number;
  investor_id?: string;
  created_at?: any;
  updated_at?: any;

  investor?: InvestorInterface;
  _count?: {};
}

export interface InvestmentGetQueryInterface extends GetQueryInterface {
  id?: string;
  cryptocurrency?: string;
  investor_id?: string;
}

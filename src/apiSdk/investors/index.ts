import axios from 'axios';
import queryString from 'query-string';
import { InvestorInterface, InvestorGetQueryInterface } from 'interfaces/investor';
import { GetQueryInterface } from '../../interfaces';

export const getInvestors = async (query?: InvestorGetQueryInterface) => {
  const response = await axios.get(`/api/investors${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createInvestor = async (investor: InvestorInterface) => {
  const response = await axios.post('/api/investors', investor);
  return response.data;
};

export const updateInvestorById = async (id: string, investor: InvestorInterface) => {
  const response = await axios.put(`/api/investors/${id}`, investor);
  return response.data;
};

export const getInvestorById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/investors/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteInvestorById = async (id: string) => {
  const response = await axios.delete(`/api/investors/${id}`);
  return response.data;
};

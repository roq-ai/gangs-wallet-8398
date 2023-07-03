import * as yup from 'yup';

export const investmentValidationSchema = yup.object().shape({
  cryptocurrency: yup.string().required(),
  amount: yup.number().integer().required(),
  investor_id: yup.string().nullable(),
});

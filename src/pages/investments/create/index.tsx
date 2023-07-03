import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createInvestment } from 'apiSdk/investments';
import { Error } from 'components/error';
import { investmentValidationSchema } from 'validationSchema/investments';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { InvestorInterface } from 'interfaces/investor';
import { getInvestors } from 'apiSdk/investors';
import { InvestmentInterface } from 'interfaces/investment';

function InvestmentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: InvestmentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createInvestment(values);
      resetForm();
      router.push('/investments');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<InvestmentInterface>({
    initialValues: {
      cryptocurrency: '',
      amount: 0,
      investor_id: (router.query.investor_id as string) ?? null,
    },
    validationSchema: investmentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Investment
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="cryptocurrency" mb="4" isInvalid={!!formik.errors?.cryptocurrency}>
            <FormLabel>Cryptocurrency</FormLabel>
            <Input
              type="text"
              name="cryptocurrency"
              value={formik.values?.cryptocurrency}
              onChange={formik.handleChange}
            />
            {formik.errors.cryptocurrency && <FormErrorMessage>{formik.errors?.cryptocurrency}</FormErrorMessage>}
          </FormControl>
          <FormControl id="amount" mb="4" isInvalid={!!formik.errors?.amount}>
            <FormLabel>Amount</FormLabel>
            <NumberInput
              name="amount"
              value={formik.values?.amount}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.amount && <FormErrorMessage>{formik.errors?.amount}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<InvestorInterface>
            formik={formik}
            name={'investor_id'}
            label={'Select Investor'}
            placeholder={'Select Investor'}
            fetcher={getInvestors}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'investment',
    operation: AccessOperationEnum.CREATE,
  }),
)(InvestmentCreatePage);

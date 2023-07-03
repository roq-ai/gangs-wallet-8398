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
import { createFollow } from 'apiSdk/follows';
import { Error } from 'components/error';
import { followValidationSchema } from 'validationSchema/follows';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { InvestorInterface } from 'interfaces/investor';
import { getInvestors } from 'apiSdk/investors';
import { FollowInterface } from 'interfaces/follow';

function FollowCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: FollowInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createFollow(values);
      resetForm();
      router.push('/follows');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<FollowInterface>({
    initialValues: {
      follower_id: (router.query.follower_id as string) ?? null,
      followed_id: (router.query.followed_id as string) ?? null,
    },
    validationSchema: followValidationSchema,
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
            Create Follow
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <AsyncSelect<InvestorInterface>
            formik={formik}
            name={'follower_id'}
            label={'Select Investor'}
            placeholder={'Select Investor'}
            fetcher={getInvestors}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<InvestorInterface>
            formik={formik}
            name={'followed_id'}
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
    entity: 'follow',
    operation: AccessOperationEnum.CREATE,
  }),
)(FollowCreatePage);

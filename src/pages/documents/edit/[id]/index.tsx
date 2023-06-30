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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getDocumentById, updateDocumentById } from 'apiSdk/documents';
import { Error } from 'components/error';
import { documentValidationSchema } from 'validationSchema/documents';
import { DocumentInterface } from 'interfaces/document';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function DocumentEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<DocumentInterface>(
    () => (id ? `/documents/${id}` : null),
    () => getDocumentById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: DocumentInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateDocumentById(id, values);
      mutate(updated);
      resetForm();
      router.push('/documents');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<DocumentInterface>({
    initialValues: data,
    validationSchema: documentValidationSchema,
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
            Edit Document
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="file_path" mb="4" isInvalid={!!formik.errors?.file_path}>
              <FormLabel>File Path</FormLabel>
              <Input type="text" name="file_path" value={formik.values?.file_path} onChange={formik.handleChange} />
              {formik.errors.file_path && <FormErrorMessage>{formik.errors?.file_path}</FormErrorMessage>}
            </FormControl>
            <FormControl id="is_legit" display="flex" alignItems="center" mb="4" isInvalid={!!formik.errors?.is_legit}>
              <FormLabel htmlFor="switch-is_legit">Is Legit</FormLabel>
              <Switch
                id="switch-is_legit"
                name="is_legit"
                onChange={formik.handleChange}
                value={formik.values?.is_legit ? 1 : 0}
              />
              {formik.errors?.is_legit && <FormErrorMessage>{formik.errors?.is_legit}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
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
    entity: 'document',
    operation: AccessOperationEnum.UPDATE,
  }),
)(DocumentEditPage);

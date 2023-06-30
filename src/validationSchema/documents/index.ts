import * as yup from 'yup';

export const documentValidationSchema = yup.object().shape({
  file_path: yup.string().required(),
  is_legit: yup.boolean().required(),
  user_id: yup.string().nullable(),
});

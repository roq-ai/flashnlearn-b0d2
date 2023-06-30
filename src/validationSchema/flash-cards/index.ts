import * as yup from 'yup';

export const flashCardValidationSchema = yup.object().shape({
  text_content: yup.string().required(),
  user_id: yup.string().nullable(),
});

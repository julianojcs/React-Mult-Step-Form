import { Card, CardContent } from '@material-ui/core';
import { Field, Form, Formik, FormikConfig, FormikValues } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import { mixed, number, object } from 'yup';

export default function Home() {
  return (
    <Card>
      <CardContent>
      <FormikStepper
      validationSchema={object({
        money: mixed().when('millionaire', {
          is: true,
          then: number().required().min(1_000_000, "Becouse you said you are a millionare you need to have 1 million"),
          otherwise: number().required("Please fill out this field")
        })
      })}
          initialValues={{
            firstName: '',
            lastName: '',
            millionaire: false,
            money: 0,
            description: '',
          }}
          onSubmit={() => {}}>
            <Form autoComplete="off">
              <div>
                <Field name="firstName" component={TextField} label="First Name" />
                <Field name="lastName" component={TextField} label="Last Name" />
                <Field name="millionaire" type="checkbox" component={CheckboxWithLabel} Label={{ label: 'I am a millionaire' }} />
              </div>
              <div>
                <Field name="money" type="number" component={TextField} label="All the money I have" />
              </div>
              <div>
                <Field name="description" component={TextField} label="Description" />
              </div>
            </Form>
          </FormikStepper>
      </CardContent>
    </Card>
  );
}

export function FormikStepper({children, ...props}: FormikConfig<FormikValues>) {
  return (
    <Formik {...props} >
      <Form autoComplete="off">{children}</Form>
    </Formik>
  )
}
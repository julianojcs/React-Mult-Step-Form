import { Card, CardContent } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import { mixed, number, object } from 'yup';

export default function Home() {
  return (
    <Card>
      <CardContent>
      <Formik
      validationSchema={object({
        money: mixed().when('millionaire', {
          is: true,
          then: number().required().min(1_000_000, "Money must be greater than or equal to 1.000.000"),
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
              <Field name="firstName" component={TextField} label="First Name" />
              <Field name="lastName" component={TextField} label="Last Name" />
              <Field name="millionaire" type="checkbox" component={CheckboxWithLabel} Label={{ label: 'I am a millionaire' }} />
              <Field name="money" type="number" component={TextField} label="All the money I have" />
              <Field name="description" component={TextField} label="Description" />
            </Form>
          </Formik>
      </CardContent>
    </Card>
  );
}

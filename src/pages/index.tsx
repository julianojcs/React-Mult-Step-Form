import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Step, StepLabel, Stepper } from '@material-ui/core';
import { Field, Form, Formik, FormikConfig, FormikValues } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import { mixed, number, object } from 'yup';

export default function Home() {
  return (
    <Card>
      <CardContent>
        <FormikStepper
          initialValues={{
            firstName: '',
            lastName: '',
            millionaire: false,
            money: 0,
            description: '',
          }}
          onSubmit={() => {}}
        >
          <FormikStep label="Personal Informations">
            <Box paddingBottom={2}>
              <Field fullWidth name="firstName" component={TextField} label="First Name" />
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="lastName" component={TextField} label="Last Name" />
            </Box>
            <Box paddingBottom={2}>
              <Field name="millionaire" type="checkbox" component={CheckboxWithLabel} Label={{ label: 'I am a millionaire' }} />
            </Box>
          </FormikStep>
          <FormikStep
            label="Bank Balance"
            validationSchema={object({
              money: mixed().when('millionaire', {
                is: true,
                then: number().required().min(1_000_000, "Becouse you said you are a millionare you need to have 1 million"),
                otherwise: number().required("Please fill out this field")
              })
            })}
          >
            <Box paddingBottom={2}>
              <Field fullWidth name="money" type="number" component={TextField} label="All the money I have" />
            </Box>
          </FormikStep>
          <FormikStep label="More Info">
          <Box paddingBottom={2}>
            <Field fullWidth name="description" component={TextField} label="Description" />
          </Box>
          </FormikStep>
        </FormikStepper>
      </CardContent>
    </Card>
  );
}

export interface FormikStepProps extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'> {
  label: string
}

export function FormikStep({children}: FormikStepProps) {
  return <>{children}</>
}

export function FormikStepper({ children, ...props }: FormikConfig<FormikValues>) {
  const childrenArray = React.Children.toArray(children) as React.ReactElement<FormikStepProps>[];
  const [step, setStep] = useState(0)
  const currentChild = childrenArray[step] as React.ReactElement<FormikStepProps>
  // console.log('children', currentChild);

  const isLastStep = () => {
    return (step === childrenArray.length-1)
  }

  const handleSubmit = async (values, helpers) => {
    if ( isLastStep() ) {
      await props.onSubmit(values, helpers)
    } else {
      setStep(step+1)
    }
  }

  return (
    <Formik 
      {...props} 
      validationSchema={currentChild.props.validationSchema}
      onSubmit={(values, helpers) => handleSubmit(values, helpers)}>

      <Form autoComplete="off">
        <Stepper alternativeLabel activeStep={step}>
          {childrenArray.map((child) => (
            <Step key={child.props.label}>
              <StepLabel>{child.props.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {currentChild}
        
        {step > 0 ? (<Button variant="contained" color="primary" onClick={() => setStep(step-1)}>Back</Button>) : null}
        <Button variant="contained" color="primary" type="submit">{isLastStep() ? 'Submit' : 'Next'}</Button>
      </Form>
    </Formik>
  )
}
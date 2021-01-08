import React, { useState } from 'react';
import { Box, Button, Card, CardContent, CircularProgress, Grid, Step, StepLabel, Stepper } from '@material-ui/core';
import { Field, Form, Formik, FormikConfig, FormikValues } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import { mixed, number, object } from 'yup';

const sleep = (time) => new Promise((accepted) => setTimeout(accepted, time))

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
          onSubmit={async (values) => {
            await sleep(3000)
            console.log('values: ', values);
          }}
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
  return (
    <>
      {children}
    </>
  )
}

export function FormikStepper({ children, ...props }: FormikConfig<FormikValues>) {
  const childrenArray = React.Children.toArray(children) as React.ReactElement<FormikStepProps>[];
  const [step, setStep] = useState(0)
  const [completed, setCompleted] = useState(false)
  const currentChild = childrenArray[step] as React.ReactElement<FormikStepProps>
  // console.log('children', currentChild);

  const isLastStep = () => {
    return (step === childrenArray.length-1)
  }

  const handleSubmit = async (values, helpers) => {
    if ( isLastStep() ) {
      await props.onSubmit(values, helpers)
      setCompleted(true)
      // //Clear the form
      // helpers.resetForm() 
      // //Reset Steps
      // setStep(0)
    } else {
      // setStep(step+1)
      setStep((s) => s + 1)
      // If you have multiple fields on the same step
      // we will see they show the validation error all at the same time after the first step!
      //
      // If you want to keep that behaviour, then, comment the next line :)
      // If you want the second/third/fourth/etc steps with the same behaviour
      //    as the first step regarding validation errors, then the next line is for you! =)      
      helpers.setTouched({});
    }
  }

  return (
    <Formik 
      {...props} 
      validationSchema={currentChild.props.validationSchema}
      onSubmit={(values, helpers) => handleSubmit(values, helpers)}>

      {({ isSubmitting }) => (
        <Form autoComplete="off">
          <Stepper alternativeLabel activeStep={step}>
            {childrenArray.map((child, index) => (
              <Step key={child.props.label} completed={step > index || completed}>
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {currentChild}
          <Grid container spacing={2}>
          {(step > 0 && !completed) ? (
            <Grid item>
              <Button disabled={isSubmitting || completed} variant="contained" color="primary" onClick={() => setStep(step-1)}>Back</Button>
            </Grid>
          ) : null}
            <Grid item>
              <Button startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null} disabled={isSubmitting || completed} variant="contained" color="primary" type="submit">{isSubmitting ? 'Submitting...' : (isLastStep() ? (completed? 'Submited' : 'Submit' ) : 'Next')}</Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  )
}
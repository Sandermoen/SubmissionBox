import React, { Fragment } from 'react';
import { Formik, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

import { login, selectStatus } from './authSlice';
import { RootState } from '../../app/rootReducer';

import {
  LoginTitle,
  StyledForm,
  SignUpCTA,
  HighlightedLink,
  ForgotPassword,
} from './LoginForm.styles';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Label from '../../components/Label/Label';
import Notification from '../../components/Notification/Notification';
import FormGroup from '../../components/Form/FormGroup/FormGroup';
import LabelGroup from '../../components/Form/LabelGroup/LabelGroup';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const loginStatus = useSelector((state: RootState) => selectStatus(state));
  const loginError = useSelector((state: RootState) => state.auth.error);

  const loginPending = loginStatus === 'pending';
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={Yup.object({
        email: Yup.string()
          .email('Invalid email address.')
          .required('Email is a required field.'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters.')
          .required('Password is a required field.'),
      })}
      onSubmit={(values) => {
        dispatch(login(values));
      }}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ errors }) => (
        <Fragment>
          {Object.values(errors).length > 0 ? (
            <Notification type="rejected">
              {Object.values(errors).map((error) => (
                <p key={error}>{error}</p>
              ))}
            </Notification>
          ) : (
            loginError && (
              <Notification type="rejected">
                <p>{loginError}</p>
              </Notification>
            )
          )}
          <LoginTitle>Log in</LoginTitle>
          <StyledForm data-testid="login-form">
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Field
                name="email"
                type="email"
                id="email"
                highlight={errors.email || loginError}
                component={Input}
                disabled={loginPending}
              />
            </FormGroup>

            <FormGroup>
              <LabelGroup>
                <Label htmlFor="password">Password</Label>
                <ForgotPassword to="/recover">Forgot password?</ForgotPassword>
              </LabelGroup>
              <Field
                name="password"
                id="password"
                type="password"
                highlight={errors.password || loginError}
                component={Input}
                disabled={loginPending}
              />
            </FormGroup>

            <FormGroup>
              <Button
                color="orange"
                loading={loginPending}
                disabled={loginPending}
              >
                Log in
              </Button>
            </FormGroup>
            <SignUpCTA>
              Don&apos;t have an account?{' '}
              <HighlightedLink to="/signup">Sign up</HighlightedLink>
            </SignUpCTA>
          </StyledForm>
        </Fragment>
      )}
    </Formik>
  );
};

export default LoginForm;

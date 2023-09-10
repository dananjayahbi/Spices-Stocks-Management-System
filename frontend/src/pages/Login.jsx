import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const Login = () => {
  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const isLogged = window.localStorage.getItem("LoggedIn");
  console.log(isLogged);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await axios.post('http://localhost:8070/users/login', values);
      // Handle successful login
      console.log('Login successful', response.data);
      window.localStorage.setItem("token", response.data);
      window.localStorage.setItem("LoggedIn", true);
      window.location.href = "/";
    } catch (error) {
      // Handle login error
      console.error('Login failed', error);
      setFieldError('password', 'Invalid username or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <label htmlFor="username">Username</label>
            <Field type="text" id="username" name="username" />
            <ErrorMessage name="username" component="div" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Field type="password" id="password" name="password" />
            <ErrorMessage name="password" component="div" />
          </div>
          <div>
            <button type="submit" disabled={isSubmitting}>
              Login
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Login;

import React from 'react'
import { Form, Formik } from "formik";
import { Box, Button } from '@chakra-ui/core';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useMutation } from 'urql';

interface registerProps {

}
const REGISTER_MUTATION = `
mutation REGISTER($username: String!, $password: String!){
  register(options:{username: $username, password: $password}){
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}`;
const Register: React.FC<registerProps> = ({ }) => {
  const [_, register] = useMutation(REGISTER_MUTATION);
  return (
    <Wrapper variant="small">
      <Formik initialValues={{ username: "", password: "" }} onSubmit={(values) => {
        return register(values)
      }}>
        {({ isSubmitting }) => (
          <Form>
            <InputField name="username" placeholder="Username" label="username" />
            <Box mt={4}>
              <InputField name="password" placeholder="Password" label="password" type="password" />
            </Box>
            <Button mt={4} type="submit" variantColor="teal" isLoading={isSubmitting}>Register</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default Register;
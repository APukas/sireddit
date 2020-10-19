import React from 'react'
import { Form, Formik } from "formik";
import { Box, Button } from '@chakra-ui/core';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';

interface registerProps {

}

const Register: React.FC<registerProps> = ({ }) => {
  const [_, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik initialValues={{ username: "", password: "" }} onSubmit={async (values) => {
        const response = await register(values)
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
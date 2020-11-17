import React from 'react'
import { Form, Formik } from "formik";
import { Box, Button } from '@chakra-ui/core';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from "next/router";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
interface registerProps {

}

const Register: React.FC<registerProps> = ({ }) => {
  const router = useRouter();
  const [_, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik initialValues={{ username: "", password: "" }} onSubmit={async (values, { setErrors }) => {
        const response = await register(values)
        if (response.data?.register.errors) {
          setErrors(toErrorMap(response.data.register.errors))
        } else if (response.data?.register.user) {
          // worked
          router.push("/");
        }
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

export default withUrqlClient(createUrqlClient)(Register);
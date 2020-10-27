import React from 'react'
import { Form, Formik } from "formik";
import { Box, Button } from '@chakra-ui/core';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from "next/router";

interface loginProps {

}

const Login: React.FC<loginProps> = ({ }) => {
    const router = useRouter();
    const [_, login] = useLoginMutation();
    return (
        <Wrapper variant="small">
            <Formik initialValues={{ username: "", password: "" }} onSubmit={async (values, { setErrors }) => {
                const response = await login(values)
                console.log({ response });
                if (response.data?.login.errors) {
                    setErrors(toErrorMap(response.data.login.errors))
                } else if (response.data?.login.user) {
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
                        <Button mt={4} type="submit" variantColor="teal" isLoading={isSubmitting}>Login</Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default Login;
import React from 'react'
import NextLink from "next/link";
import { Box, Button, Flex, Link } from '@chakra-ui/core';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
    const [{ data, fetching: isMeFetching }] = useMeQuery({
        pause: isServer()
    });
    const [{ fetching: isLogoutFetching }, logout] = useLogoutMutation();
    let body = null;
    if (isMeFetching) {
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href="/login">
                    <Link color="white" mr="2">Login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link color="white">Register</Link>
                </NextLink>
            </>
        )
    } else {
        body = (<Flex alignItems="baseline">
            <Box mr="2">{data.me.username}</Box>
            <Button variant="link" onClick={() => {
                logout();
            }} isLoading={isLogoutFetching}>Logout</Button>
        </Flex>);
    }
    return (
        <Flex bg="tomato" p="4">
            <Box ml="auto">
                {body}
            </Box>
        </Flex>
    );
}
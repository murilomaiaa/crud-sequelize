import { Box, Flex, FlexProps, Img, Text } from '@chakra-ui/react'
import { useAuth } from '../hooks/auth'

// import logo from '../assets/logo.png'

export function Header(props: FlexProps) {
  const { user } = useAuth()
  return (
    <Flex
      as="nav"
      background="gray.50"
      paddingY="4"
      marginX="auto"
      boxShadow="0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);"
      marginBottom="4"
      overflow="hidden"
      placeContent="center"
      // w="100vw"
      {...props}
    >
      <Flex>
        <Box display="flex" flexDir="column">
          <Text fontSize="sm">Olá,</Text>
          <Text fontWeight="500">{user?.name}</Text>
        </Box>
      </Flex>
    </Flex >
  )
}

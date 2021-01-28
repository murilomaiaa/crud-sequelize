import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from '../hooks/auth'
import { UsersProvider } from '../hooks/users'

const MyApp = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <UsersProvider>
          <Component {...pageProps} />
        </UsersProvider>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default MyApp

import { Box, Button, Container, Heading, Icon, Link, useToast } from "@chakra-ui/react"
import { Input } from "../components"
import { Form } from '@unform/web'
import { useCallback, useRef } from "react"
import { FiLogIn } from 'react-icons/fi'
import { FormHandles } from "@unform/core"
import * as Yup from 'yup'
import getValidationErrors from "../utils/getValidationErrors"
import { useAuth } from "../hooks/auth"
import { useRouter } from "next/router"
import { GetServerSideProps, NextPage } from "next"
import parseCookies from "../utils/parseCookies"

type FormData = {
  email: string
  password: string
}

const Home: NextPage = () => {
  const formRef = useRef<FormHandles>(null)
  const toast = useToast()
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = useCallback(async (data: FormData) => {
    try {
      formRef.current.setErrors({})
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('Informe um email')
          .email('Informe um email válido'),
        password: Yup.string().required('Informe uma senha')
      })

      await schema.validate(data, { abortEarly: false })

      await signIn({
        email: data.email,
        password: data.password
      })

      router.push('/dashboard')
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)
        console.log({ errors })
        formRef.current?.setErrors(errors)
      } else {
        toast({
          title: 'Ocorreu um erro ao fazer login',
          status: 'error',
          description: err.message
        })
      }
    }

  }, [signIn])

  return (
    <Container>
      <Box
        mt={14}
        mx="auto"
        maxW="408px"
        border="1px solid rgb(221,221,221)"
        boxShadow="rgba(0,0,0,0.22) 0px 3px 6px"
        p={4}
      >
        <Form onSubmit={handleSubmit} ref={formRef} initialData={{}}>
          <Heading mb={6}>Login</Heading>
          <Input label="Email" formControlProps={{ mb: 4 }} placeholder="E-mail" name='email' />
          <Input label="Senha" formControlProps={{ mb: 4 }} placeholder="Senha" name='password' type='password' />
          <Button type="submit" w="100%" colorScheme="blue" mb={4}>Login</Button>
          <Link href="/register" color="blue.400">
            <Icon as={FiLogIn} /> Criar conta
          </Link>
        </Form>
      </Box>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const { user } = parseCookies(req)
  if (res) {
    if (user) {
      res.writeHead(300, 'User already logged', { Location: '/dashboard' })
      res.end()
    }
  }

  return {
    props: {}
  }
}

export default Home

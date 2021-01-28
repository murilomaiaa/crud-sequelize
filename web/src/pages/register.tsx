import { Box, Button, Container, Flex, Heading, Link, useToast } from "@chakra-ui/react"
import { Input } from "../components"
import { Form } from '@unform/web'
import { useCallback, useRef } from "react"
import { FormHandles } from "@unform/core"
import * as Yup from 'yup'
import getValidationErrors from "../utils/getValidationErrors"
import api from '../services/api'
import { useRouter } from 'next/router'

type FormData = {
  name: string
  birthday: Date
  email: string
  city: string
  state: string
  password: string
  repeatPassword: string
}

const Home = () => {
  const formRef = useRef<FormHandles>(null)
  const toast = useToast()
  const router = useRouter()

  const handleSubmit = useCallback(async (data: FormData) => {
    try {
      formRef.current.setErrors({})
      const schema = Yup.object().shape({
        name: Yup.string().required("Informe um nome"),
        birthday: Yup.date()
          .nullable()
          .required('Informe uma data')
          .transform((curr, orig) => orig === '' ? null : curr)
          .max(new Date(), 'A pessoa precisa ter nascido'),
        email: Yup.string()
          .required('Informe um email')
          .email('Informe um email válido'),
        state: Yup.string().required("Informe um estado"),
        city: Yup.string().required("Informe uma cidade"),
        password: Yup.string().min(
          6,
          'A senha deve conter no mínimo 6 caracteres'
        ),
        repeatPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'As senhas não coincidem')
          .required('As senhas não coincidem')
      })

      await schema.validate(data, { abortEarly: false })

      const { name, email, birthday, city, state, password } = data

      await api.post('/users', {
        name,
        email,
        birthday,
        city,
        state,
        password
      })

      toast({
        title: 'Usuário cadastrado com sucesso',
        status: 'success',
        description: 'Faça seu login em instantes',
        isClosable: true,
        onCloseComplete: () => router.push('/login')
      })
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)
        console.log({ errors })
        formRef.current?.setErrors(errors)
      }
      else if (err.isAxiosError) {
        const { message } = err.response.data
        if (message === 'Email address already used') {
          formRef.current?.setErrors({ email: 'Email já cadastrado' })
        }
      } else {
        toast({
          title: 'Ocorreu um erro ao fazer login',
          status: 'error',
          description: err.message
        })
      }
    }

  }, [])

  return (
    <Container>
      <Box
        my={14}
        mx="auto"
        maxW="504px"
        border="1px solid rgb(221,221,221)"
        boxShadow="rgba(0,0,0,0.22) 0px 3px 6px"
        p={4}
        as="main"
      >
        <Form onSubmit={handleSubmit} ref={formRef} initialData={{}}>
          <Heading mb={6}>Registre se</Heading>
          <Input formControlProps={{ mb: 4 }} label="Nome" name="name" />
          <Input formControlProps={{ mb: 4 }} label="Data de nascimento" name="birthday" type="date" />
          <Input formControlProps={{ mb: 4 }} label="E-mail" name="email" />

          <Flex>
            <Box pr={2}>
              <Input formControlProps={{ mb: 4 }} label="Cidade" name="city" />
            </Box>
            <Box pl={2}>
              <Input formControlProps={{ mb: 4 }} label="Estado" name="state" />
            </Box>
          </Flex>

          <Input formControlProps={{ mb: 4 }} label="Senha" name="password" type="password" />
          <Input formControlProps={{ mb: 4 }} label="Repita a senha" name="repeatPassword" type="password" />
          <Button type="submit" w="100%" colorScheme="blue" mb={4}>Registrar</Button>
          <Link href="/" color="blue.400">Fazer login</Link>
        </Form>
      </Box>
    </Container>
  )
}


export default Home

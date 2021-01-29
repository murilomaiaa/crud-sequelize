import {
  Button,
  Drawer as CDrawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps
} from '@chakra-ui/react'
import { MdSearch } from 'react-icons/md'
import { Form } from '@unform/web'
import { useCallback, useRef, useState } from 'react'
import { Input } from './Input'
import * as Yup from 'yup'
import { FormHandles } from '@unform/core'
import getValidationErrors from '../utils/getValidationErrors'
import api from '../services/api'

import queryString, { ParsedUrlQueryInput } from 'querystring'
import { useAuth } from '../hooks/auth'
import { useUsers } from '../hooks/users'

interface IFormData {
  id?: string
  email?: string;
  name?: string;
  birthday?: Date;
  city?: string;
  state?: string;
}

type User = {
  id: number
  name: string
  email: string
  birthday: string
  image: string
  city: string
  state: string
}

type Props = Omit<DrawerProps, 'children'>

const Drawer: React.FC<Props> = ({
  isOpen,
  onClose,
  finalFocusRef,
}) => {
  const formRef = useRef<FormHandles>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { token } = useAuth()
  const { setUsers } = useUsers()

  const handleSubmitDrawer = useCallback(async (data: IFormData) => {
    try {
      setIsLoading(true)
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        id: Yup.string(),
        email: Yup.string().email(),
        name: Yup.string(),
        birthday: Yup.date()
          .nullable()
          .transform((curr, orig) => orig === '' ? null : curr)
          .max(new Date(), 'Informe ums data de nascimento válida'),
        city: Yup.string(),
        state: Yup.string(),
      })

      await schema.validate(data, { abortEarly: false });

      const { birthday, city, email, id, name, state } = data

      let queryParams: Record<string, unknown> = {}
      if (id) {
        queryParams.id = id
      } else {
        if (birthday) queryParams.birthday = birthday
        if (city) queryParams.city = city
        if (state) queryParams.state = state
        if (name) queryParams.name = name
        if (email) queryParams.email = email
      }

      const query = queryString.stringify(queryParams as ParsedUrlQueryInput)

      const { data: apiResponse } = await api.get<User[]>('/users?' + query, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setUsers([...apiResponse])

      onClose()
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);

        formRef.current?.setErrors(errors);
      }
    } finally {
      setIsLoading(false)
    }
  }, [token, setIsLoading])

  return (
    <CDrawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={finalFocusRef}
    >
      <DrawerOverlay>
        <DrawerContent>
          <DrawerHeader>
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody>
            <Form
              noValidate
              ref={formRef}
              onSubmit={handleSubmitDrawer}
            >
              <Input name="id" type="text" label="Id" mb={4} />

              <Input name="email" type="text" label="Email" mb={4} />
              <Input name="name" type="text" label="Nome" mb={4} />
              <Input name="birthday" type="date" label="Aniversário" mb={4} />
              <Input name="city" type="text" label="Cidade" mb={4} />
              <Input name="state" type="text" label="Estado" mb={4} />

              <Button
                rightIcon={<MdSearch />}
                colorScheme="green"
                type="submit"
                w={{ base: '100%' }}
                mb="64px"
                isLoading={isLoading}
              >
                Filtrar
              </Button>
            </Form>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </CDrawer>
  )
}

export default Drawer

import { AlertDialogProps, AlertDialog, AlertDialogOverlay, AlertDialogHeader, AlertDialogBody, Button, AlertDialogContent, Input as CInput, Flex, Text, Img, Box, Tabs, TabList, TabPanels, TabPanel, Tab, CloseButton, useToast, Icon } from "@chakra-ui/react";
import { Form } from "@unform/web";
import { differenceInYears, format } from "date-fns";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Input } from "./Input";
import * as Yup from 'yup'
import { FormHandles } from "@unform/core";
import api from "../services/api";
import getValidationErrors from "../utils/getValidationErrors";
import { useRouter } from "next/router";
import { useAuth } from '../hooks/auth'
import { useUsers } from "../hooks/users";
import { FiCamera } from 'react-icons/fi'

type User = {
  id: number
  name: string
  email: string
  birthday: string
  image: string
  city: string
  state: string
}

type Props = Omit<AlertDialogProps, 'leastDestructiveRef' | 'children'> & {
  selectedUser: User
}

type FormData = {
  name: string
  email: string
  birthday: string
  city: string
  state: string
}

export default function UserModal({ isOpen, onClose, selectedUser, ...rest }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [userImage, setUserImage] = useState('')
  const cancelRef = useRef()
  const formRef = useRef<FormHandles>()
  const toast = useToast()
  const router = useRouter()
  const { token, user, signOut, updateUser } = useAuth()
  const { users, setUsers } = useUsers()

  useEffect(() => {
    setUserImage(selectedUser.image)
  }, [selectedUser.image])

  const handleUpdateUser = useCallback(async (data: FormData) => {
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
      })

      await schema.validate(data, { abortEarly: false })

      const { name, email, birthday, city, state } = data

      await api.put('/users', {
        id: selectedUser.id,
        email,
        name,
        birthday: format(new Date(birthday), 'yyyy-MM-dd'),
        city,
        state,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      toast({
        title: 'Usuário alterado com sucesso',
        status: 'success',
        isClosable: true,
      })

      const findUserIndex = users.findIndex(u => u.id === selectedUser.id)
      users.splice(findUserIndex, 1, {
        ...selectedUser,
        name,
        email,
        birthday,
        city,
        state,
      })

      if (selectedUser.id === user.id) {
        updateUser({
          ...selectedUser,
          name,
          email,
          birthday,
          city,
          state,
        });
      }

      setUsers([...users])
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)
        formRef.current?.setErrors(errors)
      } else if (err.isAxiosError) {
        const e = err.toJson ? err.toJson() : { err }
        console.log(e)
        const message = err.response?.data?.message
        if (message === 'Email address already used') {
          formRef.current?.setErrors({ email: 'Email já cadastrado' })
        }
      } else {
        const e = err.toJson ? err.toJson() : { err }
        console.log(e)

        toast({
          title: 'Ocorreu um erro ao fazer login',
          status: 'error',
          description: err.message
        })
      }
    }
  }, [formRef, token, updateUser, selectedUser])

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append(`avatar`, e.target.files[0]);

        const { id } = selectedUser

        api.patch('/users/' + id + '/avatar', data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(response => {

          toast({
            status: 'success',
            title: 'Avatar atualizado!',
            isClosable: true
          });

          selectedUser.image = response.data.image

          const findUserIndex = users.findIndex(u => u.id === selectedUser.id)
          users.splice(findUserIndex, 1, {
            ...selectedUser,
            image: response.data.image
          })

          if (selectedUser.id === user.id) {
            updateUser({
              ...selectedUser,
              image: response.data.image
            });
          }
          setUsers([...users])
        });
      }
    },
    [toast, selectedUser],
  );

  const handleDeleteUser = useCallback(async (id: number) => {
    try {
      setIsLoading(true)
      await api.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (id === user.id) {
        signOut()
        router.push('/login')
      }

      setUsers(users.filter(u => u.id !== selectedUser.id))
      onClose()
    } catch (err) {
      const e = err.toJson ? err.toJson() : { err }
      console.log(e)

      toast({
        title: 'Erro ao excluir usuário',
        status: 'error',
        description: 'Ocorreu um erro durante a exclusão do usuário'
      })
    } finally {
      setIsLoading(false)
    }
  }, [token, selectedUser])

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      {...rest}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold" display="flex" justifyContent="space-between">
            <Text>Dados do usuário {selectedUser.name}</Text>
            <CloseButton onClick={onClose} />
          </AlertDialogHeader>
          <AlertDialogBody>
            <Tabs isLazy>
              <TabList>
                <Tab>Vizualizar</Tab>
                <Tab>Editar</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Flex justifyContent="center">
                    <Box mb={8} position="relative">
                      <Img
                        src={userImage}
                        alt={selectedUser.name}
                        h="176px"
                        w="176px"
                        borderRadius="50%"
                      />
                      <Box
                        as="label"
                        htmlFor="avatar"
                        position="absolute"
                        width="48px"
                        height="48px"
                        background="blue.400"
                        borderRadius="50%"
                        right={0}
                        bottom={0}
                        border={0}
                        cursor="pointer"
                        transition="background-color 0.2s"
                        placeItems="center"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FiCamera} alignSelf="center" />
                        <CInput
                          type="file"
                          name="avatar"
                          id="avatar"
                          onChange={handleAvatarChange}
                          display="none"
                        />
                      </Box>
                    </Box>
                  </Flex>
                  <Flex lineHeight="26px">
                    <Flex flexDirection="column">
                      <Text fontSize="14px" fontWeight={600} color="#333">Nome</Text>
                      <Text fontSize="14px" fontWeight={600} color="#333">Email</Text>
                      <Text fontSize="14px" fontWeight={600} color="#333">Idade</Text>
                      <Text fontSize="14px" fontWeight={600} color="#333">Localização</Text>
                    </Flex>
                    <Flex pl={2} flexDirection="column">
                      <Text >{selectedUser.name}</Text>
                      <Text >{selectedUser.email}</Text>
                      <Text >{differenceInYears(new Date(), new Date(selectedUser.birthday))}</Text>
                      <Text >{`${selectedUser.city}/${selectedUser.state}`}</Text>
                    </Flex>
                  </Flex>
                  <Flex mb={4} justifyContent="space-between">
                    <Button isLoading={isLoading} size="sm" variant="outline" mr={1} colorScheme="red" onClick={() => handleDeleteUser(selectedUser.id)}>Excluir</Button>
                    <Button isLoading={isLoading} size="sm" ref={cancelRef} onClick={onClose}>
                      Fechar
                      </Button>
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex justifyContent="center">
                    <Img
                      src={selectedUser.image || '/default-user.png'}
                      alt={selectedUser.name}
                      h={50}
                      w={50}
                      borderRadius="50%"
                    />
                  </Flex>
                  <Form onSubmit={handleUpdateUser} ref={formRef} initialData={selectedUser}>
                    <Input formControlProps={{ mb: 4 }} label="Nome" name="name" />
                    <Input
                      formControlProps={{ mb: 4 }}
                      label="Data de nascimento"
                      name="birthday"
                      type="date"
                      defaultValue={new Date(selectedUser.birthday).toISOString().substr(0, 10)}
                    />
                    <Input formControlProps={{ mb: 4 }} label="E-mail" name="email" />
                    <Input formControlProps={{ mb: 4 }} label="Cidade" name="city" />
                    <Input formControlProps={{ mb: 4 }} label="Estado" name="state" />
                    <Flex mb={4} justifyContent="space-between">
                      <Button type="submit" colorScheme="green" size="sm" isLoading={isLoading}>Salvar</Button>
                      <Button isLoading={isLoading} size="sm" ref={cancelRef} onClick={onClose}>
                        Fechar
                      </Button>
                    </Flex>
                  </Form>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

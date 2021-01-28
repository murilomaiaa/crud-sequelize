import { Container, Table, Thead, Tr, Th, Tbody, Img, Heading } from "@chakra-ui/react"
import { format } from "date-fns"
import { GetServerSideProps } from "next"
import { useCallback, useEffect, useState } from "react"
import { Header } from "../components"
import api from "../services/api"
import parseCookies from "../utils/parseCookies"

import dynamic from 'next/dynamic'
import { useUsers } from "../hooks/users"
const UserModal = dynamic(
  () => import('../components/UserModal'),
  {
    ssr: false
  }
)

type User = {
  id: number
  name: string
  email: string
  birthday: string
  image: string
  city: string
  state: string
}

type Props = {
  users: User[]
}

const Dashboard = ({ users: usersProp }: Props) => {
  const [selectedUser, setSelectedUser] = useState<User>({} as User)
  const [isOpen, setIsOpen] = useState(false)
  const [modalIsRendered, setModalIsRendered] = useState(false)

  const { setUsers, users } = useUsers()

  useEffect(() => {
    setUsers([...usersProp])
  }, [usersProp])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const handleClickUser = useCallback((user: User) => {
    setSelectedUser(user)
    setModalIsRendered(true)
    setIsOpen(true)
  }, [])

  return (
    <>
      <Header />
      <Container as="main" maxW="1280px">
        <Heading size="lg" margin=" 24px 5px">Usuários</Heading>
        <Table colorScheme="blue" size="md">
          <Thead>
            <Tr>
              <Th></Th>
              <Th>Nome</Th>
              <Th>Email</Th>
              <Th>Aniversário</Th>
              <Th>Cidade</Th>
              <Th>Estado</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map(user => (
              <Tr
                key={`user-${user.id}`}
                onClick={() => handleClickUser(user)}
                _hover={{ background: 'blue.300', cursor: 'pointer' }}
              >
                <Th>
                  <Img
                    src={user.image || '/default-user.png'}
                    alt={user.name}
                    h={50}
                    w={50}
                    borderRadius="50%"
                  />
                </Th>
                <Th>{user.name}</Th>
                <Th>{user.email}</Th>
                <Th>{format(new Date(user.birthday), 'dd/MM/yyyy')}</Th>
                <Th>{user.city}</Th>
                <Th>{user.state}</Th>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Container>
      {modalIsRendered && (
        <UserModal isOpen={isOpen} onClose={onClose} selectedUser={selectedUser} />
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  try {
    const { token } = parseCookies(req)
    let data
    if (res) {
      const response = await api.get<User[]>('/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      data = response.data
    }

    return {
      props: {
        users: data
      }
    }
  } catch (e) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }


}

export default Dashboard;

import { createContext, useState, useContext } from 'react'

type User = {
  id: number
  name: string
  email: string
  birthday: string
  image: string
  city: string
  state: string
}

type UsersState = Array<User>

interface UsersContextData {
  users: UsersState
  setUsers: (guest: UsersState) => void
}

const UsersContext = createContext<UsersContextData>({} as UsersContextData)

const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState<UsersState>([])

  return (
    <UsersContext.Provider
      value={{
        users,
        setUsers,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

const useUsers = () => {
  const context = useContext(UsersContext)

  if (!context) throw new Error("useGuests must be wrapped by a GuestsContext.Provider")

  return context
}

export { UsersProvider, useUsers }

import { NextPage } from 'next'

const Index: NextPage = () => <></>

Index.getInitialProps = async ({ res }) => {
  if (res) {
    res.writeHead(302, { Location: '/login' })
    res.end()
  }
}

export default Index

import { AppProps } from 'next/app'

const MyApp = ({ Component, pageProps }) => {
  return (
    <Component {...pageProps} />
  )
}

export default MyApp

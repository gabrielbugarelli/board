import { AppProps } from 'next/app';
import { Header } from '../components/Header';
import { Provider as NextAuthProvider } from 'next-auth/client';
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import '../styles/global.scss';

const initialProvider = {
  'client-id': 'AfGHPA5hrAKcF5umUcPQ-Wg7C-oFD847UZfh7wkQ2Xy8Pj-7FBhrguD-rFnUdwFXS3ld3hZIwDT2UGi-',
  currency: 'BRL',
  intent: 'capture'
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session} >
      <PayPalScriptProvider options={initialProvider}>
        <Header/>
        <Component {...pageProps} />
      </PayPalScriptProvider>
    </NextAuthProvider>
  )
}

export default MyApp

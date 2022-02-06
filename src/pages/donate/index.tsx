import styles from './styles.module.scss';
import Head from 'next/head';
import firebase from '../../services/firebaseConnection';

import { PayPalButtons, OnApproveBraintreeActions, CreateOrderBraintreeActions } from '@paypal/react-paypal-js' 
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { useState } from 'react';

type DonateProps = {
  user: {
    id: string
    name: string
    image: string
  }
}

const Donate = ({ user }: DonateProps) => {

  const [ userVip, setUserVip ] = useState<boolean>(false);

  const handleSaveDonante = async () => {
    await firebase.firestore().collection('users')
    .doc(user.id)
    .set({
      donate: true,
      lastDonate: new Date(),
      image: user.image,
    })

    .then(() => {
      setUserVip(true);
    })
  }

  /**
   * @description método responsável por efetuar o 
   * pagamento da plataforma.
   */
  const onCreateOrderPaypal = async (data: Record<string, unknown>, actions: CreateOrderBraintreeActions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: '5'
        }
      }],
    })
  }

  /**
   * @description método responsável por
   * validar o pagamento via Paypal
   */
  const onApproveOrderPaypal = async (data: Record<string, unknown>, actions: OnApproveBraintreeActions) => {
    return actions.order.capture().then((details) => {
      handleSaveDonante()
    })
  }

  return (
    <>
      <Head>
        <title>Colabore com o projeto</title>
      </Head>
      
      <main className={styles.container}>
        <img src="/images/rocket.svg" alt="Seja um apoiador e colabore com o projeto Taskido" />

        {userVip && (
          <div className={styles.vip}>
            <img src={user.image} alt="Foto de perfil do usuário" />
            <span> Obrigado {user.name}, você apoiou o projeto Taskido! 😄🎉</span>
          </div>
        )}

        <h1>
          Seja um apoiador e colabore com o projeto Taskido 🏆
        </h1>

        <strong>Apareça na nossa página inicial e obtenha funcionalidades exclusivas.</strong>

        <PayPalButtons 
          createOrder={(data, actions: CreateOrderBraintreeActions) => onCreateOrderPaypal(data, actions)} 
          onApprove={(data, actions: OnApproveBraintreeActions) => onApproveOrderPaypal(data, actions)}  
        />
      </main>
    </>
  )
}

export default Donate;

/**
 * SERVER SIDE RENDERING
 */
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if(!session?.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const user = {
    id: session?.id,
    name: session?.user.name,
    image: session?.user.image
  }

  return {
    props: {
      user
    }
  }
} 
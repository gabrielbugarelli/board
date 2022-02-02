import styles from './styles.module.scss';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';

type DonateProps = {
  user: {
    id: string
    name: string
    image: string
  }
}

const Donate = ({ user }: DonateProps) => {

  return (
    <>
      <Head>
        <title>Colabore com o projeto</title>
      </Head>
      
      <main className={styles.container}>
        <img src="/images/rocket.svg" alt="Seja um apoiador e colabore com o projeto Taskdo" />

        <div className={styles.vip}>
          <img src={user.image} alt="Foto de perfil do usuário" />
          <span> Parabéns {user.name}, você apoiou o projeto Taskdo! 😄🎉</span>
        </div>

        <h1>
          Seja um apoiador e colabore com o projeto Taskdo 🏆
        </h1>

        <strong>Apareça na nossa página inicial e obtenha funcionalidades exclusivas.</strong>
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
import styles from './styles.module.scss';
import Head from 'next/head';

const Donate = () => {
  return (
    <>
      <Head>
        <title>Colabore com o projeto</title>
      </Head>
      
      <main className={styles.container}>
        <img src="/images/rocket.svg" alt="Seja um apoiador e colabore com o projeto Taskdo" />

        <div className={styles.vip}>
          <img src="https://avatars.githubusercontent.com/u/47955200?v=4" alt="Avatar de usuário" />
          <span> Parabéns, você é o nosso mais novo apoiador! 😄🎉</span>
        </div>

        <h1>
          Seja um apoiador e colabore com o projeto Taskdo 🏆
        </h1>

        <strong>Apareça na nossa home e obtenha funcionalidades exclusivas.</strong>
      </main>
    </>
  )
}

export default Donate;
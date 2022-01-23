import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock } from 'react-icons/fi';
import { SupportButton } from '../../components/SupportButton';
import styles from './styles.module.scss';

const TaskBoard = () => {
  return (
    <>
      <Head>
        <title>Minhas tarefas - TaskBoard</title>
      </Head>

      <main className={styles.container}>
        <form>
          <input 
            type="text"
            autoFocus
            placeholder='o que pretende fazer hoje?'
          />

          <button type="submit">
            <FiPlus size={25} color="#17181f"/>
          </button>
        </form>

        <h1>Você tem 2 tarefas!</h1>

        <section>
          <article className={styles.taskList}>
            <p>Aprender criar projetos usando NextJS e aplicando firebase como back.</p>
            <div className={styles.actions}>
              <div>
                <div>
                  <FiCalendar size={20} color="#ffb800"/>
                  <time>17 de Julho de 2021</time>
                </div>

                <button>
                  <FiEdit2 size={20} color="azure" />
                  <span>Editar</span>
                </button>
              </div>

              <button>
                <FiTrash size={20} color="#ff3636"/>
                <span>Excluir</span>
              </button>
            </div>
          </article>
        </section>
      </main>

      <footer  className={styles.vipContainer}>
        <div>
          <FiClock color='azure' size={25} />
          <time>
            Última doação foi a 3 dias.
          </time>
        </div>

        <p>Feito com ❤️ <a href="https://github.com/gabrielbugarelli" target='_blank'>@gabrielbugarelli</a></p>
      </footer>

      <SupportButton />
    </>
  )
}

export default TaskBoard;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if(!session?.id) {
    //Se não tiver um usuário autenticado, redireciona para a página inicial

    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {

    }
  }
}
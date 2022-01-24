import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { useState, FormEvent } from 'react';
import { SupportButton } from '../../components/SupportButton';
import Head from 'next/head';

import { firebase } from '../../services/firebaseConnection';

import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock } from 'react-icons/fi';
import styles from './styles.module.scss';

type BoardProps = {
  user: {
    id: string,
    name: string
  }
}

const TaskBoard = ({ user }: BoardProps) => {

  const [ inputTask, setInputTask ] = useState<string>('');

  /** 
   * @param event -> executa método para impedir carregamento padão do form.
   */
  const handleAddTask = async (event: FormEvent) => {
    event.preventDefault();

    if( inputTask === '') {
      alert('Preencha uma tarefa!');
      return;
    }

    await firebase.firestore()
      .collection('tasks')
      .add({
        userId: user.id,
        task: inputTask,
        name: user.name,
        created: new Date()
      })
      .then((doc) => {
        console.log('cadastrado com sucesso!');
      })
      .catch((error) => {
        console.log(`ERRO AO CADASTRAR: ${error}`);
      })
  }

  return (
    <>
      <Head>
        <title>Minhas tarefas - TaskBoard</title>
      </Head>

      <main className={styles.container}>
        <form onSubmit={handleAddTask}>
          <input 
            type="text"
            autoFocus
            value={inputTask}
            onChange={(value) => setInputTask(value.target.value)}
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
            Última colaboração foi a 3 dias.
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

  //Se não tiver um usuário autenticado, redireciona para a página inicial
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
    name: session?.user.name
  }

  return {
    props: {
      user
    }
  }
}
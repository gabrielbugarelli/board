import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { useState, FormEvent } from 'react';
import firebase from '../../services/firebaseConnection';
import { format } from 'date-fns';

import Head from 'next/head';
import Link from 'next/link';
import { SupportButton } from '../../components/SupportButton';

import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock, FiX } from 'react-icons/fi';
import styles from './styles.module.scss';

type TaskList = {
  id: string;
  created: string | Date;
  createdFormated?: string;
  task: string;
  userId: string;
  name: string;
}

type BoardProps = {
  user: {
    id: string,
    name: string
  }
  data: string
}

const TaskBoard = ({ user, data }: BoardProps) => {

  const [ inputTask, setInputTask ] = useState<string>('');
  const [ taskList, setTaskList ] = useState<TaskList[]>(JSON.parse(data));
  const [ taskEdit, setTaskEdit ] = useState<TaskList | null>(null);

  /** 
   * @description -> executa método para impedir carregamento padrão do form.
   * @description de premissa, o método é encarregado por criar novas tarefas,
   * contudo, caso o usuário estiver editando uma tarefa, o método identificará
   * e logo, fará update da tarefa.
   */
  const handleAddTask = async (event: FormEvent) => {
    event.preventDefault();

    if( inputTask === '') {
      alert('Preencha uma tarefa!');
      return;
    }

    if(taskEdit) {
      await firebase.firestore().collection('tasks').doc(taskEdit.id)
      .update({
        task: inputTask
      })
      .then(() => {
        let data = taskList;
        let taskIndex = taskList.findIndex(item => item.id === taskEdit.id);
        data[taskIndex].task = inputTask;

        setTaskList(data);
        setTaskEdit(null);
        setInputTask('');
      })

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
        let data = {
          id: doc.id,
          created: new Date(),
          createdFormated: format(new Date(), "dd MMMM yyyy"),
          task: inputTask,
          userId: user.id,
          name: user.name
        }

        setTaskList([...taskList, data]);
        setInputTask('');
      })
      .catch((error) => {
        console.warn(`ERRO AO CADASTRAR: ${error}`);
      })
  }

  const hadleDeleteTask = async (id: string) => {
    await firebase.firestore().collection('tasks').doc(id)
    .delete()
    .then(() => {
      let taskDeleted = taskList.filter(item => {
        return item.id !== id;
      })

      setTaskList(taskDeleted);
    })

    .catch((error) => {
      console.warn(`ERRO AO DELETAR: ${error}`);
    })
  }

  const handleEditTask = async (task: TaskList) => {
    setTaskEdit(task)    
    setInputTask(task.task)
  }

  const handleCancelEdit = () => {
    setInputTask('');
    setTaskEdit(null);
  }

  return (
    <>
      <Head>
        <title>Minhas tarefas - TaskBoard</title>
      </Head>

      <main className={styles.container}>
        {taskEdit && (
          <span className={styles.warnText}>
            <button onClick={handleCancelEdit}>
              <FiX size={30} color='#ff3636' />
            </button>
            Editando tarefa...
          </span>
        )}

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

        <h1>Você tem {taskList.length} {taskList.length === 1 ? 'tarefa!' : 'tarefas!'}</h1>

        <section>
          {taskList.map( task => (
            <article className={styles.taskList} key={task.id}>
              <Link href={`/taskboard/${task.id}`}>
                <p>{task.task}</p>
              </Link>
              <div className={styles.actions}>
                <div>
                  <div>
                    <FiCalendar size={20} color="#ffb800"/>
                    <time>{task.createdFormated}</time>
                  </div>

                  <button onClick={() => handleEditTask(task)}>
                    <FiEdit2 size={20} color="azure" />
                    <span>Editar</span>
                  </button>
                </div>

                <button onClick={() => hadleDeleteTask(task.id)}>
                  <FiTrash size={20} color="#ff3636"/>
                  <span>Excluir</span>
                </button>
              </div>
            </article>
          ))}
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

  const tasks = await firebase.firestore().collection('tasks')
  .where('userId', '==', session?.id)
  .orderBy('created', 'asc').get();

  const data = JSON.stringify(tasks.docs.map( item => {
      return {
        id: item.id,
        createdFormated: format(item.data().created.toDate(), "dd MMMM yyyy"),
        ...item.data()
      }
    })
  )

  const user = {
    id: session?.id,
    name: session?.user.name
  }

  return {
    props: {
      user,
      data
    }
  }
}
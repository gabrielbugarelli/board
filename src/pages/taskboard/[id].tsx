import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import Head from 'next/head';

import firebase from 'firebase';
import { format } from 'date-fns';

import { FiCalendar } from 'react-icons/fi';
import styles from './taskDetails.module.scss';

type TaskListProps = {
  data: string
}

type Task = {
  id: string
  created: string
  createdFormat?: string 
  task: string
  userId: string
  name: string
}

export default function Task({ data }: TaskListProps){
  const task: Task = JSON.parse(data);

  return(
    <>
      <Head>
        <title>{task.task}</title>
      </Head>
      
      <article className={styles.container}>
        <div className={styles.actions}>
          <div>
            <FiCalendar size={30} color='#fff'/>
            <span>Tarefa criada:</span>
            <time>{task.createdFormat}</time>
          </div>
        </div>
        <p>{task.task}</p>
      </article>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params })  => {
  const { id } = params;
  const session = await getSession({ req });

  if( !session?.vip ) {
    return {
      redirect: {
        destination: '/taskboard',
        permanent: false
      }
    }
  }

  const data = await firebase.firestore().collection('tasks')
  .doc(String(id))
  .get()
  .then((snapshot) => {
    const data = {
      id: snapshot.id,
      created: snapshot.data().created,
      createdFormat: format(snapshot.data().created.toDate(), 'dd MMMM yyyy'),
      task: snapshot.data().task,
      userId: snapshot.data().userId,
      name: snapshot.data().name
    }
    
    return JSON.stringify(data);
  })
  .catch(() => {
    return {};
  })

  /**
   * @description caso a rota da task não existir,
   * o retorna para o /taskboard
   */
  if( Object.keys(data).length === 0) {
    return {
      redirect: {
        destination: '/taskboard',
        permanent: false
      }
    }
  }

  return {
    props: {
      data
    }
  }
}
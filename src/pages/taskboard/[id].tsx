import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';

import firebase from 'firebase';
import { format } from 'date-fns';

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
    <div>
      <h1>Pagina detalhes</h1>
      <h2>{task.task}</h2>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params })  => {
  const { id } = params;
  const session = await getSession({ req });

  if( !session?.id ) {
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

  return {
    props: {
      data
    }
  }
}
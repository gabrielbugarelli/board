import styles from './styles.module.scss';
import { FaGithub }  from 'react-icons/fa'; 
import { FiX } from 'react-icons/fi';

export const SignInButton = () => {

  const session = true;
  
  return session ? 
    (
      <button
        type='button'
        className={styles.signInButton}
        onClick={() => {}}
      >
        <img src="https://avatars.githubusercontent.com/u/47955200?v=4" alt="avatar" />
        Olá Gabriel
        <FiX />
      </button>
    ) :

    (
      <button
        type='button'
        className={styles.signInButton}
        onClick={() => {}}
      >
        <FaGithub
          color='#FAB800'
        />
        Entrar com o github
      </button>
    ) 

}
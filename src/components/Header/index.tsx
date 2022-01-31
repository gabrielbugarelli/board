
import Link from 'next/link';
import styles from './styles.module.scss';
import { SignInButton } from '../SignInButton';

export function Header(){
  return(
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <img src="/images/logo.svg" alt="Logo Meu board" />
        </Link>
        <nav>
          <Link href="/">
            <a>HOME</a>
          </Link>
          <Link href="/taskboard">
            <a>TASKBOARD</a>
          </Link>
        </nav>

        <SignInButton/>
        
      </div>
    </header>
  )
}
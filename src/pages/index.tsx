import { GetStaticProps } from "next";
import { useState } from "react";
import Head from "next/head";

import styles from '../styles/styles.module.scss';
import firebase from '../services/firebaseConnection';

type HomeProps = {
  data: string
}

type Data = {
  id: string,
  donate: boolean,
  lastDonate: Date,
  image: string
}

export default function Home({ data }: HomeProps) {

  const [ donaters, _ ]= useState<Data[]>(JSON.parse(data));

  return (
    <>
      <Head>
        <title>Página inicial</title>
      </Head>

      <main className={styles.contentContainer}>
        <img src="/images/board-user.svg" alt="Ferramenta board" />

        <section className={styles.callToAction}>
          <h1>Uma ferramenta para o seu dia a dia. Escreva, planeje e organize-se...</h1>

          <p>
            <span>Grátis</span> e online.
          </p>
        </section>

        <div className={styles.donaters}>
          <a href="https://github.com/gabrielbugarelli" target='_blank'>
            {
              donaters.map( item => {
                return (
                  <img src={item.image} key={item.id} alt="avatar do colaborador" />
                )
              })
            }
          </a>
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  /**
   * @description lista todos os doadores do projeto
   */
  const donaters = await firebase.firestore().collection('users').get();

  const data = JSON.stringify(donaters.docs.map( item => {
    return {
      id: item.id,
      ...item.data()
    }
  }))

  return {
    props: {
      data
    },
    revalidate: 60 * 60 // atualiza a página a cada 60 minutos...
  }
}
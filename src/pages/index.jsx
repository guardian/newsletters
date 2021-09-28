import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { getNewsletters } from "../lib/newsletters";
import { headline } from "@guardian/src-foundations/typography";
import { css } from "@emotion/react";
import { Newsletter } from "../types/newsletters";

const h1 = css`
  ${headline.medium()};
`;

export const getStaticProps = async () => {
  const newsletters = await getNewsletters();
  return {
    props: {
      newsletters,
    },
  };
};

/**
 * 
 * @param {object} props 
 * @param {Newsletter[]} props.newsletters
 */
const Home = ({ newsletters }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>How many emails do we have on the go?</title>
        <meta
          name="description"
          content="How many emails do we have on the go?"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>How many emails do we have on the go?</h1>
        {newsletters.map((n, i) => (
          <div key={i}> {n.pillar} </div>
        ))}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;

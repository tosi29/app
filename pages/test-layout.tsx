import Head from 'next/head';
import styles from '../styles/Home.module.css';
import commentStyles from '../styles/Comments.module.css';

export default function TestLayout() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Test Layout | Next.js App</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Layout Test</h1>
        
        <div className={commentStyles.commentsPageLayout} style={{border: '2px solid red', minHeight: '400px'}}>
          <div className={commentStyles.commentsGraphSide} style={{border: '2px solid blue', background: 'lightblue'}}>
            <h3>Left Side (Graph)</h3>
            <p>This should be on the left side</p>
          </div>
          
          <div className={commentStyles.commentsListSide} style={{border: '2px solid green', background: 'lightgreen'}}>
            <h3>Right Side (Comments List)</h3>
            <p>This should be on the right side</p>
            <div style={{padding: '1rem', background: 'white', margin: '0.5rem 0'}}>Comment 1</div>
            <div style={{padding: '1rem', background: 'white', margin: '0.5rem 0'}}>Comment 2</div>
            <div style={{padding: '1rem', background: 'white', margin: '0.5rem 0'}}>Comment 3</div>
          </div>
        </div>
      </main>
    </div>
  );
}
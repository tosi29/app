import Head from 'next/head';
import React from 'react';
import styles from '../styles/Home.module.css';
import SpotifyPodcastEmbed from '../components/SpotifyPodcastEmbed';

export default function SpotifyDemo() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Spotify Podcast Embed Demo</title>
        <meta name="description" content="Demonstration of the Spotify podcast embed component" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Spotify Podcast Embed Component Demo</h1>
        
        <section style={{ maxWidth: '800px', width: '100%' }}>
          <h2>Basic Usage (No start time)</h2>
          <p>Episode ID: 2CFobdwT9eTKOubZkc0Uag</p>
          <SpotifyPodcastEmbed episodeId="2CFobdwT9eTKOubZkc0Uag" />
          
          <h2>With Start Time (754 seconds)</h2>
          <p>Episode ID: 2CFobdwT9eTKOubZkc0Uag, Start Time: 754 seconds</p>
          <SpotifyPodcastEmbed 
            episodeId="2CFobdwT9eTKOubZkc0Uag" 
            startTime={754} 
          />
          
          <h2>Custom Dimensions</h2>
          <p>Episode ID: 2CFobdwT9eTKOubZkc0Uag, Height: 152px (optimized)</p>
          <SpotifyPodcastEmbed 
            episodeId="2CFobdwT9eTKOubZkc0Uag"
            height="152"
          />
        </section>
      </main>
    </div>
  );
}
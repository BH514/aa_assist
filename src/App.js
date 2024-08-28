import React from 'react';
import AudioTranscriptionDemo from './components/aa_assist';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>aa_assist</h1>
      </header>
      <main className={styles.main}>
        <AudioTranscriptionDemo />
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 aa_assist. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
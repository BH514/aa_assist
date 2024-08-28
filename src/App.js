import React from 'react';
import AudioTranscriptionDemo from './components/aa_assist';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <main className={styles.main}>
        <AudioTranscriptionDemo />
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Digital Incubator - Advanced Analytics. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
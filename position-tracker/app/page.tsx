import Image from "next/image";
import styles from "./page.module.css";

import Footer from "./components/footer";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Welcome</h1>
      <h2 className={styles.subheading}>to AniWave</h2>
      <Footer></Footer>
    </div>
  );
}

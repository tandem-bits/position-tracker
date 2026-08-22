import styles from "./footer.module.css";
import Image from "next/image";

export default function Footer() {
    return (
        <div className={styles.container}>
            <Image className={styles.waves} src="/waves.gif" alt="Waves Image" width={1000} height={300} unoptimized></Image>
        </div>
    );
}
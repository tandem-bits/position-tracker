import styles from "./page.module.css";
import LoginBox from "../components/loginbox";
import Image from "next/image";
export default function LoginPage() {
    return (
        <div className={styles.container}>
            <div className={styles.loginbox}>
                <LoginBox></LoginBox>
            </div>

            <Image
                src="/waterfall-effect.gif" alt="waterfall" width={400} height={100}
                className={styles.waterfallImage}>
            </Image>
        </div>
    );
}
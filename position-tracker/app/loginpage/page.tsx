import styles from "./page.module.css";
import LoginBox from "../components/loginbox";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const cookieStore = await cookies();

    if (cookieStore.get("user-token")) {
        redirect("/")
    }
    return (
        <div className={styles.container}>
            <LoginBox className={styles.loginbox}></LoginBox>

            <Image
                src="/waterfall-effect.gif" alt="waterfall" width={400} height={100}
                className={styles.waterfallImage}>
            </Image>
        </div>
    );
}
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { cookies } from "next/headers";
export default async function MySaves() {
    const cookieStore = await cookies();

    if (!cookieStore.get("user-token")) {
        redirect("/");
    }
    return (
        <div className={styles.container}>
            
        </div>
    );
}
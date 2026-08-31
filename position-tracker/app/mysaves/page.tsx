import { redirect } from "next/navigation";
import styles from "./page.module.css";
import { cookies } from "next/headers";
import { neon } from "@neondatabase/serverless";
export default async function MySaves() {
    const cookieStore = await cookies();
    const sql = neon(process.env.DATABASE_URL!);
    const userIDValue = cookieStore.get("user-token")?.value;

    if (!userIDValue) {
        redirect("/");
    }

    const userID = Number.parseInt(userIDValue, 10);
    if (!Number.isInteger(userID)) {
        redirect("/");
    }

    const users = await sql`SELECT * FROM users WHERE id = ${userID}`;
    const user = users[0];

    if (!user) {
        redirect("/");
    }

    return (
        <div className={styles.page}>
            <div className={styles.navBar}>
                <button className={styles.button}>
                    Add Save
                </button>
            </div>
        </div>
    );
}
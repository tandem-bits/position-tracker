"use client";

import styles from "./header.module.css";
import Link from "next/link";
import { logout } from "../actions/actions";
import { useRouter } from "next/navigation";

export default function Header() {
    const menuOptions = [
        { name: "Login/Signup", href: "./loginpage" },
        { name: "My Saves", href: "./mysaves" }
    ]

    const router = useRouter();

    const handleLogout = async () => {
        const res = await logout();
        if (res.success) {
            router.push("/loginpage");
            router.refresh();
        }
    };

    return (
        <div className={styles.container}>
            <Link href="/">
                <h1 className={styles.siteTitle}>AniWave</h1>
            </Link>

            <nav className={styles.navBar}>
                {menuOptions.map((option) => (
                    <Link
                        key={option.href}
                        href={option.href}
                        className={styles.navOption}
                    >
                        {option.name}
                    </Link>
                ))}
            </nav>
            <button className={styles.button} onClick={handleLogout}>Logout</button>
        </div>
    );
}
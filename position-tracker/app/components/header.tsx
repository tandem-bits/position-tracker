import styles from "./header.module.css";
import Link from "next/link";
export default function Header() {
    const menuOptions = [
        { name: "Login/Signup", href: "./loginpage" },
        { name: "My Saves", href: "./mysaves"}
    ]
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
        </div>
    );
}
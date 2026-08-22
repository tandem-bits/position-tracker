"use client";
import styles from "./loginbox.module.css";
import { checkLogin } from "../actions/actions";

import { useActionState } from "react";

import { formState } from '../actions/actions';

const initialState: formState = {
  success: false,
  message: '',
};


export default function LoginBox() {
    const [state, formAction, isPending] = useActionState(checkLogin, initialState);
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Login/Signup</h1>

            <h2 className={styles.subheading}>Login</h2>
            <form action={formAction}>
                <input className={styles.input} name={"email"} placeholder={"Email"}></input>
                <input className={styles.input} name={"password"} placeholder={"Password"}></input>
            </form>
        </div>
    );
}
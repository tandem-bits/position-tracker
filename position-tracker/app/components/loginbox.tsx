"use client";
import styles from "./loginbox.module.css";
import { checkLogin, checkSignup } from "../actions/actions";

import { useActionState } from "react";

import { formState } from '../actions/actions';

const initialState: formState = {
  success: false,
  message: '',
};

interface props {
    className?: string;
}

export default function LoginBox({ className }: props) {
    const [state, formAction, isPending] = useActionState(checkLogin, initialState);
    const [signupState, signupFormAction, signupIsPending] = useActionState(checkSignup, initialState);
    return (
        <div className={className}>
            <h1 className={styles.title}>Login/Signup</h1>

            <h2 className={styles.subheading}>Login</h2>
            <form className={styles.form} action={formAction}>
                <input className={styles.input} name={"email"} placeholder={"Email"} required></input>
                <input className={styles.input} name={"password"} type="password" placeholder={"Password"} required></input>
                <button type={"submit"} className={styles.button}>{isPending ? "Logging In.." : "Login"}</button>
            </form>

            <p className={styles.error} >{state.message}</p>

            <h2 className={styles.subheading}>Signup</h2>
            <form className={styles.form} action={signupFormAction}>
                <input className={styles.input} name={"username"} placeholder={"Username"} required></input>
                <input className={styles.input} name={"email"} placeholder={"Email"} required></input>
                <input className={styles.input} name={"password"} type="password" placeholder={"Password"} required></input>
                <input className={styles.input} name={"confirmpassword"} type="password" placeholder={"Retype Password"} required></input>

                <button type={"submit"} className={styles.button}>{signupIsPending ? "Signing In.." : "Signup"}</button>

            </form>

            <p className={styles.error}>{signupState.message}</p>
        </div>
    );
}
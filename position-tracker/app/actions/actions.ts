"use server";

import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";

export type formState = {
    success: boolean,
    message: string,
}
export async function checkLogin (prevState: formState, formData: FormData) {
    const sql = neon(process.env.DATABASE_URL!);
    const cookieStore = await cookies();

    const matchingUsers = await sql`SELECT * FROM users WHERE email = ${formData.get("email")} AND password = ${formData.get("password")};`

    if (matchingUsers.length > 0) {
        return { success: true, message: "Login Successful"};
    } else {
        return { success: false, message: "We Couldn't Find You In Our Database or Your Info Is Incorrect.. Maybe Sign Up."};
    }
    
}
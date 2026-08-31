"use server";

import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import * as bcrypt from "bcrypt-ts";
import { Truculenta } from "next/font/google";

export type formState = {
  success: boolean;
  message: string;
};

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_change_this");

export async function checkLogin(prevState: formState, formData: FormData) {
  const sql = neon(process.env.DATABASE_URL!);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "All fields are required." };
  }

  const matchingUsers = await sql`SELECT * FROM users WHERE email = ${email};`;

  if (matchingUsers.length === 0) {
    return { success: false, message: "Invalid email or password." };
  }

  const userID = Number(matchingUsers[0].id);
  if (!Number.isInteger(userID)) {
    return { success: false, message: "Invalid user session." };
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: "user-token",
    value: String(userID),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/mysaves");
}

export async function checkSignup(prevState: formState, formData: FormData) {
  const sql = neon(process.env.DATABASE_URL!);
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmpassword") as string;

  if (!username || !email || !password || !confirmPassword) {
    return { success: false, message: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { success: false, message: "Passwords don't match." };
  }

  const existingUsers = await sql`SELECT id FROM users WHERE email = ${email};`;
  if (existingUsers.length > 0) {
    return { success: false, message: "Email already signed up. Try logging in." };
  }

  await sql`
    INSERT INTO users (username, password, email) 
    VALUES (${username}, ${password}, ${email});
  `;

  const matchingUsers = await sql`SELECT id FROM users WHERE email = ${email};`;
  const userID = Number(matchingUsers[0]?.id);

  if (!matchingUsers.length || !Number.isInteger(userID)) {
    return { success: false, message: "Unable to create account session." };
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: "user-token",
    value: String(userID),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/mysaves");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("user-token");

  return { success: true };
}


export async function add_save(saveName: string, isBook: boolean, page: number, chapter: number, episode: number, season: number, time_position: number) {
  const cookieStore = await cookies();
  const userIDValue = cookieStore.get("user-token")?.value;
  const userID = Number.parseInt(userIDValue ?? "", 10);

  if (!Number.isInteger(userID)) {
    redirect("/");
  }

  const isSeries = !isBook;
  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    WITH new_save AS (
      INSERT INTO user_saves (save_name, user_id) VALUES (${saveName}, ${userID})
      RETURNING save_id
    )

    INSERT INTO save_positions (save_id, isBook, isSeries, page, chapter, season, episode, time_position)
    SELECT save_id, ${isBook}, ${isSeries}, ${page}, ${chapter}, ${season}, ${episode}, ${time_position} FROM new_save;
  `;

  return { success: true, message: "Saved."};
}
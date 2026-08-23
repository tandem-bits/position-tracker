"use server";

import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import * as bcrypt from "bcrypt-ts";

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

  // 1. Fetch user by email only
  const matchingUsers = await sql`SELECT * FROM users WHERE email = ${email};`;
  const user = matchingUsers[0];

  // 2. Safely verify password hash
  const isValidPassword = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !isValidPassword) {
    return { success: false, message: "Invalid email or password." };
  }

  // 3. Create a cryptographically secure token
  const token = await new SignJWT({ userId: user.id, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  // 4. Save to secure cookie
  const cookieStore = await cookies();
  cookieStore.set({
    name: "user-token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  // 5. Redirect executes last
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

  // Check if email already exists
  const matchingUsers = await sql`SELECT username FROM users WHERE email = ${email};`;
  if (matchingUsers.length > 0) {
    return { success: false, message: "Email already signed up. Try logging in." };
  }

  // Hash the password securely
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert secure user record
  await sql`
    INSERT INTO users (username, password, email) 
    VALUES (${username}, ${hashedPassword}, ${email});
  `;

  redirect("/mysaves");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("user-token");
  redirect("/loginpage");
}

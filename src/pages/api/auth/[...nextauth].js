import dotenv from "dotenv";
dotenv.config();
// Now you can access process.env.JWT_SECRET
// const jwtSecret = process.env.JWT_SECRET;
// console.log("JWT Secret from environment variables:", jwtSecret); // Add this line to print JWT secret

import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { SessionProvider } from "next-auth/react";
import { copySync } from "fs-extra";

const User = require("../../../../models/Users");
const Role = require("../../../../models/Roles");
const bcrypt = require("bcryptjs");

export const authOptions = {
  // secret: process.env.NEXTAUTH_SECRET,
  // secret: process.env.NEXT_PUBLIC_SECRET,
  // secret: process.env.NEXT_PUBLIC_SECRET,
  secret:
    "w/PxpH6AP7dHpY4zBkEGzG9tIilBuuaCGzvNB7GJQze2Q8JSGx5BTTfbFyT3gkVeI0yUjxJh+t3w9Ow5fyiYWg==",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        const { email, password } = credentials;

        try {
          console.log(`Attempting to authenticate user with email: ${email}`);

          const user = await User.findOne({
            where: { email },
            include: [{ model: Role, as: "role" }],
          });

          console.log("user foud", user);

          if (!user) {
            console.log(`User with email ${email} not found`);
            throw new Error("User not found");
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            console.log(`Invalid credentials for user with email ${email}`);
            throw new Error("Invalid credentials");
          }

          console.log(`User authenticated successfully: ${user.email}`);

          const plainUser = user.get({ plain: true });

          return plainUser;
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error(error.message);
        }
      },
    }),
  ],
  session: {
    jwt: true,
  },
  jwt: {
    // secret: process.env.NEXTAUTH_SECRET,
    secret:
      "w/PxpH6AP7dHpY4zBkEGzG9tIilBuuaCGzvNB7GJQze2Q8JSGx5BTTfbFyT3gkVeI0yUjxJh+t3w9Ow5fyiYWg==",
  },
  callbacks: {
    async jwt({ token, user, session }) {
      // console.log("jwt  before callabck", { token, user, session });
      if (user) {
        return {
          ...token,
          user_id: user.user_id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          role: user.role ? user.role.role_name : null,
        };
      }

      // console.log("token after callback", token);

      return token;
    },
    async session({ session, token, user }) {
      // console.log("session  before callback", { session, token, user });

      session.user = {
        user_id: token.user_id,
        email: token.email,
        name: `${token.first_name} ${token.last_name}`,
        phone_number: token.phone_number,
        role: token.role, // Default or placeholder name
        image: token.image, // Default image URL
      };
      // console.log("session after callback", session);

      return session;
    },
  },
};

export default NextAuth(authOptions);

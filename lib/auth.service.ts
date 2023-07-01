import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV !== "production",
  theme: {
    colorScheme: "auto", // "auto" | "dark" | "light"
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};

export const getUser = async () => {
  const session = await getServerSession(authOptions);

  return session?.user;
};

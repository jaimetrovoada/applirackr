import { NextAuthOptions, getServerSession } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";
import GitHubProvider from "next-auth/providers/github";

export const nextAuthOptions: NextAuthOptions = {
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

  secret: process.env.SECRET,
};

export const getUser = async () => {
  const session = await getServerSession(nextAuthOptions);

  return session?.user;
};

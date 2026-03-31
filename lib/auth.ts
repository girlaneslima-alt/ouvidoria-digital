import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    // Login com Google (GOV.BR usa Google por baixo para cidadãos)
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    // Magic link via email (Resend)
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY!,
      from: process.env.EMAIL_FROM ?? "noreply@ouvidoria.gov.br",
    }),
    // Credenciais (cadastro próprio na plataforma)
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
          include: { cidadao: true },
        });

        if (!user || !user.emailVerified) return null;

        // Senha armazenada no campo auxiliar — buscamos no perfil do cidadão
        const senhaHash = await db.$queryRaw<{ senha: string }[]>`
          SELECT senha FROM "SenhaCidadao" WHERE "userId" = ${user.id} LIMIT 1
        `.catch(() => []);

        if (!senhaHash.length) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          senhaHash[0].senha
        );

        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      return session;
    },
  },
});

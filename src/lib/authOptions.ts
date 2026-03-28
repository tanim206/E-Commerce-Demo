import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions, User as NextAuthUser } from "next-auth";
import { dbConnect, collections } from "@/lib/dbConnect";
import bcrypt from 'bcryptjs';

// Extend Session and User interfaces to include custom fields
declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      profilePhoto?: string | null;
      role: string;
      isActive?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    profilePhoto?: string | null;
    role: string;
    isActive?: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        const { email, password } = credentials;

        // Connect to DB and find user by email only
        const userCollection = dbConnect(collections.users);
        const user = await userCollection.findOne<{
          _id: string;
          name?: string;
          email: string;
          password: string;
          role: string;
          profilePhoto: string;
          isActive?: string;
        }>({ email });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        // Compare the provided password with the hashed password in DB
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        console.log("Authenticated user:", user);

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          profilePhoto: user.profilePhoto,
        };
      },
    }),
  ],

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.isActive = user.isActive;
        token.profilePhoto = user.profilePhoto;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (!session.user) {
        session.user = {
          id: "",
          name: null,
          email: null,
          profilePhoto: null,
          role: "",
          isActive: "",
        };
      }

      session.user.id = token.id as string;
      session.user.name = token.name as string | null;
      session.user.email = token.email as string | null;
      session.user.isActive = token.isActive as string;
      session.user.profilePhoto = token.profilePhoto as string | null | undefined;
      session.user.role = token.role as string;
      
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
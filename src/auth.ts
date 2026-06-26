import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

const AVATAR_COLORS = [
  "bg-[#7030E0]",
  "bg-[#E03070]",
  "bg-[#30E070]",
  "bg-[#30A0E0]",
  "bg-[#E07030]",
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const existing = await User.findOne({ email: user.email });
        if (!existing) {
          const avatarColor =
            AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
          await User.create({
            name: user.name,
            email: user.email,
            avatarColor,
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user?.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.avatarColor = dbUser.avatarColor as string;
          token.name = dbUser.name as string;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).avatarColor = token.avatarColor;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

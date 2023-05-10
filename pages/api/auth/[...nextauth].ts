import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Admin",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        toView: { label: "Account To Manage", type: "email" },
        password: { label: "Admin Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        var user: any = null;
        if (credentials!.password === process.env.VERIFICATION_TOKEN) {
          var user: any = { id: "1", name: "Admin", email: credentials!.toView, image: "ADMIN" }
        }

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
    // ...add more providers here
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ }) {
      return true
    },
    async redirect({ baseUrl }: any) {
      return baseUrl
    },
    async session({ session }: any) {
      return session
    },
    async jwt({ token }: any) {
      return token
    }
  }
}

export default NextAuth(authOptions)
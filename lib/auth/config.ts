import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/db/connect'
import { User } from '@/lib/models'

export const authOptions: NextAuthOptions = {
  providers: [
    /*
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    */
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        await connectDB()

        const user = await User.findOne({ email: credentials.email }).select('+password')
        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        if (!user.isActive) throw new Error('Account is suspended')

        await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() })

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          tenantId: user.tenantId.toString(),
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tenantId = (user as unknown as { tenantId: string }).tenantId
        token.role     = (user as unknown as { role: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id       = token.sub as string
        ;(session.user as { tenantId?: string }).tenantId = token.tenantId as string
        ;(session.user as { role?: string }).role    = token.role as string
      }
      return session
    },
  },

  pages: {
    signIn:  '/login',
    error:   '/login',
    newUser: '/register',
  },

  session: {
    strategy: 'jwt',
    maxAge:   30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
}

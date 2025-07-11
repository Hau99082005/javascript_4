import CredentialsProvider  from "next-auth/providers/credentials";
import User from "@/model/user";
import bcrypt from "bcrypt";
import dbConnect from "./dbConnect";

export const authOptions = {
    session: {
        strategy: 'jwt' as const,
    },
    providers: [
    CredentialsProvider({
        credentials: {
            email: { label: 'Email', type: 'text' },
            password: { label: 'Password', type: 'password' },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async authorize(credentials: Record<string, string> | undefined): Promise<any> {
            await dbConnect();
            const email = credentials?.email;
            const password = credentials?.password;
            if (!email || !password) {
                throw new Error('Vui lòng nhập email và mật khẩu');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const user = await User.findOne({ email: email }).lean() as any;
            if (!user || !user.password) {
                throw new Error(`Vui lòng đăng nhập với email và mật khẩu của bạn`);
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                throw new Error('email và mật khẩu không hợp lệ!');
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password: _pw, ...userWithoutPassword } = user;
            return userWithoutPassword;
        },
    })
    ],
   callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt: async ({ token }: { token: any }) => {
        const userByemail = await User.findOne({ email: token.email }).lean();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userObj = userByemail as Record<string, any> | null;
        if (userObj) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userWithoutPassword } = userObj;
            token.user = userWithoutPassword;
            token.role = userWithoutPassword.role;
        } else {
            token.user = null;
            token.role = null;
        }
        return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: async ({ session, token }: { session: any, token: any }) => {
        session.user = token.user;
        return session;
    }
   },
   secret: process.env.NEXTAUTH_SECRET, 
pages: {
    signIn: '/login'
}
}
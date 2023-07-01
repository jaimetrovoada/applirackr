export { default } from "next-auth/middleware";

export const config = { matcher: ["/applications", "/profile/:path*"] };

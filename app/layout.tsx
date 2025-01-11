import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import AuthContext from '../components/auth/AuthContext';
import { ClassRoleProvider } from '@/app/context/roleContext';
import { Toaster } from "@/components/ui/toaster"

const fira = Fira_Code({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Codl",
  description: "An app for Python coding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthContext>
        <ClassRoleProvider>
          <body className={`${fira.className} dark`}>
            <main>{children}</main>
            <Toaster />
          </body>
        </ClassRoleProvider>
      </AuthContext>
    </html>
  );
}

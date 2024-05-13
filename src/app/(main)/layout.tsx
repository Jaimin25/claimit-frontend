import { Rubik } from 'next/font/google';

import Footer from '@/components/Footer/footer';
import Header from '@/components/Header/header';
import { Toaster } from '@/components/ui/sonner';
import { Config } from '@/lib/config';

import '@/styles/globals.css';

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
});

export const metadata = {
  title: Config.APP_NAME,
  description: 'Generated by create-t3-app',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={rubik.variable}>
      <body className={`grainy ${rubik.variable}`}>
        <Header />
        <div className="mt-[56px] flex-1">{children}</div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

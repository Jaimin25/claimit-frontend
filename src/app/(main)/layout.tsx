import { Rubik } from 'next/font/google';

import Footer from '@/components/Footer/footer';
import Header from '@/components/Header/header';
import BaseProvider from '@/components/Providers/base-provider';
import { Toaster } from '@/components/ui/sonner';
import { Config } from '@/lib/config';

import '@/styles/globals.css';

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-rubik',
});

export const metadata = {
  title: Config.APP_NAME,
  description: 'A marketplace to auction your items',
  icons: {
    icon: [{ url: '/icon.png', sizes: '32x32' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={rubik.variable}>
      <body className={`grainy ${rubik.variable}`}>
        <BaseProvider>
          <Header />
          <div className="mt-[56px] flex-1">{children}</div>
          <Footer />
          <Toaster />
        </BaseProvider>
      </body>
    </html>
  );
}

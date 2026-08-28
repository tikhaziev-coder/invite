import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Приглашение встретиться — Альбина Рамилевна',
  description:
    'Спокойное приглашение с выбором прогулки или заведения, даты и времени.',
  openGraph: {
    title: 'Альбина Рамилевна, приглашаю вас провести время вместе',
    description: 'Уфа · прогулка или уютное заведение',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Приглашение на прогулку' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Альбина Рамилевна, приглашаю вас провести время вместе',
    description: 'Уфа · прогулка или уютное заведение',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

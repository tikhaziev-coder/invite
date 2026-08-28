import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ответ на приглашение · закрытая страница',
  description: 'Закрытая страница владельца приглашения.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Ответ на приглашение · закрытая страница',
    description: 'Закрытая страница владельца приглашения.',
    images: [],
  },
  twitter: {
    card: 'summary',
    title: 'Ответ на приглашение · закрытая страница',
    description: 'Закрытая страница владельца приглашения.',
    images: [],
  },
};

export default function AnswerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

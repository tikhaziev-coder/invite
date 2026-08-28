import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ответ на приглашение',
  description: 'Выбранные детали встречи.',
  openGraph: {
    title: 'Ответ на приглашение',
    description: 'Выбранные детали встречи.',
    images: [],
  },
  twitter: {
    card: 'summary',
    title: 'Ответ на приглашение',
    description: 'Выбранные детали встречи.',
    images: [],
  },
};

export default function AnswerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

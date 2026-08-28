'use client';

import { useEffect, useState } from 'react';
import { formatDate, type InviteAnswer } from '../invite-data';

const RSVP_API_URL = process.env.NEXT_PUBLIC_RSVP_API_URL ?? '/api/rsvp';

type SavedAnswer = InviteAnswer & {
  id: string;
  submittedAt: string;
};

type ResultPayload = {
  latest: SavedAnswer | null;
  history: SavedAnswer[];
};

type PageState =
  | { status: 'loading' }
  | { status: 'missing-key' }
  | { status: 'forbidden' }
  | { status: 'error' }
  | { status: 'ready'; payload: ResultPayload };

function formatSubmittedAt(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Yekaterinburg',
  }).format(new Date(value));
}

function AnswerDetails({ answer }: { answer: SavedAnswer }) {
  return (
    <dl className="answer-details">
      <div>
        <dt>Формат</dt>
        <dd>{answer.activityLabel}</dd>
      </div>
      <div>
        <dt>{answer.activity === 'venue' ? 'Заведение' : 'Куда'}</dt>
        <dd>{answer.locationName}</dd>
        <a href={answer.mapUrl} target="_blank" rel="noreferrer">
          Посмотреть в 2ГИС ↗
        </a>
      </div>
      <div>
        <dt>Когда</dt>
        <dd>{formatDate(answer.date)}</dd>
        <span>{answer.time}</span>
      </div>
      {answer.activity === 'outdoor' && answer.company && (
        <div>
          <dt>Компания</dt>
          <dd>{answer.company}</dd>
        </div>
      )}
      {answer.note && (
        <div>
          <dt>Пожелание</dt>
          <dd>{answer.note}</dd>
        </div>
      )}
      <div>
        <dt>Ответ отправлен</dt>
        <dd className="submitted-date">{formatSubmittedAt(answer.submittedAt)}</dd>
      </div>
    </dl>
  );
}

export default function AnswerPage() {
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });

  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get('key');
    if (!key) {
      const timeout = window.setTimeout(() => setPageState({ status: 'missing-key' }), 0);
      return () => window.clearTimeout(timeout);
    }

    const controller = new AbortController();
    const loadAnswer = async () => {
      try {
        const url = new URL(RSVP_API_URL, window.location.href);
        url.searchParams.set('key', key);
        const response = await fetch(url, { cache: 'no-store', signal: controller.signal });
        if (response.status === 403) {
          setPageState({ status: 'forbidden' });
          return;
        }
        if (!response.ok) throw new Error('RSVP request failed');
        const payload = (await response.json()) as ResultPayload;
        setPageState({ status: 'ready', payload });
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        setPageState({ status: 'error' });
      }
    };

    void loadAnswer();
    return () => controller.abort();
  }, []);

  if (pageState.status === 'loading') {
    return (
      <main className="answer-shell">
        <p className="answer-loading">Загружаю ответ…</p>
      </main>
    );
  }

  if (pageState.status !== 'ready') {
    const copy = {
      'missing-key': {
        eyebrow: 'Закрытая страница',
        title: 'Нужна личная ссылка.',
        text: 'Откройте адрес владельца целиком — вместе с секретным ключом.',
      },
      forbidden: {
        eyebrow: 'Закрытая страница',
        title: 'Доступ закрыт.',
        text: 'Этот адрес не содержит правильного ключа владельца приглашения.',
      },
      error: {
        eyebrow: 'Не удалось загрузить',
        title: 'Попробуйте ещё раз.',
        text: 'Временная ошибка соединения. Обновите страницу через минуту.',
      },
    }[pageState.status];

    return (
      <main className="answer-shell">
        <section className="answer-card answer-error">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>{copy.text}</p>
        </section>
      </main>
    );
  }

  const { latest, history } = pageState.payload;
  if (!latest) {
    return (
      <main className="answer-shell">
        <section className="answer-card answer-error">
          <div className="answer-topline">
            <span>Ответ на приглашение</span>
            <span>Только для владельца</span>
          </div>
          <p className="eyebrow">Закрытая страница</p>
          <h1>Ждём ответ.</h1>
          <p>Пока выбор не отправлен. После заполнения приглашения результат появится здесь автоматически.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="answer-shell answer-history-shell">
      <section className="answer-card" aria-labelledby="answer-title">
        <div className="answer-topline">
          <span>Ответ на приглашение</span>
          <span>Только для владельца</span>
        </div>
        <p className="eyebrow">Последний выбор</p>
        <h1 id="answer-title">Ответ получен.</h1>
        <p className="answer-lead">
          Альбина Шамилевна заполнила приглашение. Ниже — выбранный план встречи.
        </p>
        <AnswerDetails answer={latest} />

        {history.length > 1 && (
          <section className="answer-history" aria-labelledby="history-title">
            <p className="eyebrow">Предыдущие отправки</p>
            <h2 id="history-title">История ответов</h2>
            <div className="history-list">
              {history.slice(1).map((answer) => (
                <details key={answer.id}>
                  <summary>
                    <span>{formatSubmittedAt(answer.submittedAt)}</span>
                    <strong>{answer.locationName}</strong>
                  </summary>
                  <AnswerDetails answer={answer} />
                </details>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

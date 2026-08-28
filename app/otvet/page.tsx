'use client';

import { useEffect, useState } from 'react';
import { decodeAnswer, formatDate, type InviteAnswer } from '../invite-data';

export default function AnswerPage() {
  const [answer, setAnswer] = useState<InviteAnswer | null | undefined>();
  const [shareStatus, setShareStatus] = useState('');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('d');
    setAnswer(token ? decodeAnswer(token) : null);
  }, []);

  async function shareAnswer() {
    const shareData = {
      title: 'Ответ на приглашение',
      text: 'Я выбрала вариант встречи',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus('Готово — ответ можно отправлять.');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus('Ссылка скопирована.');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setShareStatus('Не получилось скопировать. Скопируйте адрес страницы вручную.');
    }
  }

  if (answer === undefined) {
    return (
      <main className="answer-shell">
        <p className="answer-loading">Собираем план…</p>
      </main>
    );
  }

  if (!answer) {
    return (
      <main className="answer-shell">
        <section className="answer-card answer-error">
          <p className="eyebrow">Ссылка неполная</p>
          <h1>Похоже, выбор ещё не сделан.</h1>
          <p>Вернитесь к приглашению и выберите удобные варианты.</p>
          <a className="answer-back" href="../">Вернуться к приглашению</a>
        </section>
      </main>
    );
  }

  return (
    <main className="answer-shell">
      <section className="answer-card" aria-labelledby="answer-title">
        <div className="answer-topline">
          <span>Ответ на приглашение</span>
          <span>Уфа</span>
        </div>
        <p className="eyebrow">План встречи готов</p>
        <h1 id="answer-title">Договорились.</h1>
        <p className="answer-lead">
          Осталось отправить эту страницу автору приглашения — и можно считать,
          что основные детали согласованы.
        </p>

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
        </dl>

        <div className="answer-actions">
          <button type="button" onClick={shareAnswer}>Поделиться ответом</button>
          <a href="../">Изменить выбор</a>
        </div>
        {shareStatus && <p className="share-status" role="status">{shareStatus}</p>}
      </section>
    </main>
  );
}

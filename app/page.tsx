'use client';

import { FormEvent, useMemo, useState } from 'react';
import {
  companyOptions,
  encodeAnswer,
  formatDate,
  locations,
  venues,
  type ActivityType,
  type InviteAnswer,
} from './invite-data';

const fixedDates = [
  { value: '2026-08-29', weekday: 'суббота', dateLabel: '29 августа' },
  { value: '2026-08-30', weekday: 'воскресенье', dateLabel: '30 августа' },
];

const hours = Array.from({ length: 8 }, (_, index) => String(index + 16).padStart(2, '0'));
const minutes = Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, '0'));

export default function Home() {
  const [activity, setActivity] = useState<ActivityType | ''>('');
  const [locationId, setLocationId] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [venueId, setVenueId] = useState('');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('19');
  const [minute, setMinute] = useState('00');
  const [company, setCompany] = useState('');
  const [note, setNote] = useState('');

  const selectedLocation = useMemo(() => {
    if (locationId === 'custom' && customLocation.trim()) {
      return {
        id: 'custom',
        name: customLocation.trim(),
        mapUrl: `https://2gis.ru/ufa/search/${encodeURIComponent(`${customLocation.trim()} Уфа`)}`,
      };
    }
    return locations.find((location) => location.id === locationId);
  }, [customLocation, locationId]);
  const selectedVenue = useMemo(
    () => venues.find((venue) => venue.id === venueId),
    [venueId],
  );
  const selectedCompany = companyOptions.find((item) => item.id === company);
  const selectedPlace = activity === 'outdoor' ? selectedLocation : selectedVenue;
  const time = `${hour}:${minute}`;
  const isCustomDate = Boolean(date && !fixedDates.some((option) => option.value === date));
  const hasActivityDetails =
    activity === 'outdoor'
      ? Boolean(selectedLocation && selectedCompany)
      : activity === 'venue'
        ? Boolean(selectedVenue)
        : false;
  const canSubmit = Boolean(activity && hasActivityDetails && date && hour && minute);

  function chooseActivity(nextActivity: ActivityType) {
    setActivity(nextActivity);
    if (nextActivity === 'outdoor') {
      setVenueId('');
    } else {
      setLocationId('');
      setCompany('');
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || !activity || !selectedPlace) return;

    const answer: InviteAnswer = {
      activity,
      activityLabel: activity === 'outdoor' ? 'Прогулка на улице' : 'Посидеть в заведении',
      locationId: selectedPlace.id,
      locationName: selectedPlace.name,
      mapUrl: selectedPlace.mapUrl,
      date,
      time,
      company: activity === 'outdoor' ? selectedCompany?.label ?? '' : '',
      note: note.trim(),
    };
    const resultUrl = new URL('otvet/', window.location.href);
    resultUrl.searchParams.set('d', encodeAnswer(answer));
    localStorage.setItem('invite-last-answer', resultUrl.toString());
    window.location.href = resultUrl.toString();
  }

  return (
    <main>
      <section className="hero" aria-labelledby="invite-title">
        <div className="hero-topline">
          <span>Личное приглашение</span>
          <span>Уфа</span>
        </div>

        <div className="hero-copy">
          <p className="eyebrow">Для спокойного вечера без спешки</p>
          <h1 id="invite-title">
            Альбина Рамилевна,
            <br />
            приглашаю вас <em>провести время вместе</em>
          </h1>
          <p className="lead">
            Можно прогуляться, можно посидеть в уютном месте. Выберите формат,
            который кажется комфортнее, — без сложного плана и лишней официальности.
          </p>
          <a className="primary-link" href="#choice">
            Выбрать вариант <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="route-mark" aria-hidden="true">
          <span className="route-dot" />
          <span className="route-line" />
          <span className="route-dot route-dot-filled" />
        </div>
      </section>

      <section className="intro-section" aria-labelledby="how-title">
        <p className="eyebrow">План простой</p>
        <h2 id="how-title">Сначала формат.<br />Потом — удобные детали.</h2>
        <div className="principles">
          <article>
            <span>01</span>
            <p>Прогулка или уютное заведение</p>
          </article>
          <article>
            <span>02</span>
            <p>Дата и время без спешки</p>
          </article>
          <article>
            <span>03</span>
            <p>Выбор всегда можно поменять</p>
          </article>
        </div>
      </section>

      <section className="choice-section" id="choice" aria-labelledby="choice-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Ваш выбор</p>
            <h2 id="choice-title">Как проведём время?</h2>
          </div>
          <p>Сначала выберите формат встречи — следующие варианты появятся сами.</p>
        </div>

        <form className="invite-form" onSubmit={handleSubmit}>
          <div className="form-fields">
            <fieldset className="form-block">
              <legend><span>01</span> Формат встречи</legend>
              <div className="activity-choice">
                <button
                  className={activity === 'outdoor' ? 'is-selected' : ''}
                  type="button"
                  onClick={() => chooseActivity('outdoor')}
                >
                  <span>На свежем воздухе</span>
                  <strong>Прогулка на улице</strong>
                </button>
                <button
                  className={activity === 'venue' ? 'is-selected' : ''}
                  type="button"
                  onClick={() => chooseActivity('venue')}
                >
                  <span>За столиком</span>
                  <strong>Посидеть в заведении</strong>
                </button>
              </div>
            </fieldset>

            {activity === 'outdoor' && (
              <fieldset className="form-block conditional-block">
                <legend><span>02</span> Как будем гулять</legend>
                <p className="field-label">Компания</p>
                <div className="company-options company-options-spaced">
                  {companyOptions.map((option) => (
                    <label
                      className={company === option.id ? 'is-selected' : ''}
                      key={option.id}
                    >
                      <input
                        className="visually-hidden"
                        type="radio"
                        name="company"
                        value={option.id}
                        checked={company === option.id}
                        onChange={() => setCompany(option.id)}
                      />
                      <span className="radio-dot" />
                      {option.label}
                    </label>
                  ))}
                </div>

                <p className="field-label">Маршрут</p>
                <div className="locations-grid">
                  {locations.map((location) => (
                    <label
                      className={`location-card ${locationId === location.id ? 'is-selected' : ''}`}
                      key={location.id}
                    >
                      <input
                        className="visually-hidden"
                        type="radio"
                        name="location"
                        value={location.id}
                        checked={locationId === location.id}
                        onChange={() => setLocationId(location.id)}
                      />
                      <span className="card-number">{location.number}</span>
                      <span className="card-mood">{location.mood}</span>
                      <strong>{location.name}</strong>
                      <span className="card-description">{location.description}</span>
                      <span className="card-footer">
                        <a
                          href={location.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                        >
                          Открыть в 2ГИС ↗
                        </a>
                        {location.dogFriendly && <small>с собакой</small>}
                      </span>
                    </label>
                  ))}
                </div>

                <div className={`custom-route-option ${locationId === 'custom' ? 'is-selected' : ''}`}>
                  <label>
                    <input
                      className="visually-hidden"
                      type="radio"
                      name="location"
                      value="custom"
                      checked={locationId === 'custom'}
                      onChange={() => setLocationId('custom')}
                    />
                    <span className="radio-dot" />
                    Свой вариант
                  </label>
                  <input
                    type="text"
                    maxLength={120}
                    value={customLocation}
                    onFocus={() => setLocationId('custom')}
                    onChange={(event) => {
                      setLocationId('custom');
                      setCustomLocation(event.target.value);
                    }}
                    placeholder="Например: пройтись по центру или выбрать другой парк"
                    aria-label="Свой вариант маршрута"
                  />
                  {locationId === 'custom' && customLocation.trim() && (
                    <a href={selectedLocation?.mapUrl} target="_blank" rel="noreferrer">
                      Найти в 2ГИС ↗
                    </a>
                  )}
                </div>
              </fieldset>
            )}

            {activity === 'venue' && (
              <fieldset className="form-block conditional-block">
                <legend><span>02</span> Где посидим</legend>
                <label className="venue-select-label" htmlFor="venue">
                  <span>Заведение · {venues.length} вариантов</span>
                  <select
                    id="venue"
                    value={venueId}
                    onChange={(event) => setVenueId(event.target.value)}
                  >
                    <option value="">Выберите вариант</option>
                    {venues.map((venue) => (
                      <option value={venue.id} key={venue.id}>
                        {venue.name} — {venue.address}
                      </option>
                    ))}
                  </select>
                </label>

                {selectedVenue && (
                  <article className="venue-preview">
                    <div>
                      <p>{selectedVenue.mood}</p>
                      <h3>{selectedVenue.name}</h3>
                      <span>{selectedVenue.address}</span>
                    </div>
                    <a href={selectedVenue.mapUrl} target="_blank" rel="noreferrer">
                      Открыть в 2ГИС ↗
                    </a>
                  </article>
                )}
              </fieldset>
            )}

            {activity && (
              <>
                <fieldset className="form-block conditional-block">
                  <legend><span>03</span> Когда удобно</legend>
                  <div className="date-time-grid">
                <div>
                  <p className="field-label">Дата</p>
                  <div className="fixed-date-options">
                    {fixedDates.map((option) => (
                      <button
                        className={date === option.value ? 'is-selected' : ''}
                        key={option.value}
                        type="button"
                        onClick={() => setDate(option.value)}
                      >
                        <span>{option.weekday}</span>
                        <strong>{option.dateLabel}</strong>
                      </button>
                    ))}
                    <label className={`native-date-button ${isCustomDate ? 'is-selected' : ''}`}>
                      <span>{isCustomDate ? formatDate(date) : 'другая'}</span>
                      <strong>{isCustomDate ? 'выбрана' : 'дата'}</strong>
                      <input
                        type="date"
                        min="2026-08-29"
                        value={isCustomDate ? date : ''}
                        onChange={(event) => setDate(event.target.value)}
                        aria-label="Выбрать другую дату"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <p className="field-label">Время встречи</p>
                  <div className="time-selector" role="group" aria-label="Во сколько встречаемся">
                    <label>
                      <span>Часы</span>
                      <select value={hour} onChange={(event) => setHour(event.target.value)}>
                        {hours.map((value) => <option value={value} key={value}>{value}</option>)}
                      </select>
                    </label>
                    <b aria-hidden="true">:</b>
                    <label>
                      <span>Минуты</span>
                      <select value={minute} onChange={(event) => setMinute(event.target.value)}>
                        {minutes.map((value) => <option value={value} key={value}>{value}</option>)}
                      </select>
                    </label>
                  </div>
                  <p className="time-current">Нажмите на часы или минуты · сейчас <strong>{time}</strong></p>
                </div>
                  </div>
                </fieldset>

                <div className="form-block conditional-block">
                  <label className="note-label" htmlFor="note">
                    <span><b>04</b> Небольшое пожелание</span>
                    <small>необязательно</small>
                  </label>
                  <textarea
                    id="note"
                    maxLength={280}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder={
                      activity === 'venue'
                        ? 'Например: хочется тихое место или лучше столик у окна'
                        : 'Например: лучше недолгая прогулка или хочется зайти за кофе'
                    }
                  />
                </div>
              </>
            )}
          </div>

          <aside className="summary-card" aria-live="polite">
            <p className="summary-kicker">Получается так</p>
            <dl>
              <div>
                <dt>Формат</dt>
                <dd>
                  {activity === 'outdoor'
                    ? 'Прогулка на улице'
                    : activity === 'venue'
                      ? 'Посидеть в заведении'
                      : 'ещё не выбран'}
                </dd>
              </div>
              <div>
                <dt>Место</dt>
                <dd>{selectedPlace?.name ?? 'ещё не выбрано'}</dd>
              </div>
              <div>
                <dt>Дата</dt>
                <dd>{date ? formatDate(date) : 'ещё не выбрана'}</dd>
              </div>
              <div>
                <dt>Время</dt>
                <dd>{time}</dd>
              </div>
              {activity === 'outdoor' && (
                <div>
                  <dt>Компания</dt>
                  <dd>{selectedCompany?.label ?? 'ещё не выбрано'}</dd>
                </div>
              )}
            </dl>
            <button className="submit-button" type="submit" disabled={!canSubmit}>
              Такой план подходит <span aria-hidden="true">→</span>
            </button>
            <p className="privacy-note">
              После подтверждения появится ссылка с выбранным планом — её можно
              отправить автору приглашения.
            </p>
          </aside>
        </form>
      </section>

      <footer>
        <span>Уфа</span>
        <p>Хорошая встреча не обязана быть сложной.</p>
        <span>Без дресс-кода</span>
      </footer>
    </main>
  );
}

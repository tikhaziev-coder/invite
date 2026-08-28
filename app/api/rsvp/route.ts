import { env } from 'cloudflare:workers';
import { createInviteResponsesIndex, createInviteResponsesTable } from '../../../db/schema';
import type { ActivityType, InviteAnswer } from '../../invite-data';

export const dynamic = 'force-dynamic';

const INVITATION_ID = 'invite-albina-ufa';
const ALLOWED_ORIGINS = new Set([
  'https://tikhaziev-coder.github.io',
  'https://invite-albina-ufa.makapon.chatgpt.site',
  'http://localhost:3000',
]);

type RuntimeBindings = {
  DB?: D1Database;
  ADMIN_VIEW_KEY?: string;
};

type StoredAnswer = {
  id: string;
  activity: ActivityType;
  activity_label: string;
  location_id: string;
  location_name: string;
  map_url: string;
  meeting_date: string;
  meeting_time: string;
  company: string;
  note: string;
  submitted_at: string;
};

function getRuntimeBindings() {
  return env as unknown as RuntimeBindings;
}

function getDatabase() {
  const database = getRuntimeBindings().DB;
  if (!database) throw new Error('D1 binding DB is not configured');
  return database;
}

async function ensureSchema(database: D1Database) {
  await database.batch([
    database.prepare(createInviteResponsesTable),
    database.prepare(createInviteResponsesIndex),
  ]);
}

function corsHeaders(request: Request) {
  const origin = request.headers.get('origin');
  const headers = new Headers({
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  });

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
  }

  return headers;
}

function json(request: Request, body: unknown, status = 200) {
  const headers = corsHeaders(request);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  return Response.json(body, { status, headers });
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function parseAnswer(value: unknown): InviteAnswer | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Record<string, unknown>;
  const activity = candidate.activity;
  if (activity !== 'outdoor' && activity !== 'venue') return null;

  const locationId = cleanText(candidate.locationId, 80);
  const locationName = cleanText(candidate.locationName, 160);
  const mapUrl = cleanText(candidate.mapUrl, 500);
  const date = cleanText(candidate.date, 10);
  const time = cleanText(candidate.time, 5);
  const note = cleanText(candidate.note, 280);
  const company = activity === 'outdoor' ? cleanText(candidate.company, 40) : '';

  if (!locationId || !locationName) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return null;
  }

  try {
    const parsedMapUrl = new URL(mapUrl);
    if (parsedMapUrl.protocol !== 'https:' || parsedMapUrl.hostname !== '2gis.ru') return null;
  } catch {
    return null;
  }

  if (activity === 'outdoor' && company !== 'Вдвоём' && company !== 'С собакой') {
    return null;
  }

  return {
    activity,
    activityLabel: activity === 'outdoor' ? 'Прогулка на улице' : 'Посидеть в заведении',
    locationId,
    locationName,
    mapUrl,
    date,
    time,
    company,
    note,
  };
}

function toPublicAnswer(row: StoredAnswer) {
  return {
    id: row.id,
    activity: row.activity,
    activityLabel: row.activity_label,
    locationId: row.location_id,
    locationName: row.location_name,
    mapUrl: row.map_url,
    date: row.meeting_date,
    time: row.meeting_time,
    company: row.company,
    note: row.note,
    submittedAt: row.submitted_at,
  };
}

function keyMatches(candidate: string, expected: string) {
  if (candidate.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < candidate.length; index += 1) {
    difference |= candidate.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return difference === 0;
}

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    if (rawBody.length > 4_000) return json(request, { error: 'Слишком большой ответ' }, 413);

    const answer = parseAnswer(JSON.parse(rawBody));
    if (!answer) return json(request, { error: 'Проверьте выбранные данные' }, 400);

    const database = getDatabase();
    await ensureSchema(database);

    await database
      .prepare(`
        INSERT INTO invite_responses (
          id, invitation_id, activity, activity_label, location_id, location_name,
          map_url, meeting_date, meeting_time, company, note, submitted_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        crypto.randomUUID(),
        INVITATION_ID,
        answer.activity,
        answer.activityLabel,
        answer.locationId,
        answer.locationName,
        answer.mapUrl,
        answer.date,
        answer.time,
        answer.company,
        answer.note,
        new Date().toISOString(),
      )
      .run();

    return json(request, { ok: true });
  } catch (error) {
    console.error('Failed to save RSVP', error);
    return json(request, { error: 'Не удалось сохранить ответ' }, 500);
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const candidateKey = requestUrl.searchParams.get('key') ?? '';
  const runtimeBindings = getRuntimeBindings();
  const adminKey = runtimeBindings.ADMIN_VIEW_KEY ?? process.env.ADMIN_VIEW_KEY ?? '';

  if (!adminKey) return json(request, { error: 'Страница владельца ещё не настроена' }, 503);
  if (!keyMatches(candidateKey, adminKey)) return json(request, { error: 'Доступ запрещён' }, 403);

  try {
    const database = getDatabase();
    await ensureSchema(database);
    const result = await database
      .prepare(`
        SELECT id, activity, activity_label, location_id, location_name, map_url,
               meeting_date, meeting_time, company, note, submitted_at
        FROM invite_responses
        WHERE invitation_id = ?
        ORDER BY submitted_at DESC
        LIMIT 25
      `)
      .bind(INVITATION_ID)
      .all<StoredAnswer>();
    const history = (result.results ?? []).map(toPublicAnswer);

    return json(request, { latest: history[0] ?? null, history });
  } catch (error) {
    console.error('Failed to read RSVP', error);
    return json(request, { error: 'Не удалось загрузить ответ' }, 500);
  }
}

export async function DELETE(request: Request) {
  const requestUrl = new URL(request.url);
  const candidateKey = requestUrl.searchParams.get('key') ?? '';
  const responseId = requestUrl.searchParams.get('id') ?? '';
  const runtimeBindings = getRuntimeBindings();
  const adminKey = runtimeBindings.ADMIN_VIEW_KEY ?? process.env.ADMIN_VIEW_KEY ?? '';

  if (!adminKey) return json(request, { error: 'Страница владельца ещё не настроена' }, 503);
  if (!keyMatches(candidateKey, adminKey)) return json(request, { error: 'Доступ запрещён' }, 403);
  if (!/^[0-9a-f-]{36}$/i.test(responseId)) {
    return json(request, { error: 'Не указан ответ для удаления' }, 400);
  }

  try {
    const database = getDatabase();
    await ensureSchema(database);
    const result = await database
      .prepare('DELETE FROM invite_responses WHERE invitation_id = ? AND id = ?')
      .bind(INVITATION_ID, responseId)
      .run();

    return json(request, { ok: true, deleted: result.meta.changes });
  } catch (error) {
    console.error('Failed to delete RSVP', error);
    return json(request, { error: 'Не удалось удалить ответ' }, 500);
  }
}

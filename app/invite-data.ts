export type ActivityType = 'outdoor' | 'venue';

export type InviteAnswer = {
  activity: ActivityType;
  activityLabel: string;
  locationId: string;
  locationName: string;
  mapUrl: string;
  date: string;
  time: string;
  company: string;
  note: string;
};

export type LocationOption = {
  id: string;
  number: string;
  name: string;
  mood: string;
  description: string;
  mapUrl: string;
  dogFriendly?: boolean;
};

export type VenueOption = {
  id: string;
  name: string;
  address: string;
  mood: string;
  mapUrl: string;
};

function mapSearch(query: string) {
  return `https://2gis.ru/ufa/search/${encodeURIComponent(query)}`;
}

export const locations: LocationOption[] = [
  {
    id: 'embankment',
    number: '01',
    name: 'Набережная Белой',
    mood: 'К воде',
    description: 'Длинный маршрут, открытый вид и кофе по пути.',
    mapUrl: mapSearch('Набережная реки Белой'),
  },
  {
    id: 'salavat-garden',
    number: '02',
    name: 'Сад Салавата Юлаева',
    mood: 'Тихий маршрут',
    description: 'Небольшой парк, старые аллеи и спокойный темп.',
    mapUrl: mapSearch('Сад Салавата Юлаева'),
  },
  {
    id: 'lesovodov',
    number: '03',
    name: 'Парк Лесоводов',
    mood: 'Побольше природы',
    description: 'Широкие дорожки и маршрут, который можно пройти с собакой.',
    mapUrl: mapSearch('Парк Лесоводов Башкирии'),
    dogFriendly: true,
  },
  {
    id: 'kashkadan',
    number: '04',
    name: 'Парк «Кашкадан»',
    mood: 'Вокруг озера',
    description: 'Круговой маршрут, вода и достаточно места для прогулки.',
    mapUrl: mapSearch('Парк Кашкадан'),
    dogFriendly: true,
  },
];

function makeVenue(
  id: string,
  name: string,
  address: string,
  mood: string,
  directMapUrl?: string,
): VenueOption {
  return {
    id,
    name,
    address,
    mood,
    mapUrl: directMapUrl ?? mapSearch(`${name} ${address}`),
  };
}

export const venues: VenueOption[] = [
  makeVenue(
    'casablanca',
    'Casablanca',
    'ул. Коммунистическая, 46',
    'уютный гастробар',
    'https://2gis.ru/ufa/firm/70000001025518588',
  ),
  makeVenue('avgust', 'Август', 'ул. Заки Валиди, 32/2', 'новое место'),
  makeVenue('azyk-tulek', 'Азык-Тулек', 'ул. Карла Маркса, 3Б', 'башкирская кухня'),
  makeVenue('bashkiria', 'Башкирия', 'ул. Ленина, 25/29', 'башкирская кухня'),
  makeVenue('vid-sverkhu', 'Вид сверху', 'ул. 50 лет СССР, 34', 'ужин на высоте'),
  makeVenue('goryachiy-tsekh', 'Горячий цех', 'ул. Чернышевского, 75', 'мясной ресторан'),
  makeVenue('duslyk', 'Дуслык', 'ул. Крупской, 9', 'восточная кухня'),
  makeVenue('dusha', 'Душа', 'ул. Революционная, 66', 'уютный ресторан'),
  makeVenue('lavr', 'Л.А.В.Р.', 'ул. Ленина, 75', 'новое место'),
  makeVenue('lyublyu-kharcho', 'Люблю харчо', 'ул. Коммунистическая, 47', 'грузинская кухня'),
  makeVenue('magadan', 'Магадан', 'ул. Менделеева, 137', 'рыба и морепродукты'),
  makeVenue('mone', 'Моне', 'Верхнеторговая пл., 1', 'веранда и коктейли'),
  makeVenue('myaso-myaso', 'Мясо Мясо', 'ул. Коммунистическая, 47', 'стейки'),
  makeVenue('nastroenie', 'Настроение', 'ул. Коммунистическая, 39', 'завтраки и вино'),
  makeVenue('pan-aziya-hogo', 'Пан Азия Hogo', 'ул. Октябрьской Революции, 3', 'паназиатская кухня'),
  makeVenue('ptitsy', 'Птицы', 'ул. Ленина, 75', 'красивые завтраки'),
  makeVenue('razzhigateli', 'Разжигатели', 'ул. Энтузиастов, 20', 'огонь и мясо'),
  makeVenue('ramen-mezhdu-nami', 'Рамен между нами', 'ул. Революционная, 129', 'рамен-бар'),
  makeVenue('syrovarnya-novikova', 'Сыроварня Новикова', 'просп. Октября, 81', 'итальянская кухня'),
  makeVenue('tone', 'Тонэ', 'ул. Первомайская, 67/1', 'грузинская кухня'),
  makeVenue('kholodets', 'Холодец', 'ул. Комсомольская, 105', 'мясной ресторан'),
  makeVenue('tsaplya', 'Цапля', 'ул. Чернышевского, 88', 'завтраки и бистро'),
  makeVenue('chernoe-more', 'Черное море', 'ул. Цюрупы, 16', 'южная кухня'),
  makeVenue('beanhearts', 'Beanhearts', 'ул. Цюрупы, 12', 'уют и десерты'),
  makeVenue('cherie', 'Chérie', 'ул. Ленина, 20/2', 'французское бистро'),
  makeVenue('chinki-izakaya', 'Chinki Izakaya', 'ул. Гоголя, 60/1 к5', 'японский бар'),
  makeVenue('crabcafe', 'CrabCafe', 'ул. Цюрупы, 75', 'морепродукты'),
  makeVenue('dom', 'Dom', 'ул. Чернышевского, 69', 'особняк-ресторан'),
  makeVenue('efendi', 'Efendi', 'ул. Чернышевского, 71', 'турецкая кухня'),
  makeVenue('el-machete', 'El Machete', 'ул. Коммунистическая, 47', 'мясо и коктейли'),
  makeVenue('frank-by-basta', 'Frank by Баста', 'Верхнеторговая пл., 6', 'рёбра и музыка'),
  makeVenue('hedonist', 'Hedonist', 'ул. Чернышевского, 75', 'светское место'),
  makeVenue('honey', 'Honey', 'ул. Октябрьской Революции, 78', 'башкирская кухня'),
  makeVenue('kumpan-terra', 'Kumpan Terra', 'ул. 50-летия Октября, 20', 'локальная кухня'),
  makeVenue('la-bottega', 'La Bottega', 'ул. Ленина, 20/1', 'итальянская кухня'),
  makeVenue('marco-polo', 'Marco Polo', 'ул. Чернышевского, 75', 'нарядный ужин'),
  makeVenue('maverick', 'Maverick Bar & BBQ', 'ул. Чернышевского, 88/1', 'барбекю'),
  makeVenue('novum-taganok', 'Novum Taganok', 'ул. Цюрупы, 7', 'новая Башкирия'),
  makeVenue('ottoman', 'Ottoman', 'ул. Чернышевского, 69', 'турецкий колорит'),
  makeVenue('panini', 'Panini', 'ул. Чернышевского, 88/1', 'панорамные окна'),
  makeVenue('pecorino', 'Pecorino', 'ул. Цюрупы, 78', 'итальянское бистро'),
  makeVenue('riso', 'Riso', 'ул. Чернышевского, 88', 'паназиатская кухня'),
  makeVenue('rossinsky', 'Rossinsky', 'ул. Цюрупы, 7', 'ужин у камина'),
  makeVenue('salt-bistro', 'Salt. bistro', 'ул. Чернышевского, 88', 'вино и авторская кухня'),
  makeVenue('sherlock-holmes', 'Sherlock Holmes', 'ул. Чернышевского, 75', 'паб и стейки'),
  makeVenue('sky-lounge', 'Sky Lounge', 'ул. Цюрупы, 7', 'вид на город'),
  makeVenue('the-borshch', 'THE БОРЩ', 'ул. Комсомольская, 15', 'русская кухня'),
  makeVenue('other', 'Другое место', 'Предложу свой вариант', 'полная свобода'),
];

export const companyOptions = [
  { id: 'together', label: 'Вдвоём' },
  { id: 'with-dog', label: 'С собакой' },
];

export function formatDate(dateValue: string) {
  if (!dateValue) return 'дата не выбрана';
  const [year, month, day] = dateValue.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

export function encodeAnswer(answer: InviteAnswer) {
  const bytes = new TextEncoder().encode(JSON.stringify(answer));
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function decodeAnswer(token: string): InviteAnswer | null {
  try {
    const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as InviteAnswer;

    if (
      !parsed.activity ||
      !parsed.activityLabel ||
      !parsed.locationId ||
      !parsed.locationName ||
      !parsed.mapUrl ||
      !parsed.date ||
      !parsed.time
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

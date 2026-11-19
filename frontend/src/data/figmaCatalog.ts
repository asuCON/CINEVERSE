import { CardItem } from '../components/MovieCard';

export interface FigmaMovie extends CardItem {
  tagline: string;
  synopsis: string;
  duration: string;
  rating: number;
  quality: string;
  keywords?: string[];
  director?: string;
  cast?: string[];
  trailer_youtube_key?: string;
  overview?: string;
  runtime?: string;
}

export const HERO_FEATURED_MOVIE: FigmaMovie = {
  id: 'last-frontier',
  title: 'THE LAST FRONTIER',
  genre: 'Sci-Fi / Adventure',
  year: 2026,
  duration: '2h 08m',
  rating: 8.9,
  quality: '4K',
  theme: 'crimson',
  tagline: 'At the edge of the known universe, the biggest mystery is what we leave behind.',
  synopsis: 'At the edge of the known universe, the biggest mystery is what we leave behind. An expedition beyond the Kuiper belt uncovers remnants of an impossible civilization.',
  director: 'Elena Vance',
  cast: ['Marcus Cole', 'Sarah Chen', 'David Oyelowo']
};

export const PICKED_FOR_YOU_MOVIES: FigmaMovie[] = [
  {
    id: 'orbital',
    title: 'ORBITAL',
    genre: 'Sci-Fi',
    year: 2025,
    duration: '2h 14m',
    rating: 8.7,
    quality: '4K',
    theme: 'purple',
    tagline: 'When a deep-space signal repeats a message that has not yet been sent, one crew must decide whether the future can be changed.',
    synopsis: 'When a deep-space signal repeats a message that has not yet been sent, one crew must decide whether the future can be changed.',
    director: 'Claire Denis',
    cast: ['Alexander Skarsgard', 'Eva Green']
  },
  {
    id: 'afterglow',
    title: 'AFTERGLOW',
    genre: 'Drama',
    year: 2024,
    duration: '1h 56m',
    rating: 8.4,
    quality: '4K',
    theme: 'crimson',
    tagline: 'Memory is the last sanctuary of the human spirit.',
    synopsis: 'In a world where memories can be saved to tape, an archivist finds an undocumented year of her own life.',
    director: 'Charlotte Wells',
    cast: ['Paul Mescal', 'Rebecca Hall']
  },
  {
    id: 'redline',
    title: 'REDLINE',
    genre: 'Thriller',
    year: 2026,
    duration: '2h 01m',
    rating: 8.5,
    quality: '4K',
    theme: 'darkRed',
    tagline: 'Speed is not a choice. It is survival.',
    synopsis: 'High-stakes undercover operatives push a covert cyber-smuggling route past the breaking point.',
    director: 'Denis Villeneuve',
    cast: ['Oscar Isaac', 'Florence Pugh']
  },
  {
    id: 'blue-hour',
    title: 'BLUE HOUR',
    genre: 'Drama',
    year: 2025,
    duration: '1h 48m',
    rating: 8.1,
    quality: '4K',
    theme: 'navy',
    tagline: 'Between dusk and the night, truths arise.',
    synopsis: 'Two strangers find unexpected solace in an airport transit lounge during an indefinite blizzard delay.',
    director: 'Hirokazu Kore-eda',
    cast: ['Song Kang-ho', 'Gong Li']
  },
  {
    id: 'wildfire',
    title: 'WILDFIRE',
    genre: 'Action',
    year: 2026,
    duration: '2h 12m',
    rating: 8.3,
    quality: '4K',
    theme: 'bronze',
    tagline: 'When the line burns, you cross it.',
    synopsis: 'Elite wildfire jumpers uncover an underground facility engulfed in flames in the deep Pacific Northwest.',
    director: 'Joseph Kosinski',
    cast: ['Tom Hardy', 'Danai Gurira']
  },
  {
    id: 'night-shift',
    title: 'NIGHT SHIFT',
    genre: 'Mystery',
    year: 2024,
    duration: '1h 42m',
    rating: 8.2,
    quality: '4K',
    theme: 'slate',
    tagline: 'Silence has a frequency.',
    synopsis: 'A late-night radio host begins receiving calls from listeners who claim tomorrow has already happened.',
    director: 'David Fincher',
    cast: ['Riz Ahmed', 'Carey Mulligan']
  }
];

export const SEARCH_EXTRA_MOVIES: FigmaMovie[] = [
  {
    id: 'the-signal',
    title: 'THE SIGNAL',
    genre: 'Mystery',
    year: 2025,
    duration: '1h 55m',
    rating: 8.4,
    quality: '4K',
    theme: 'navy',
    tagline: 'Some frequencies are not meant to be decoded.',
    synopsis: 'An isolated listening post in Antarctica picks up an artificial rhythmic pulse emanating from deep within the ice shelf.',
  },
  {
    id: 'no-return',
    title: 'NO RETURN',
    genre: 'Action',
    year: 2026,
    duration: '2h 05m',
    rating: 8.0,
    quality: '4K',
    theme: 'darkRed',
    tagline: 'The bridge has fallen.',
    synopsis: 'Trapped across enemy lines after a sudden treaty collapse, a tactical team must fight their way home.',
  },
  {
    id: 'the-last-star',
    title: 'THE LAST STAR',
    genre: 'Sci-Fi',
    year: 2025,
    duration: '2h 20m',
    rating: 8.6,
    quality: '4K',
    theme: 'purple',
    tagline: 'A journey toward the dying light of the universe.',
    synopsis: 'In the twilight epoch of stellar formation, an exploration vessel seeks the final luminous beacon in the galaxy.',
  }
];

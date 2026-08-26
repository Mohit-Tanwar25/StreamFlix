import { MovieType, TVShowType, MediaItem } from "@/types";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export const getImageUrl = (path: string | null | undefined, size: "w500" | "original" | "w780" | "w1280" = "original") => {
  if (!path) return "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80";
  if (path.startsWith("http")) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const SAMPLE_FALLBACK_MOVIES: MovieType[] = [
  {
    id: "m-1",
    tmdbId: 157336,
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth faces catastrophic blight.",
    poster: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    releaseDate: "2014-11-07",
    duration: 169,
    rating: 8.7,
    maturityRating: "PG-13",
    type: "movie",
    featured: true,
    trending: true,
    genres: [{ genre: { id: "g-scifi", name: "Sci-Fi" } }, { genre: { id: "g-drama", name: "Drama" } }],
  },
  {
    id: "m-2",
    tmdbId: 27205,
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    releaseDate: "2010-07-16",
    duration: 148,
    rating: 8.8,
    maturityRating: "PG-13",
    type: "movie",
    featured: true,
    trending: true,
    genres: [{ genre: { id: "g-action", name: "Action" } }, { genre: { id: "g-scifi", name: "Sci-Fi" } }],
  },
  {
    id: "m-3",
    tmdbId: 155,
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    releaseDate: "2008-07-18",
    duration: 152,
    rating: 9.0,
    maturityRating: "PG-13",
    type: "movie",
    featured: false,
    trending: true,
    genres: [{ genre: { id: "g-action", name: "Action" } }, { genre: { id: "g-crime", name: "Crime" } }],
  },
  {
    id: "m-4",
    tmdbId: 496243,
    title: "Parasite",
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=1920&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=5xH0hhJLEEQ",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    releaseDate: "2019-10-11",
    duration: 132,
    rating: 8.5,
    maturityRating: "R",
    type: "movie",
    featured: false,
    trending: true,
    genres: [{ genre: { id: "g-drama", name: "Drama" } }, { genre: { id: "g-thriller", name: "Thriller" } }],
  },
  {
    id: "m-5",
    tmdbId: 693134,
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    releaseDate: "2024-03-01",
    duration: 166,
    rating: 8.6,
    maturityRating: "PG-13",
    type: "movie",
    featured: true,
    trending: true,
    genres: [{ genre: { id: "g-scifi", name: "Sci-Fi" } }, { genre: { id: "g-action", name: "Action" } }],
  },
  {
    id: "m-6",
    tmdbId: 299534,
    title: "Avengers: Endgame",
    description: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions.",
    poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=1920&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    releaseDate: "2019-04-26",
    duration: 181,
    rating: 8.4,
    maturityRating: "PG-13",
    type: "movie",
    featured: false,
    trending: true,
    genres: [{ genre: { id: "g-action", name: "Action" } }, { genre: { id: "g-scifi", name: "Sci-Fi" } }],
  },
];

export const SAMPLE_FALLBACK_SHOWS: TVShowType[] = [
  {
    id: "s-1",
    tmdbId: 66732,
    title: "Stranger Things",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=b9EkMc79ZSU",
    rating: 8.6,
    maturityRating: "TV-14",
    releaseDate: "2016-07-15",
    featured: true,
    trending: true,
    genres: [{ genre: { id: "g-scifi", name: "Sci-Fi" } }, { genre: { id: "g-drama", name: "Drama" } }],
    seasons: [
      {
        id: "season-1",
        seasonNumber: 1,
        title: "Season 1",
        tvShowId: "s-1",
        episodes: [
          {
            id: "ep-1-1",
            episodeNumber: 1,
            title: "Chapter One: The Vanishing of Will Byers",
            description: "On his way home from a friend's house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.",
            thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            duration: 48,
            seasonId: "season-1",
          },
          {
            id: "ep-1-2",
            episodeNumber: 2,
            title: "Chapter Two: The Weirdo on Maple Street",
            description: "Lucas, Mike and Dustin try to talk to the girl they found in the woods. Hopper questions an anxious Joyce about an unsettling phone call.",
            thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            duration: 55,
            seasonId: "season-1",
          },
        ],
      },
    ],
  },
  {
    id: "s-2",
    tmdbId: 1399,
    title: "Game of Thrones",
    description: "Nine noble families fight for control over the mythical lands of Westeros, while an ancient enemy returns after being dormant for thousands of years.",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop&q=80",
    trailerUrl: "https://www.youtube.com/watch?v=KPLWWIOCOOQ",
    rating: 9.2,
    maturityRating: "TV-MA",
    releaseDate: "2011-04-17",
    featured: false,
    trending: true,
    genres: [{ genre: { id: "g-action", name: "Action" } }, { genre: { id: "g-drama", name: "Drama" } }],
    seasons: [
      {
        id: "season-2-1",
        seasonNumber: 1,
        title: "Season 1",
        tvShowId: "s-2",
        episodes: [
          {
            id: "ep-2-1",
            episodeNumber: 1,
            title: "Winter Is Coming",
            description: "Lord Ned Stark is torn between his family and an old friend when the King asks him to serve as the new Hand of the King.",
            thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            duration: 62,
            seasonId: "season-2-1",
          },
        ],
      },
    ],
  },
];

export async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}) {
  if (!TMDB_API_KEY) {
    return null;
  }

  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: "en-US",
    ...params,
  });

  try {
    const res = await fetch(`${TMDB_BASE_URL}${endpoint}?${queryParams.toString()}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`TMDB API request failed: ${res.status} ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("TMDB Fetch Error:", error);
    return null;
  }
}

export async function getTrendingContent(): Promise<MediaItem[]> {
  const data = await fetchFromTMDB("/trending/all/day");
  if (data?.results) {
    return data.results.map((item: any) => ({
      id: String(item.id),
      tmdbId: item.id,
      title: item.title || item.name,
      description: item.overview,
      poster: getImageUrl(item.poster_path, "w500"),
      backdrop: getImageUrl(item.backdrop_path, "original"),
      mediaType: item.media_type === "tv" ? "tv" : "movie",
      rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 0,
      releaseDate: item.release_date || item.first_air_date,
      maturityRating: item.adult ? "R" : "PG-13",
      videoUrl: process.env.DEFAULT_VIDEO_URL || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    }));
  }

  return SAMPLE_FALLBACK_MOVIES.map((m) => ({
    id: m.id,
    tmdbId: m.tmdbId,
    title: m.title,
    description: m.description,
    poster: m.poster,
    backdrop: m.backdrop,
    mediaType: "movie" as const,
    rating: m.rating,
    releaseDate: m.releaseDate,
    duration: m.duration,
    maturityRating: m.maturityRating,
    trailerUrl: m.trailerUrl,
    videoUrl: m.videoUrl,
  }));
}

export async function getPopularMovies(): Promise<MovieType[]> {
  const data = await fetchFromTMDB("/movie/popular");
  if (data?.results) {
    return data.results.map((item: any) => ({
      id: String(item.id),
      tmdbId: item.id,
      title: item.title,
      description: item.overview,
      poster: getImageUrl(item.poster_path, "w500"),
      backdrop: getImageUrl(item.backdrop_path, "original"),
      releaseDate: item.release_date,
      rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 0,
      maturityRating: item.adult ? "R" : "PG-13",
      type: "movie",
      videoUrl: process.env.DEFAULT_VIDEO_URL || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    }));
  }
  return SAMPLE_FALLBACK_MOVIES;
}

export async function getTopRatedMovies(): Promise<MovieType[]> {
  const data = await fetchFromTMDB("/movie/top_rated");
  if (data?.results) {
    return data.results.map((item: any) => ({
      id: String(item.id),
      tmdbId: item.id,
      title: item.title,
      description: item.overview,
      poster: getImageUrl(item.poster_path, "w500"),
      backdrop: getImageUrl(item.backdrop_path, "original"),
      releaseDate: item.release_date,
      rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 0,
      maturityRating: item.adult ? "R" : "PG-13",
      type: "movie",
      videoUrl: process.env.DEFAULT_VIDEO_URL || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    }));
  }
  return SAMPLE_FALLBACK_MOVIES.slice().reverse();
}

export async function getPopularTVShows(): Promise<TVShowType[]> {
  const data = await fetchFromTMDB("/tv/popular");
  if (data?.results) {
    return data.results.map((item: any) => ({
      id: String(item.id),
      tmdbId: item.id,
      title: item.name,
      description: item.overview,
      poster: getImageUrl(item.poster_path, "w500"),
      backdrop: getImageUrl(item.backdrop_path, "original"),
      releaseDate: item.first_air_date,
      rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 0,
      maturityRating: "TV-MA",
      trailerUrl: null,
    }));
  }
  return SAMPLE_FALLBACK_SHOWS;
}

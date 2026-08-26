export type Role = "USER" | "ADMIN";

export interface SafeUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: Role | string;
  createdAt: string;
}

export interface ProfileType {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GenreType {
  id: string;
  name: string;
  tmdbId?: number | null;
}

export interface MovieType {
  id: string;
  tmdbId?: number | null;
  title: string;
  description: string;
  poster: string;
  backdrop: string;
  trailerUrl?: string | null;
  videoUrl?: string | null;
  releaseDate?: string | Date | null;
  duration?: number | null;
  rating?: number | null;
  maturityRating?: string | null;
  type?: string;
  featured?: boolean;
  trending?: boolean;
  genres?: { genre: GenreType }[] | GenreType[];
  watchHistory?: WatchHistoryType[];
  isWatchlisted?: boolean;
  userRating?: number;
}

export interface EpisodeType {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  seasonId: string;
  watchHistory?: WatchHistoryType[];
}

export interface SeasonType {
  id: string;
  seasonNumber: number;
  title: string;
  tvShowId: string;
  episodes: EpisodeType[];
}

export interface TVShowType {
  id: string;
  tmdbId?: number | null;
  title: string;
  description: string;
  poster: string;
  backdrop: string;
  trailerUrl?: string | null;
  rating?: number | null;
  maturityRating?: string | null;
  releaseDate?: string | Date | null;
  featured?: boolean;
  trending?: boolean;
  genres?: { genre: GenreType }[] | GenreType[];
  seasons?: SeasonType[];
  isWatchlisted?: boolean;
  userRating?: number;
}

export interface MediaItem extends Partial<MovieType>, Partial<TVShowType> {
  id: string;
  title: string;
  description: string;
  poster: string;
  backdrop: string;
  mediaType: "movie" | "tv";
  rating?: number | null;
  releaseDate?: string | Date | null;
  duration?: number | null;
  maturityRating?: string | null;
  trailerUrl?: string | null;
  videoUrl?: string | null;
  progress?: number;
  totalDuration?: number;
  completed?: boolean;
}

export interface WatchHistoryType {
  id: string;
  profileId: string;
  movieId?: string | null;
  episodeId?: string | null;
  progress: number;
  duration: number;
  completed: boolean;
  updatedAt: string | Date;
  movie?: MovieType | null;
  episode?: EpisodeType | null;
}

export interface WatchlistType {
  id: string;
  profileId: string;
  movieId?: string | null;
  tvShowId?: string | null;
  movie?: MovieType | null;
  tvShow?: TVShowType | null;
  createdAt: string | Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  priceAmount: number;
  quality: string;
  resolution: string;
  devices: number;
  popular?: boolean;
  features: string[];
  stripePriceId?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalMovies: number;
  totalShows: number;
  activeSubscriptions: number;
  totalRevenue: number;
  watchSessions: number;
}

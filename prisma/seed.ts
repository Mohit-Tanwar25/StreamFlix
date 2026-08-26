import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_VIDEO_1 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const DEMO_VIDEO_2 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
const DEMO_VIDEO_3 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
const DEMO_VIDEO_4 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";
const DEMO_VIDEO_5 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";
const DEMO_VIDEO_6 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4";

async function main() {
  console.log("🎬 Starting StreamFlix database seed...");

  // Clean existing data
  await prisma.watchHistory.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.season.deleteMany();
  await prisma.tvShowGenre.deleteMany();
  await prisma.movieGenre.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.tvShow.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create Genres
  const genresData = [
    { name: "Action", tmdbId: 28 },
    { name: "Sci-Fi", tmdbId: 878 },
    { name: "Drama", tmdbId: 18 },
    { name: "Thriller", tmdbId: 53 },
    { name: "Comedy", tmdbId: 35 },
    { name: "Crime", tmdbId: 80 },
    { name: "Adventure", tmdbId: 12 },
    { name: "Animation", tmdbId: 16 },
    { name: "Fantasy", tmdbId: 14 },
    { name: "Horror", tmdbId: 27 },
  ];

  const createdGenres: Record<string, any> = {};
  for (const g of genresData) {
    const genre = await prisma.genre.create({
      data: {
        name: g.name,
        tmdbId: g.tmdbId,
      },
    });
    createdGenres[g.name] = genre;
  }
  console.log("✅ Seeded genres");

  // Create Users
  const adminPassword = await bcrypt.hash("AdminPass123!", 10);
  const demoPassword = await bcrypt.hash("DemoPass123!", 10);

  const adminUser = await prisma.user.create({
    data: {
      name: "Admin StreamFlix",
      email: "admin@streamflix.com",
      password: adminPassword,
      role: "ADMIN",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: "Mohit Demo",
      email: "demo@streamflix.com",
      password: demoPassword,
      role: "USER",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  });

  // Create Profiles
  const profileAdmin = await prisma.profile.create({
    data: {
      name: "Admin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      userId: adminUser.id,
      isKids: false,
    },
  });

  const profileMohit = await prisma.profile.create({
    data: {
      name: "Mohit",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      userId: demoUser.id,
      isKids: false,
    },
  });

  const profileFamily = await prisma.profile.create({
    data: {
      name: "Family",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      userId: demoUser.id,
      isKids: false,
    },
  });

  const profileKids = await prisma.profile.create({
    data: {
      name: "Kids Corner",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
      userId: demoUser.id,
      isKids: true,
    },
  });
  console.log("✅ Seeded users and profiles");

  // Create Movies
  const moviesData = [
    {
      id: "movie-interstellar",
      tmdbId: 157336,
      title: "Interstellar",
      description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
      poster: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80",
      backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop&q=80",
      trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
      videoUrl: DEMO_VIDEO_1,
      releaseDate: new Date("2014-11-07"),
      duration: 169,
      rating: 8.7,
      maturityRating: "PG-13",
      type: "movie",
      featured: true,
      trending: true,
      genres: ["Sci-Fi", "Drama", "Adventure"],
    },
    {
      id: "movie-inception",
      tmdbId: 27205,
      title: "Inception",
      description: "Dom Cobb is a skilled thief who steals valuable secrets from deep within the subconscious during the dream state. Given a chance at redemption, he must execute the inverse task: planting an idea.",
      poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
      backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=80",
      trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
      videoUrl: DEMO_VIDEO_2,
      releaseDate: new Date("2010-07-16"),
      duration: 148,
      rating: 8.8,
      maturityRating: "PG-13",
      type: "movie",
      featured: true,
      trending: true,
      genres: ["Action", "Sci-Fi", "Thriller"],
    },
    {
      id: "movie-dark-knight",
      tmdbId: 155,
      title: "The Dark Knight",
      description: "Batman raises the stakes in his war on crime. With the help of allies Lt. Jim Gordon and DA Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
      poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80",
      backdrop: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&auto=format&fit=crop&q=80",
      trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
      videoUrl: DEMO_VIDEO_3,
      releaseDate: new Date("2008-07-18"),
      duration: 152,
      rating: 9.0,
      maturityRating: "PG-13",
      type: "movie",
      featured: false,
      trending: true,
      genres: ["Action", "Crime", "Drama"],
    },
    {
      id: "movie-dune-2",
      tmdbId: 693134,
      title: "Dune: Part Two",
      description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between love and the fate of the universe.",
      poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
      backdrop: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&auto=format&fit=crop&q=80",
      trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
      videoUrl: DEMO_VIDEO_5,
      releaseDate: new Date("2024-03-01"),
      duration: 166,
      rating: 8.6,
      maturityRating: "PG-13",
      type: "movie",
      featured: true,
      trending: true,
      genres: ["Sci-Fi", "Adventure", "Action"],
    },
    {
      id: "movie-cyber-odyssey",
      tmdbId: 998811,
      title: "Cyber Odyssey: 2099",
      description: "In a neon-drenched metropolis governed by synthetic intelligences, a rogue cyber-detective uncovers a simulation glitch that threatens to rewrite human consciousness.",
      poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
      backdrop: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&auto=format&fit=crop&q=80",
      trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
      videoUrl: DEMO_VIDEO_4,
      releaseDate: new Date("2023-11-15"),
      duration: 135,
      rating: 8.4,
      maturityRating: "R",
      type: "movie",
      featured: false,
      trending: true,
      genres: ["Sci-Fi", "Action", "Thriller"],
    },
    {
      id: "movie-silent-abyss",
      tmdbId: 887722,
      title: "The Silent Abyss",
      description: "A deep-sea scientific expedition discovers an ancient dormant leviathan beneath the Mariana Trench, awakening forces beyond human comprehension.",
      poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80",
      backdrop: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=1920&auto=format&fit=crop&q=80",
      trailerUrl: "https://www.youtube.com/watch?v=5xH0hhJLEEQ",
      videoUrl: DEMO_VIDEO_6,
      releaseDate: new Date("2022-08-20"),
      duration: 124,
      rating: 7.9,
      maturityRating: "PG-13",
      type: "movie",
      featured: false,
      trending: false,
      genres: ["Horror", "Sci-Fi", "Drama"],
    },
  ];

  for (const m of moviesData) {
    const { genres, ...movieProps } = m;
    const movie = await prisma.movie.create({
      data: movieProps,
    });

    for (const gName of genres) {
      const g = createdGenres[gName];
      if (g) {
        await prisma.movieGenre.create({
          data: {
            movieId: movie.id,
            genreId: g.id,
          },
        });
      }
    }
  }
  console.log("✅ Seeded movies with genre relationships");

  // Create TV Shows with Seasons & Episodes
  const show1 = await prisma.tvShow.create({
    data: {
      id: "show-stranger-echoes",
      tmdbId: 66732,
      title: "Stranger Echoes",
      description: "When a young prodigy vanishes without a trace in a foggy lakeside town, his friends uncover a web of clandestine government experiments and an otherworldly parallel dimension.",
      poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
      backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=80",
      trailerUrl: "https://www.youtube.com/watch?v=b9EkMc79ZSU",
      rating: 8.9,
      maturityRating: "TV-14",
      releaseDate: new Date("2021-06-18"),
      featured: true,
      trending: true,
    },
  });

  await prisma.tvShowGenre.create({
    data: { tvShowId: show1.id, genreId: createdGenres["Sci-Fi"].id },
  });
  await prisma.tvShowGenre.create({
    data: { tvShowId: show1.id, genreId: createdGenres["Drama"].id },
  });

  const show1Season1 = await prisma.season.create({
    data: {
      id: "season-echoes-s1",
      seasonNumber: 1,
      title: "Season 1: The Breach",
      tvShowId: show1.id,
    },
  });

  await prisma.episode.create({
    data: {
      id: "ep-echoes-101",
      episodeNumber: 1,
      title: "Chapter 1: The Signal Lost",
      description: "Late at night in Hawk Valley, an astronomical observatory intercepts a cryptic resonance frequency just as a high school senior disappears.",
      thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      videoUrl: DEMO_VIDEO_1,
      duration: 52,
      seasonId: show1Season1.id,
    },
  });

  await prisma.episode.create({
    data: {
      id: "ep-echoes-102",
      episodeNumber: 2,
      title: "Chapter 2: The Void Beneath",
      description: "Armed with radio gear and field sensors, the group heads into the forbidden Pine Ridge preserve and uncovers an underground magnetic facility.",
      thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
      videoUrl: DEMO_VIDEO_2,
      duration: 49,
      seasonId: show1Season1.id,
    },
  });

  const show2 = await prisma.tvShow.create({
    data: {
      id: "show-realm-of-shadows",
      tmdbId: 1399,
      title: "Realm of Shadows",
      description: "Dynasties clash for the Obsidian Throne in a dark medieval fantasy realm while an ancient supernatural winter army approaches from beyond the wall.",
      poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
      backdrop: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&auto=format&fit=crop&q=80",
      trailerUrl: "https://www.youtube.com/watch?v=KPLWWIOCOOQ",
      rating: 9.3,
      maturityRating: "TV-MA",
      releaseDate: new Date("2020-04-12"),
      featured: false,
      trending: true,
    },
  });

  await prisma.tvShowGenre.create({
    data: { tvShowId: show2.id, genreId: createdGenres["Fantasy"].id },
  });
  await prisma.tvShowGenre.create({
    data: { tvShowId: show2.id, genreId: createdGenres["Drama"].id },
  });

  const show2Season1 = await prisma.season.create({
    data: {
      id: "season-realm-s1",
      seasonNumber: 1,
      title: "Season 1: Iron & Ash",
      tvShowId: show2.id,
    },
  });

  await prisma.episode.create({
    data: {
      id: "ep-realm-101",
      episodeNumber: 1,
      title: "Crown of Wolves",
      description: "Lord Brandon of the Northern Reach receives an urgent raven from the High King bearing an ominous prophecy.",
      thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
      videoUrl: DEMO_VIDEO_3,
      duration: 61,
      seasonId: show2Season1.id,
    },
  });
  console.log("✅ Seeded TV shows, seasons, and episodes");

  // Create Watch History for Mohit's profile (Continue Watching demonstration)
  await prisma.watchHistory.create({
    data: {
      profileId: profileMohit.id,
      movieId: "movie-interstellar",
      progress: 3600, // 1 hour into movie
      duration: 10140, // 169 minutes in seconds
      completed: false,
    },
  });

  await prisma.watchHistory.create({
    data: {
      profileId: profileMohit.id,
      movieId: "movie-inception",
      progress: 5400, // 90 minutes into movie
      duration: 8880,
      completed: false,
    },
  });

  // Create Watchlist for Mohit
  await prisma.watchlist.create({
    data: {
      profileId: profileMohit.id,
      movieId: "movie-dune-2",
    },
  });
  await prisma.watchlist.create({
    data: {
      profileId: profileMohit.id,
      tvShowId: show1.id,
    },
  });

  // Create Ratings
  await prisma.rating.create({
    data: {
      profileId: profileMohit.id,
      movieId: "movie-interstellar",
      rating: 5,
    },
  });

  // Create Active Subscription for Demo User
  await prisma.subscription.create({
    data: {
      userId: demoUser.id,
      stripeCustomerId: "cus_demo123456",
      stripeSubscriptionId: "sub_demo123456",
      plan: "Premium",
      status: "active",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Create Payment record
  await prisma.payment.create({
    data: {
      userId: demoUser.id,
      stripePaymentId: "pi_demo123456",
      amount: 1999,
      currency: "usd",
      status: "succeeded",
    },
  });

  console.log("✨ Database seed completed successfully!");
  console.log("-----------------------------------------");
  console.log("Admin Account: admin@streamflix.com / AdminPass123!");
  console.log("Demo Account:  demo@streamflix.com  / DemoPass123!");
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error("Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

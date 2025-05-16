import { Button } from "@/components/ui/button";
import { AnimeCard } from "@/components/landing/anime-card";
import Link from "next/link";

const currentAnime = [
  {
    title: "Death Parade",
    episode: "Finished",
    description:
      "After death, some souls go to Quindecim wher arbiter Decim judges them through death games for reincarnation or the void.",
    image: "/placeholder.svg?height=250&width=180&text=Demon+Slayer",
  },
  {
    title: "Tomo-Chan is a girl",
    episode: "Finished",
    description:
      "Tomboy Tomo is in love with her best friend Jun, but he sees her as a brother. She tries to make him see her romantically.",
    image: "/placeholder.svg?height=250&width=180&text=My+Hero+Academia",
  },
  {
    title: "Fire Force",
    episode: "Season 1 Finished",
    description:
      "Spontaneous Human Combustion causes Infernals; pyrokinetics can control fire. The Special Fire Force fights Infernals and seeks the cause.",
    image: "/placeholder.svg?height=250&width=180&text=Spy+x+Family",
  },
];

export function NowStreaming() {
  return (
    <section className="w-full py-12 md:py-16 overflow-hidden">
      <div className="container w-full max-w-full px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-6 md:mb-8">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-yellow-200 px-3 py-1 text-sm border border-black md:border-2">
              NOW STREAMING
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              This Week's Anime
            </h2>
            <p className="max-w-[700px] text-gray-800 md:text-lg">
              Join us every Wednesday at 6PM in Lecture Theatre G for our weekly
              anime screenings!
            </p>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl border-4 md:border-8 border-black bg-white p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="absolute z-10 -top-3 rotate-3 -right-3 md:-top-4 md:-right-4 bg-pink-500 px-3 md:px-4 py-1 md:py-2 text-white text-base md:text-lg font-bold border-2 md:border-4 border-black">
            WEDNESDAY 6PM
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {currentAnime.map((anime, index) => (
              <AnimeCard
                key={index}
                title={anime.title}
                episode={anime.episode}
                description={anime.description}
                image={anime.image}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="font-medium mb-4">
              Don't worry if you've missed previous episodes - you have plenty
              of time to catch-up!
            </p>
            <Button
              asChild
              className="bg-purple-500 hover:bg-purple-600 text-white border border-black md:border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm md:text-base"
            >
              <Link href="/calendar">View Full Schedule</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

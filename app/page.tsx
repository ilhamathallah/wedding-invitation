import Countdown from "@/components/Countdown";
import Couple from "@/components/Couple";
import EventDetails from "@/components/EventDetails";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import LoveStory from "@/components/LoveStory";
import Reveal from "@/components/Reveal";
import WishWall from "@/components/WishWall";
import { wedding } from "@/lib/config";

// Personal link per guest: https://your-domain.com/?to=Budi+Santoso
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ to?: string }>;
}) {
  const { to } = await searchParams;
  const guest = to?.slice(0, 60);

  return (
    <main>
      <Hero guest={guest} />

      <Couple />
      <LoveStory />

      <Countdown date={wedding.date} />
        
      <EventDetails />
      <Gallery />

      <section id="wishes" className="section">
        <Reveal className="mb-12 text-center">
          <h2 className="heading">Wishes</h2>
          <p className="mt-4 text-ink/60">Leave a message for the couple.</p>
        </Reveal>
        <WishWall guest={guest} />
      </section>

      <footer className="px-6 pb-16 pt-8 text-center">
        <p className="font-display text-3xl italic">
          {wedding.couple.a} & {wedding.couple.b}
        </p>
        <p className="mt-2 text-sm text-ink/50">{wedding.displayDate}</p>
      </footer>
    </main>
  );
}

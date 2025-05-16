import { ImageIcon } from "lucide-react";
import { SectionContainer } from "../section-container";
import { SectionHeading } from "../section-heading";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

export default function GallerySection() {
  return (
    <SectionContainer id="gallery">
      <SectionHeading
        badge="MEMORIES"
        title="Our Gallery"
        description="Highlights from our many past events!"
        badgeColor="bg-cyan-300"
      />
      <div className="mx-auto max-w-7xl gap-6 py-12 grid md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <Image
              src={`/placeholder.svg?height=300&width=400&text=Anime+Event+${i}`}
              width={400}
              height={300}
              alt={`Gallery image ${i}`}
              className="aspect-video object-cover transition-all hover:scale-105"
            />
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Button className="bg-cyan-300 hover:bg-cyan-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Link href="/gallery" className="flex items-center">
            <ImageIcon className="mr-2 h-4 w-4" />
            View Full Gallery
          </Link>
        </Button>
      </div>
    </SectionContainer>
  );
}

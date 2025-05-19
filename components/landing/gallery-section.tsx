"use client";
import SwipeRight from "@/public/hand-swipe-right.svg";
import Image from "next/image";
import useIsMobile from "../mobile-check";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

interface ImageType {
  id: number;
  public_url: string;
  alt: string;
}

export function GalleryContent() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const supabase = createClient();

        const { data: galleryData, error: fetchError } = await supabase
          .from("gallery")
          .select("id, public_url, alt")
          .limit(6);

        if (fetchError) {
          setError(`Error fetching gallery images: ${fetchError.message}`);
          return;
        }

        setImages(galleryData as ImageType[]);
      } catch (err: any) {
        setError(`An unexpected error occurred: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  if (loading) {
    return (
      <div className="border-2 border-black bg-gray-100 rounded-md p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-bold mb-2">Loading gallery...</h3>
        <p>Please wait while we load the memories.</p>
      </div>
    );
  }

  if (error) {
    return <div>Error loading gallery: {error}</div>;
  }

  if (isMobile) {
    return (
      <div className="mx-auto max-w-7xl gap-6 py-12 flex justify-center items-center">
        <Carousel className="w-full max-w-[500] ">
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem key={image.id}>
                <div className="p-[10px]">
                  <div className="overflow-hidden border-2 rounded-md border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="relative flex items-center">
                      <Image
                        src={image.public_url}
                        width={400}
                        height={300}
                        alt={image.alt}
                        className="aspect-video object-cover"
                      />
                      <Image
                        alt="icon"
                        className="lg:hidden absolute bottom-1 right-1"
                        src={SwipeRight}
                        height={20}
                        width={20}
                      />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  } else {
    return (
      <div className="mx-auto max-w-7xl gap-6 py-12 grid md:grid-cols-2 lg:grid-cols-3">
        {images.map((i) => (
          <div
            key={i.id}
            className="overflow-hidden border-2 rounded-md border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Image
              src={i.public_url}
              width={450}
              height={300}
              alt={i.alt}
              className="aspect-video object-cover"
            />
          </div>
        ))}
      </div>
    );
  }
}

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { api, HydrateClient } from '~/trpc/server';
import { SectionContainer } from './_components/section-container';
import { SectionHeading } from './_components/section-heading';
import { FeatureCard } from './_components/landing/feature-card';
import { Check, Library, UserPlus } from 'lucide-react';
import { Button } from './_components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import LibraryPhoto from '../../public/images/sam_manga.webp';
import { FEATURES, FREE_FEATURES, PAID_FEATURES } from '~/lib/constants';
import MarqueeSection from './_components/landing/marquee-section';

const HeroCarousel = dynamic(
	() => import('./_components/landing/hero-carousel'),
	{ ssr: true },
);

const AnimeSection = dynamic(
	() =>
		import('./_components/landing/anime-section').then((mod) => ({
			default: mod.AnimeSection,
		})),
	{ ssr: true },
);

const CommitteeSection = dynamic(
	() =>
		import('./_components/landing/committee-section').then((mod) => ({
			default: mod.CommitteeSection,
		})),
	{ ssr: true },
);

const MembershipCard = dynamic(
	() =>
		import('./_components/landing/membership-card').then((mod) => ({
			default: mod.MembershipCard,
		})),
	{ ssr: true },
);

const LIBRARY_STATS = [
	'250+ manga volumes',
	'25+ different series',
	'New volumes added monthly',
	'Member requests welcomed',
] as const;

const CAROUSEL_OPTIONS = { loop: true } as const;

function LibraryStats() {
	return (
		<div className="absolute -bottom-20 -left-4 rotate-3 rounded-2xl border-2 border-black bg-white p-2 lg:-left-10 lg:p-4 md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
			<h3 className="mb-1 text-base font-bold md:mb-2 md:text-xl">
				Library Stats
			</h3>
			<ul className="space-y-0.5 md:space-y-1">
				{LIBRARY_STATS.map((stat) => (
					<li
						key={stat}
						className="flex items-center text-xs sm:text-sm"
					>
						<Check className="mr-1 h-3 w-3 text-green-500 md:mr-2 md:h-4 md:w-4" />
						{stat}
					</li>
				))}
			</ul>
		</div>
	);
}

async function CarouselSection() {
	const carouselResult = await api.post.getCarouselData();
	const carouselData = carouselResult.data ?? [];

	return (
		<HeroCarousel
			slides={carouselData}
			options={CAROUSEL_OPTIONS}
			useSocials={true}
		/>
	);
}

function CarouselSkeleton() {
	return (
		<div className="mx-auto aspect-9/16 w-full max-w-[min(1200px,calc(100%-20px))] animate-pulse rounded-2xl bg-gray-200 md:aspect-video md:rounded-4xl" />
	);
}

export default function Home() {
	return (
		<HydrateClient>
			<main className="flex min-h-screen w-full flex-col">
				<section className="flex w-full flex-col items-center justify-center pb-3 pt-0 md:pt-3 lg:pt-[3vh]">
					<div className="container w-full max-w-full px-0 md:px-6 lg:px-8">
						<Suspense fallback={<CarouselSkeleton />}>
							<CarouselSection />
						</Suspense>
					</div>
					<MarqueeSection />
				</section>

				<SectionContainer id="about">
					<SectionHeading
						badge="ABOUT US"
						title="What We're All About"
						description="We're a society for all people that love or are interested in anime and manga."
						badgeColor="bg-purple-200"
					/>
					<div className="mx-auto grid max-w-7xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
						{FEATURES.map((feature) => (
							<FeatureCard
								key={feature.title}
								icon={feature.icon}
								title={feature.title}
								description={feature.description}
								color={feature.color}
							/>
						))}
					</div>
				</SectionContainer>

				<SectionContainer
					id="now-streaming"
					className="w-full overflow-hidden py-12 md:py-16"
				>
					<AnimeSection />
				</SectionContainer>

				<SectionContainer id="library">
					<SectionHeading
						badge="MANGA LIBRARY"
						title="Dive Into Our Manga Collection"
						description="With hundreds of volumes across various genres, there's something for every anime fan!"
						badgeColor="bg-purple-200"
					/>
					<div className="mx-auto flex max-w-7xl flex-col items-center justify-center py-12">
						<div className="relative">
							<div className="h-[180px] w-[320px] overflow-hidden rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:h-[300px] md:w-[540px] lg:h-[450px] lg:w-[800px]">
								<Image
									src={LibraryPhoto}
									height={450}
									width={800}
									draggable={false}
									alt="SAMSoc manga library collection"
									className="aspect-video object-cover"
									placeholder="blur"
									loading="lazy"
									sizes="(max-width: 768px) 320px, (max-width: 1024px) 540px, 800px"
								/>
							</div>
							<LibraryStats />
						</div>
						<div className="pt-32 text-center">
							<Button
								asChild
								className="border-2 border-black bg-button2 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:cursor-pointer hover:bg-button1"
							>
								<Link href="/library">
									<Library className="mr-2 h-4 w-4" />
									View Full Library
								</Link>
							</Button>
						</div>
					</div>
				</SectionContainer>

				<SectionContainer id="committee">
					<CommitteeSection />
				</SectionContainer>

				<SectionContainer id="join">
					<SectionHeading
						badge="MEMBERSHIP"
						title="Get Your Membership Here"
						badgeColor="bg-purple-200"
						description="Here you can look at all the benefits you can get from one of our memberships!"
					/>
					<div className="flex items-center justify-center py-8">
						<div className="grid w-full gap-8 md:grid-cols-2 lg:w-4xl">
							<MembershipCard
								title="Free"
								color="bg-membership2"
								price="£0"
								flavorText="Your gateway into the SAMSoC community"
								features={FREE_FEATURES}
							/>
							<MembershipCard
								title="Premium"
								color="bg-membership1"
								price="£2"
								flavorText="Satiate your manga reading hunger"
								features={PAID_FEATURES}
								recommended={true}
							/>
						</div>
					</div>
					<div className="text-center">
						<Button
							asChild
							className="border-2 border-black bg-button2 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:cursor-pointer hover:bg-button1"
						>
							<Link href="https://surreyunion.org/your-activity/clubs-and-societies-a-z/anime-manga-society">
								<UserPlus className="mr-2 h-4 w-4" />
								View Sign-Up Page
							</Link>
						</Button>
					</div>
				</SectionContainer>
			</main>
		</HydrateClient>
	);
}

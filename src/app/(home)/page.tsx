import { Suspense } from 'react';
import { api } from '~/trpc/server';

// Revalidate this page every 60 seconds to ensure content updates are reflected
export const revalidate = 60;
import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';
import { FeatureCard } from './_components/feature-card';
import { MembershipCard } from './_components/membership-card';
import { AnimeSection } from './_components/anime-section';
import { CommitteeSection } from './_components/committee-section';
import HeroCarousel from './_components/hero-carousel';
import MarqueeSection from './_components/marquee-section';
import HomeSkeleton from './_components/home-skeleton';
import { Check, Library } from 'lucide-react';
import { Button } from '~/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { MembershipSignupButton } from './_components/membership-signup-button';
import LibraryPhoto from '../../../public/images/sam_manga.webp';
import { FEATURES, FREE_FEATURES, PAID_FEATURES } from '~/lib/constants';
import ScrollAnimationWrapper from '~/components/shared/scroll-animation-wrapper';

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

async function HomeContent() {
	let carouselData: Awaited<
		ReturnType<typeof api.carousel.getFullData>
	>['data'] = [];

	try {
		const carouselResult = await api.carousel.getFullData();
		carouselData = carouselResult.data ?? [];
	} catch (error) {
		console.error('Failed to fetch carousel data:', error);
	}

	return (
		<main className="flex min-h-screen w-full flex-col">
			<section className="flex w-full flex-col items-center justify-center pb-3 pt-0 md:pt-3 lg:pt-[3vh]">
				<div className="container w-full max-w-full px-0 md:px-6 lg:px-8">
					<HeroCarousel
						slides={carouselData}
						options={CAROUSEL_OPTIONS}
						useSocials={true}
					/>
				</div>
				<MarqueeSection />
			</section>

			<SectionContainer id="about">
				<ScrollAnimationWrapper variant="fadeInUp">
					<SectionHeading
						badge="ABOUT US"
						title="What We're All About"
						description="We're a society for all people that love or are interested in anime and manga."
						badgeColor="bg-purple-200"
					/>
				</ScrollAnimationWrapper>
				<div className="mx-auto grid max-w-7xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
					{FEATURES.map((feature, index) => (
						<ScrollAnimationWrapper
							key={feature.title}
							variant="fadeInUp"
							delay={index * 100}
						>
							<FeatureCard
								icon={feature.icon}
								title={feature.title}
								description={feature.description}
								color={feature.color}
							/>
						</ScrollAnimationWrapper>
					))}
				</div>
			</SectionContainer>

			<SectionContainer
				id="now-streaming"
				className="w-full overflow-hidden py-12 md:py-16"
			>
				<ScrollAnimationWrapper variant="fadeInUp">
					<AnimeSection />
				</ScrollAnimationWrapper>
			</SectionContainer>

			<SectionContainer id="library">
				<ScrollAnimationWrapper variant="fadeInUp">
					<SectionHeading
						badge="MANGA LIBRARY"
						title="Dive Into Our Manga Collection"
						description="With hundreds of volumes across various genres, there's something for every anime fan!"
						badgeColor="bg-purple-200"
					/>
				</ScrollAnimationWrapper>
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-center py-12">
					<ScrollAnimationWrapper variant="fadeInScale" delay={100}>
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
									sizes="(max-width: 768px) 320px, (max-width: 1024px) 540px, 800px"
								/>
							</div>
							<LibraryStats />
						</div>
					</ScrollAnimationWrapper>
					<ScrollAnimationWrapper
						variant="fadeInUp"
						delay={200}
						className="pt-32 text-center"
					>
						<Button
							asChild
							className="border-2 border-black bg-button2 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:cursor-pointer hover:bg-button1"
						>
							<Link href="/library">
								<Library className="mr-2 h-4 w-4" />
								View Full Library
							</Link>
						</Button>
					</ScrollAnimationWrapper>
				</div>
			</SectionContainer>

			<SectionContainer id="committee">
				<ScrollAnimationWrapper variant="fadeInUp">
					<CommitteeSection />
				</ScrollAnimationWrapper>
			</SectionContainer>

			<SectionContainer id="join">
				<ScrollAnimationWrapper variant="fadeInUp">
					<SectionHeading
						badge="MEMBERSHIP"
						title="Get Your Membership Here"
						badgeColor="bg-purple-200"
						description="Here you can look at all the benefits you can get from one of our memberships!"
					/>
				</ScrollAnimationWrapper>
				<div className="flex items-center justify-center py-8">
					<div className="grid w-full gap-8 md:grid-cols-2 lg:w-4xl">
						<ScrollAnimationWrapper
							variant="fadeInLeft"
							delay={100}
						>
							<MembershipCard
								title="Free"
								color="bg-membership2"
								price="£0"
								flavorText="Your gateway into the SAMSoC community"
								features={FREE_FEATURES}
							/>
						</ScrollAnimationWrapper>
						<ScrollAnimationWrapper
							variant="fadeInRight"
							delay={100}
						>
							<MembershipCard
								title="Premium"
								color="bg-membership1"
								price="£2"
								flavorText="Satiate your manga reading hunger"
								features={PAID_FEATURES}
								recommended={true}
							/>
						</ScrollAnimationWrapper>
					</div>
				</div>
				<ScrollAnimationWrapper
					variant="fadeInUp"
					delay={200}
					className="text-center"
				>
					<MembershipSignupButton />
				</ScrollAnimationWrapper>
			</SectionContainer>
		</main>
	);
}

export default function Home() {
	return (
		<Suspense fallback={<HomeSkeleton />}>
			<HomeContent />
		</Suspense>
	);
}

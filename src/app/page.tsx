import { api, HydrateClient } from '~/trpc/server';
import HeroCarousel from './_components/landing/hero-carousel';
import { type EmblaOptionsType } from 'embla-carousel';
import { SectionContainer } from './_components/section-container';
import { SectionHeading } from './_components/section-heading';
import { FeatureCard } from './_components/landing/feature-card';
import { CalendarDays, Check, Library, UserPlus } from 'lucide-react';
import { AnimeCard } from './_components/landing/anime-card';
import { Button } from './_components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import LibraryPhoto from '../../public/images/sam_manga.webp';
import Logo from '../../public/images/logo.webp';
import { MembershipCard } from './_components/landing/membership-card';
import Marquee from 'react-fast-marquee';
import { SvgIcon } from './_components/util/svg-icon';
import { CommitteeCard } from './_components/landing/committee-card';
import { FREE_FEATURES, PAID_FEATURES, FEATURES } from '~/lib/constants';

const DEVELOPERS = ['J.P', 'Michael', 'Maiham', 'David'];
const LIBRARY_STATS = [
	'250+ manga volumes',
	'25+ different series',
	'New volumes added monthly',
	'Member requests welcomed',
] as const;

function LibraryStats() {
	return (
		<div className="absolute lg:-left-10 -bottom-20 -left-4 bg-white border-2 border-black lg:p-4 p-2 rounded-2xl md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3">
			<h3 className="text-base md:text-xl font-bold mb-1 md:mb-2">
				Library Stats
			</h3>
			<ul className="space-y-0.5 md:space-y-1">
				{LIBRARY_STATS.map((stat) => (
					<li
						key={stat}
						className="flex items-center text-xs sm:text-sm"
					>
						<Check className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-green-500" />{' '}
						{stat}
					</li>
				))}
			</ul>
		</div>
	);
}

function MarqueeContent() {
	return (
		<div className="flex gap-10 items-center mr-10">
			<span className="flex items-center gap-2">
				<p>Developed by:</p>
				<p>{DEVELOPERS.join(', ')}</p>
			</span>
			<span>●</span>
			<span className="flex items-center gap-2">
				<p>A community for students at</p>
				<div className="relative w-fit h-fit block px-2">
					<SvgIcon
						className="bg-black"
						height={50}
						width={130}
						src="/surrey.svg"
					/>
				</div>
			</span>
			<span>●</span>
			<span className="flex items-center gap-2">
				<p>Made with love for</p>
				<div className="relative w-[50px] h-fit block mx-2">
					<Image
						src={Logo}
						height={50}
						width={50}
						alt="samsoc logo"
					/>
				</div>
			</span>
			<span>●</span>
		</div>
	);
}

export default async function Home() {
	const options: EmblaOptionsType = { loop: true };

	const [cardResult, carouselResult, committeResult] = await Promise.all([
		api.post.getAnimeCardData(),
		api.post.getCarouselData(),
		api.post.getCommitteeMembers(),
	]);

	const cardData = cardResult.data ?? [];
	const carouselData = carouselResult.data ?? [];
	const committee = committeResult.data ?? [];

	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col w-full">
				<section className="w-full pb-3 pt-0 md:pt-3 lg:pt-[3vh] flex items-center justify-center flex-col">
					<div className="container w-full max-w-full px-0 md:px-6 lg:px-8">
						<HeroCarousel
							slides={carouselData}
							options={options}
							useSocials={true}
						/>
					</div>
					<Marquee
						autoFill
						className="mt-20 mask-[linear-gradient(90deg,hsla(0,0%,0%,0)_0%,hsla(0,0%,0%,1)_10%,hsla(0,0%,0%,1)_90%,hsla(0,0%,0%,0)_100%)]"
					>
						<MarqueeContent />
					</Marquee>
				</section>

				<SectionContainer id="about">
					<SectionHeading
						badge="ABOUT US"
						title="What We're All About"
						description="We're a society for all people that love or are interested in anime and manga."
						badgeColor="bg-purple-200"
					/>
					<div className="mx-auto max-w-7xl items-center gap-6 py-12 grid lg:grid-cols-3 lg:gap-12">
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
					className="w-full py-12 md:py-16 overflow-hidden"
				>
					<SectionHeading
						badge="NOW STREAMING"
						title="This Week's Anime"
						description="Join us every Wednesday at 6PM in Lecture Theatre G for our weekly anime screenings!"
						badgeColor="bg-purple-200"
					/>
					<AnimeCard animes={cardData} />
					<div className="mb-8 -mt-8 text-center">
						<p className="font-medium mb-4">
							Don&apos;t worry if you&apos;ve missed previous
							episodes - you have plenty of time to catch-up!
						</p>
						<Button
							asChild
							className="bg-button2 hover:bg-button1 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
						>
							<Link
								href="/calendar"
								className="flex items-center"
							>
								<CalendarDays className="mr-2 h-4 w-4" />
								View Full Calendar
							</Link>
						</Button>
					</div>
				</SectionContainer>

				<SectionContainer id="library">
					<SectionHeading
						badge="MANGA LIBRARY"
						title="Dive Into Our Manga Collection"
						description="With hundreds of volumes across various genres, there's something for every anime fan!"
						badgeColor="bg-purple-200"
					/>
					<div className="flex items-center justify-center mx-auto max-w-7xl py-12 flex-col">
						<div className="relative">
							<div className="overflow-hidden lg:w-[800px] lg:h-[450px] md:w-[540px] md:h-[300px] w-[320px] h-[180px] border-2 rounded-2xl border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
								<Image
									src={LibraryPhoto}
									height={450}
									width={800}
									draggable={false}
									alt="SAMSoc manga library collection"
									className="aspect-video object-cover"
									priority={false}
									placeholder="blur"
								/>
							</div>
							<LibraryStats />
						</div>
						<div className="text-center pt-32">
							<Button className="bg-button2 hover:bg-button1 hover:cursor-pointer text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
								<Link
									href="/library"
									className="flex items-center"
								>
									<Library className="mr-2 h-4 w-4" />
									View Full Library
								</Link>
							</Button>
						</div>
					</div>
				</SectionContainer>

				<SectionContainer id="committee">
					<SectionHeading
						badge="COMMITTEE"
						title="Meet Our Committee"
						badgeColor="bg-purple-200"
						description="The masterminds behind our beautifully constructed events, sessions and much more!"
					/>
					<div className="flex flex-col lg:flex-row gap-8 items-center justify-center py-6 auto-rows-fr">
						{committee.map((member) => (
							<CommitteeCard
								key={member.id}
								id={member.id}
								name={member.name}
								role={member.role}
								source={member.source}
							/>
						))}
					</div>
				</SectionContainer>

				<SectionContainer id="join">
					<SectionHeading
						badge="MEMBERSHIP"
						title="Get Your Membership Here"
						badgeColor="bg-purple-200"
						description="Here you can look at all the benefits you can get from one of our memberships!"
					/>
					<div className="flex items-center justify-center py-8">
						<div className="grid gap-8 md:grid-cols-2 w-full lg:w-4xl">
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
						<Button className="bg-button2 hover:bg-button1 hover:cursor-pointer text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
							<Link
								href="https://surreyunion.org/your-activity/clubs-and-societies-a-z/anime-manga-society"
								className="flex items-center"
							>
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

import { api, HydrateClient } from '~/trpc/server';
import HeroCarousel from './_components/landing/hero-carousel';
import { type EmblaOptionsType } from 'embla-carousel';
import { SectionContainer } from './_components/section-container';
import { SectionHeading } from './_components/section-heading';
import { FeatureCard } from './_components/landing/feature-card';
import {
	Calendar,
	CalendarDays,
	Check,
	Library,
	Star,
	UserPlus,
	Users,
} from 'lucide-react';
import { AnimeCard } from './_components/landing/anime-card';
import { Button } from './_components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import LibraryPhoto from '../../public/images/sam-library-image.png';
import Logo from '../../public/images/logo.png';
import { MembershipCard } from './_components/landing/membership-card';
import Marquee from './_components/marquee';
import { SvgIcon } from './_components/util/svg-icon';
import { CommitteeCard } from './_components/landing/committee-card';

export default async function Home() {
	const cardResult = await api.post.getAnimeCardData();
	const cardData = cardResult.data;
	const carouselResult = await api.post.getCarouselData();
	const carouselData = carouselResult.data;
	const committeResult = await api.post.getCommitteeMembers();
	const committee = committeResult.data;
	const options: EmblaOptionsType = { loop: true };
	const features = [
		{
			icon: Calendar,
			title: 'Weekly Screenings',
			description:
				'Join us every Wednesday for anime screenings. From classics to the latest releases!',
			color: 'bg-about1',
		},
		{
			icon: Users,
			title: 'Community Events',
			description:
				'Come and hang out with us at one of the multitude of events ran by our amazing community!',
			color: 'bg-about2',
		},
		{
			icon: Star,
			title: 'Convention Trips',
			description:
				'Come join our bi-annual group trips to conventions around the UK such as MCM ComicCon and Mega Con!',
			color: 'bg-about3',
		},
	];

	const freeFeatures = [
		{ included: true, text: 'Access to weekly screenings' },
		{ included: true, text: 'Participate in society events' },
		{ included: true, text: 'Join our Discord community' },
		{ included: true, text: 'Voting rights for anime selections' },
		{ included: false, text: 'Access to our manga library' },
	];

	const paidFeatures = [
		{ included: true, text: 'Access to weekly screenings' },
		{ included: true, text: 'Participate in society events' },
		{ included: true, text: 'Join our Discord community' },
		{ included: true, text: 'Voting rights for anime selections' },
		{
			included: true,
			text: 'Access to our manga library',
			highlight: true,
		},
	];

	return (
		<HydrateClient>
			<main className="flex min-h-screen flex-col w-full">
				<section className="w-full pb-3 pt-0 md:pt-3 lg:pt-[3vh] flex items-center justify-center flex-col">
					<div className="container w-full max-w-full px-0 md:px-6 lg:px-8">
						<HeroCarousel
							slides={carouselData}
							options={options}
							useSocials={true}
						></HeroCarousel>
					</div>
					<Marquee className="mt-20 mask-[linear-gradient(90deg,hsla(0,0%,0%,0)_0%,hsla(0,0%,0%,1)_10%,hsla(0,0%,0%,1)_90%,hsla(0,0%,0%,0)_100%)]">
						<div className="flex gap-10 items-center mr-10">
							<span className="flex items-center gap-2">
								<p>Developed by:</p>
								<p>
									{['J.P', 'Michael', 'Maiham', 'David'].join(
										', ',
									)}
								</p>
							</span>
							<span>●</span>
							<span className="flex items-center gap-2">
								<p>A community for students at</p>
								<div className="relative w-fit h-fit block px-2">
									<SvgIcon
										className="bg-black"
										height={50}
										width={130}
										src={'/surrey.svg'}
									></SvgIcon>
								</div>
							</span>
							<span>●</span>
							<span className="flex items-center gap-2 ">
								<p>Made with love for</p>
								<div className="relative w-[50px] h-fit block mx-2">
									<Image
										src={Logo.src}
										height={50}
										width={50}
										alt="samsoc logo"
									></Image>
								</div>
							</span>
							<span>●</span>
						</div>
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
						{features.map((feature, index) => (
							<FeatureCard
								key={index}
								className={``}
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
						description="Join us every Wednesday at 6PM in Lecture Theatre G for our weekly
								  anime screenings!"
						badgeColor="bg-purple-200"
					/>
					<AnimeCard animes={cardData} />
					<div className="mb-8 -mt-8 text-center">
						<p className="font-medium mb-4">
							Dont worry if youve missed previous episodes - you
							have plenty of time to catch-up!
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
						description="With hundreds of volumes across various genres,
              there's something for every anime fan!"
						badgeColor="bg-purple-200"
					/>
					<div className="flex items-center justify-center mx-auto max-w-7xl py-12 flex-col">
						<div className="relative">
							<div className="overflow-hidden lg:w-[800px] lg:h-[450px] md:w-[540px] md:h-[300px] w-[360px] h-[200px] border-2 rounded-2xl border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
								<Image
									src={LibraryPhoto}
									height={1080}
									width={1920}
									draggable={false}
									alt={`Gallery image`}
									className="aspect-video object-cover"
								/>
							</div>
							<div className="absolute lg:-left-10 -bottom-20 -left-4 bg-white border-2 border-black lg:p-4 p-2 rounded-2xl md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3">
								<h3 className="text-base md:text-xl font-bold mb-1 md:mb-2">
									Library Stats
								</h3>
								<ul className="space-y-0.5 md:space-y-1">
									<li className="flex items-center text-xs sm:text-sm">
										<Check className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-green-500" />{' '}
										250+ manga volumes
									</li>
									<li className="flex items-center text-xs sm:text-sm">
										<Check className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-green-500" />{' '}
										25+ different series
									</li>
									<li className="flex items-center text-xs sm:text-sm">
										<Check className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-green-500" />{' '}
										New volumes added monthly
									</li>
									<li className="flex items-center text-xs sm:text-sm">
										<Check className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-green-500" />{' '}
										Member requests welcomed
									</li>
								</ul>
							</div>
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
						description="The masterminds behind our beautifully constructed events, session and much more!"
					/>
					<div className="grid grid-cols-2 lg:grid-cols-5 items-center justify-center py-6 auto-rows-fr">
						{committee.map((member, index) => (
							<CommitteeCard
								key={index}
								id={member.id}
								name={member.name}
								role={member.role}
								source={member.source}
								className={
									index === 0
										? 'lg:col-span-1 col-span-2'
										: ''
								}
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
								features={freeFeatures}
							/>
							<MembershipCard
								title="Premium"
								color="bg-membership1"
								price="£2"
								flavorText="Satiate your manga reading hunger"
								features={paidFeatures}
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

import Link from 'next/link';
import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';
import ScrollAnimationWrapper from '~/components/shared/scroll-animation-wrapper';
import {
	Calendar,
	Image,
	Home,
	BookOpen,
	Gamepad2,
	BarChart3,
	TrendingUp,
	Shield,
} from 'lucide-react';

const dashboardItems = [
	{
		name: 'Calendar',
		description: 'Manage events and schedules for the society',
		href: '/dashboard/calendar',
		icon: Calendar,
		color: 'bg-blue-100',
	},
	{
		name: 'Gallery',
		description: 'Add or remove images from the photo gallery',
		href: '/dashboard/gallery',
		icon: Image,
		color: 'bg-pink-100',
	},
	{
		name: 'Landing Page',
		description: 'Edit carousel, committee members, and anime cards',
		href: '/dashboard/landing',
		icon: Home,
		color: 'bg-green-100',
	},
	{
		name: 'Library',
		description: 'Manage manga entries in the society library',
		href: '/dashboard/library',
		icon: BookOpen,
		color: 'bg-yellow-100',
	},
	{
		name: 'Games',
		description: 'Configure daily anime, studio, and banner games',
		href: '/dashboard/games',
		icon: Gamepad2,
		color: 'bg-purple-100',
	},
	{
		name: 'Anime Stats',
		description: 'View analytics for anime game performance',
		href: '/dashboard/stats/anime',
		icon: BarChart3,
		color: 'bg-orange-100',
	},
	{
		name: 'General Stats',
		description: 'View overall website analytics and metrics',
		href: '/dashboard/stats/general',
		icon: TrendingUp,
		color: 'bg-cyan-100',
	},
];

export default function Page() {
	return (
		<div>
			<SectionContainer>
				<ScrollAnimationWrapper variant="fadeInUp">
					<SectionHeading
						badge="DASHBOARD"
						title="Committee Dashboard"
						badgeColor="bg-purple-200"
						description="Here is a collection of dashboards you can use to change the data displayed on the website!"
					/>
				</ScrollAnimationWrapper>

				<div className="max-w-7xl mx-auto py-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{dashboardItems.map((item, index) => (
							<ScrollAnimationWrapper
								key={item.href}
								variant="fadeInUp"
								delay={index * 50}
							>
								<Link href={item.href} className="group block">
									<article className="h-full border-2 border-black rounded-2xl bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
										<div
											className={`w-14 h-14 ${item.color} rounded-xl border-2 border-black flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
										>
											<item.icon className="w-7 h-7 text-gray-900" />
										</div>
										<h2 className="text-xl font-bold text-gray-900 mb-2">
											{item.name}
										</h2>
										<p className="text-gray-600 text-sm leading-relaxed">
											{item.description}
										</p>
										<div className="mt-4 text-sm font-bold text-gray-900 group-hover:underline">
											Open Dashboard &rarr;
										</div>
									</article>
								</Link>
							</ScrollAnimationWrapper>
						))}
					</div>

					<ScrollAnimationWrapper variant="fadeIn" delay={400}>
						<div className="mt-12 pt-8 border-t-2 border-black">
							<div className="border-2 border-black rounded-2xl bg-red-50 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
								<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
									<div className="w-12 h-12 bg-red-200 rounded-xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
										<Shield className="w-6 h-6 text-red-700" />
									</div>
									<div className="flex-1">
										<h3 className="text-lg font-bold text-gray-900 mb-1">
											Admin Panel
										</h3>
										<p className="text-sm text-gray-700">
											Advanced settings and user
											management. Only use if you know
											what you&apos;re doing!
										</p>
									</div>
									<Link
										href="/admin/users"
										className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-bold border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 transition-all text-center"
									>
										Enter Admin Panel
									</Link>
								</div>
							</div>
						</div>
					</ScrollAnimationWrapper>
				</div>
			</SectionContainer>
		</div>
	);
}

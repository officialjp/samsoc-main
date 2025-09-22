import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MembershipCard } from '@/components/landing/membership-card';
import { SectionContainer } from '../section-container';

export function MembershipSection() {
	const freeFeatures = [
		{ included: true, text: 'Access to weekly screenings' },
		{ included: true, text: 'Participate in society events' },
		{ included: true, text: 'Join our Discord community' },
		{ included: true, text: 'Voting rights for anime selections' },
		{ included: false, text: 'Access to manga library' },
	];

	const paidFeatures = [
		{ included: true, text: 'Access to weekly screenings :)' },
		{ included: true, text: 'Participate in society events' },
		{ included: true, text: 'Join our Discord community' },
		{ included: true, text: 'Voting rights for anime selections' },
		{
			included: true,
			text: 'Access to our extensive manga library',
			highlight: true,
		},
	];

	return (
		<SectionContainer>
			<div className="container w-full max-w-full px-4 md:px-6 lg:px-8">
				<div className="relative mx-auto max-w-7xl border-2 md:border-2 border-black bg-white p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-md">
					<div className="space-y-8">
						<h2 className="text-2xl md:text-3xl font-bold text-center">
							Choose Your Membership
						</h2>

						<div className="grid gap-8 md:grid-cols-2">
							<MembershipCard
								title="FREE MEMBERSHIP"
								color="bg-membership2"
								price="£0"
								period="Forever free"
								features={freeFeatures}
							/>
							<MembershipCard
								title="PAID MEMBERSHIP"
								color="bg-membership1"
								price="£2 per year"
								period="Satiate your manga reading hunger"
								features={paidFeatures}
								recommended={true}
							/>
						</div>
						<div className="md:col-span-2">
							<Button className="w-full hover:cursor-pointer bg-membership1 hover:bg-pink-300 text-text1 text-base md:text-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
								<a
									href="https://surreyunion.org/your-activity/clubs-and-societies-a-z/anime-manga-society"
									target="_target"
									className="flex items-center w-full justify-center"
								>
									Sign Up Now{' '}
									<ArrowRight className="ml-2 h-4 w-4" />
								</a>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</SectionContainer>
	);
}

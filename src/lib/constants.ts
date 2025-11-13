import { Calendar, Users, Star } from 'lucide-react';

export const FEATURES = [
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

export const FREE_FEATURES = [
	{ included: true, text: 'Access to weekly screenings' },
	{ included: true, text: 'Participate in society events' },
	{ included: true, text: 'Join our Discord community' },
	{ included: true, text: 'Voting rights for anime selections' },
	{ included: false, text: 'Access to our manga library' },
];

export const PAID_FEATURES = [
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

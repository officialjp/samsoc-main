import { auth } from '~/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || session.user?.role !== 'admin') {
		redirect('/unauthorized');
	}

	return <>{children}</>;
}

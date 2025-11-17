// app/admin/users/page.tsx
import { auth } from '~/server/auth';
import { redirect } from 'next/navigation';
import { api } from '~/trpc/server';
import { UpdateRoleButton } from '../../_components/admin/update-role-button';

export default async function AdminUsersPage() {
	const session = await auth();

	if (!session || session.user?.role !== 'admin') {
		redirect('/unauthorized');
	}

	const users = await api.admin.getAllUsers();

	return (
		<div className="container mx-auto p-8">
			<h1 className="text-3xl font-bold mb-6">User Management</h1>

			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border">
					<thead>
						<tr className="bg-gray-100">
							<th className="px-6 py-3 text-left">Email</th>
							<th className="px-6 py-3 text-left">Name</th>
							<th className="px-6 py-3 text-left">Role</th>
							<th className="px-6 py-3 text-left">Created</th>
							<th className="px-6 py-3 text-left">Actions</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user.id} className="border-t">
								<td className="px-6 py-4">{user.email}</td>
								<td className="px-6 py-4">{user.name}</td>
								<td className="px-6 py-4">
									<span
										className={`px-2 py-1 rounded ${
											user.role === 'admin'
												? 'bg-red-100 text-red-800'
												: 'bg-gray-100'
										}`}
									>
										{user.role}
									</span>
								</td>
								<td className="px-6 py-4">
									<UpdateRoleButton
										userId={user.id}
										currentRole={user.role}
										currentUserId={session.user.id}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

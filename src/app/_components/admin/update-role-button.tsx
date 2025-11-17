// app/admin/users/update-role-button.tsx
'use client';

import { useState } from 'react';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';

export function UpdateRoleButton({
	userId,
	currentRole,
	currentUserId,
}: {
	userId: string;
	currentRole: string;
	currentUserId: string;
}) {
	const [role, setRole] = useState(currentRole);
	const router = useRouter();

	const updateRole = api.admin.updateUserRole.useMutation({
		onSuccess: () => {
			router.refresh(); // Refresh server component
		},
		onError: (error) => {
			alert(error.message);
			setRole(currentRole); // Reset on error
		},
	});

	const handleRoleChange = (newRole: 'user' | 'admin') => {
		setRole(newRole);
		updateRole.mutate({ userId, newRole });
	};

	const isCurrentUser = userId === currentUserId;

	return (
		<select
			value={role}
			onChange={(e) =>
				handleRoleChange(e.target.value as 'user' | 'admin')
			}
			disabled={
				updateRole.isPending || (isCurrentUser && role === 'admin')
			}
			className="border rounded px-2 py-1 disabled:opacity-50"
			title={
				isCurrentUser && role === 'admin'
					? 'Cannot demote yourself'
					: ''
			}
		>
			<option value="user">User</option>
			<option value="admin">Admin</option>
		</select>
	);
}

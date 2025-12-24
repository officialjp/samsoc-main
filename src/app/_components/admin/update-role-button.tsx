'use client';

import { useState } from 'react';
import { api } from '~/trpc/react';
import { toast } from 'sonner';

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
	const utils = api.useUtils();

	const updateRole = api.admin.updateUserRole.useMutation({
		onSuccess: () => {
			void utils.admin.getAllUsers.invalidate();
			toast.success('User role updated successfully');
		},
		onError: (error) => {
			toast.error(error.message);
			setRole(currentRole);
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

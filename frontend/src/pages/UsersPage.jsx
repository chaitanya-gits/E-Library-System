import { useState, useEffect } from 'react';
import { userApi } from '../services/api';

function UsersPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await userApi.getAll();
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Library Members</h1>
                <span style={{ color: 'var(--color-text-secondary)' }}>{users.length} members</span>
            </div>

            {users.length === 0 ? (
                <div className="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <p>No users registered yet.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Member Since</th>
                                <th>Active Loans</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td><strong>{user.name}</strong></td>
                                    <td>{user.email}</td>
                                    <td>{user.phone || '-'}</td>
                                    <td>{user.membershipDate || '-'}</td>
                                    <td>{user.activeLoans || 0}</td>
                                    <td>
                                        <span className={`badge ${user.active ? 'badge-success' : 'badge-error'}`}>
                                            {user.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default UsersPage;

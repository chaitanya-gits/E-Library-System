import { useState, useEffect } from 'react';
import { loanApi } from '../services/api';

function LoansPage() {
    const [loans, setLoans] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                let response;
                switch (filter) {
                    case 'active':
                        response = await loanApi.getActive();
                        break;
                    case 'overdue':
                        response = await loanApi.getOverdue();
                        break;
                    default:
                        response = await loanApi.getAll();
                }
                setLoans(response.data);
            } catch (error) {
                console.error('Failed to fetch loans:', error);
            }
        };
        fetchLoans();
    }, [filter]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'ACTIVE': return 'badge-success';
            case 'RETURNED': return 'badge-warning';
            case 'OVERDUE': return 'badge-error';
            default: return '';
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1>Loan Records</h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('active')}
                    >
                        Active
                    </button>
                    <button
                        className={`btn ${filter === 'overdue' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('overdue')}
                    >
                        Overdue
                    </button>
                </div>
            </div>

            {loans.length === 0 ? (
                <div className="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <p>No {filter !== 'all' ? filter : ''} loans found.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>Borrower</th>
                                <th>Loan Date</th>
                                <th>Due Date</th>
                                <th>Return Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map((loan) => (
                                <tr key={loan.id}>
                                    <td><strong>{loan.bookTitle}</strong></td>
                                    <td>{loan.userName}</td>
                                    <td>{loan.loanDate}</td>
                                    <td>{loan.dueDate}</td>
                                    <td>{loan.returnDate || '-'}</td>
                                    <td>
                                        <span className={`badge ${getStatusClass(loan.status)}`}>
                                            {loan.status}
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

export default LoansPage;

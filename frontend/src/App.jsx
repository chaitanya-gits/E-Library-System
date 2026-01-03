import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import BooksPage from './pages/BooksPage';
import CategoryPage from './pages/CategoryPage';
import MyLibraryPage from './pages/MyLibraryPage';
import DownloadsPage from './pages/DownloadsPage';
import FavoritesPage from './pages/FavoritesPage';
import UsersPage from './pages/UsersPage';
import LoansPage from './pages/LoansPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import SettingsPage from './pages/SettingsPage';
import ReadingPage from './pages/ReadingPage';
import UpgradePage from './pages/UpgradePage';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Root redirects to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                {/* Protected routes with MainLayout */}
                <Route path="/books" element={<MainLayout />}>
                    <Route index element={<BooksPage />} />
                </Route>
                <Route path="/category" element={<MainLayout />}>
                    <Route index element={<CategoryPage />} />
                </Route>
                <Route path="/library" element={<MainLayout />}>
                    <Route index element={<MyLibraryPage />} />
                </Route>
                <Route path="/downloads" element={<MainLayout />}>
                    <Route index element={<DownloadsPage />} />
                </Route>
                <Route path="/favorites" element={<MainLayout />}>
                    <Route index element={<FavoritesPage />} />
                </Route>
                <Route path="/users" element={<MainLayout />}>
                    <Route index element={<UsersPage />} />
                </Route>
                <Route path="/loans" element={<MainLayout />}>
                    <Route index element={<LoansPage />} />
                </Route>
                <Route path="/settings" element={<MainLayout />}>
                    <Route index element={<SettingsPage />} />
                </Route>
                <Route path="/upgrade" element={<MainLayout />}>
                    <Route index element={<UpgradePage />} />
                </Route>

                <Route path="/read/:id" element={<ReadingPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

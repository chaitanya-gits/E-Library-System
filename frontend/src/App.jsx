import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import { PageTransitionProvider } from './components/PageTransitionProvider';
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
import OAuthSuccessPage from './pages/OAuthSuccessPage';

function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

function ProtectedRoute({ children }) {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
    return (
        <PageTransitionProvider>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to={isAuthenticated() ? '/books' : '/login'} replace />}
                />
                <Route
                    path="/login"
                    element={isAuthenticated() ? <Navigate to="/books" replace /> : <LoginPage />}
                />
                <Route
                    path="/signup"
                    element={isAuthenticated() ? <Navigate to="/books" replace /> : <SignUpPage />}
                />
                <Route path="/oauth-success" element={<OAuthSuccessPage />} />

                <Route path="/books" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    <Route index element={<BooksPage />} />
                </Route>
                <Route path="/category" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    <Route index element={<CategoryPage />} />
                </Route>
                <Route path="/library" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    <Route index element={<MyLibraryPage />} />
                </Route>
                <Route path="/downloads" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    <Route index element={<DownloadsPage />} />
                </Route>
                <Route path="/favorites" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    <Route index element={<FavoritesPage />} />
                </Route>
                <Route path="/users" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    <Route index element={<UsersPage />} />
                </Route>
                <Route path="/loans" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    <Route index element={<LoansPage />} />
                </Route>
                <Route path="/settings" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    <Route index element={<SettingsPage />} />
                </Route>
                <Route path="/upgrade" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    <Route index element={<UpgradePage />} />
                </Route>

                <Route path="/read/:id" element={<ProtectedRoute><ReadingPage /></ProtectedRoute>} />
                <Route
                    path="*"
                    element={<Navigate to={isAuthenticated() ? '/books' : '/login'} replace />}
                />
            </Routes>
        </PageTransitionProvider>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;

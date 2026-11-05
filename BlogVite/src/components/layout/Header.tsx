import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';
import { useTheme } from '@/context/useTheme';
import { SITE_NAME } from '@/constants/site';
import { changeLanguage } from '@/i18n';
import { button } from '@/lib/classes';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/AboutUs' },
  { label: 'Contact', path: '/ContactUs' },
];

const adminItems = [
  { label: 'Chart', path: '/Admin/Chart' },
  { label: 'Users', path: '/Admin/Users' },
  { label: 'PostM', path: '/Admin/PostManager' },
];

const menuItemClass = 'block w-full px-4 py-2 text-left text-sm hover:bg-muted';

const Header = () => {
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation('hometable');
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = !!user && role === 'Administrator';

  const handleSignOut = () => {
    setMenuOpen(false);
    signOut();
    navigate('/Login');
  };

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link to="/" className="text-xl font-bold">
          {SITE_NAME}
        </Link>

        <nav className="flex gap-4 text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) => (isActive ? 'font-medium' : 'text-muted-foreground')}
            >
              {t(item.label)}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex gap-1 text-sm">
            {(['tr', 'en'] as const).map((language) => (
              <button
                key={language}
                onClick={() => changeLanguage(language)}
                className={i18n.language === language ? 'font-semibold' : 'text-muted-foreground'}
              >
                {language.toUpperCase()}
              </button>
            ))}
          </div>

          <button onClick={toggleTheme} aria-label={t('Theme')} className={button('ghost', 'icon')}>
            {theme === 'dark' ? <Sun /> : <Moon />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                data-testid="user-menu"
                className={button('outline', 'sm')}
              >
                {user.UserName}
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border bg-surface py-1">
                    <Link
                      to="/Account"
                      onClick={() => setMenuOpen(false)}
                      className={menuItemClass}
                    >
                      {t('Account')}
                    </Link>
                    {isAdmin &&
                      adminItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMenuOpen(false)}
                          className={menuItemClass}
                        >
                          {t(item.label)}
                        </Link>
                      ))}
                    <button onClick={handleSignOut} className={menuItemClass}>
                      {t('LogOut')}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/Login" className={button('primary', 'sm')}>
              {t('Login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

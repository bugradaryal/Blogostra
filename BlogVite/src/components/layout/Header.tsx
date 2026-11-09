import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChartColumn, ChevronDown, FileText, LogOut, Moon, Sun, User, Users } from 'lucide-react';
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
  { label: 'Chart', path: '/Admin/Chart', icon: ChartColumn },
  { label: 'Users', path: '/Admin/Users', icon: Users },
  { label: 'PostM', path: '/Admin/PostManager', icon: FileText },
];

const menuItemClass =
  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted [&_svg]:size-4 [&_svg]:text-muted-foreground';

const initialOf = (name?: string) => name?.trim().charAt(0).toUpperCase() || '?';

const Header = () => {
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation('hometable');
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = !!user && role === 'Administrator';

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const handleSignOut = () => {
    setMenuOpen(false);
    signOut();
    navigate('/Login');
  };

  const navLinks = (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end
          className={({ isActive }) =>
            `rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`
          }
        >
          {t(item.label)}
        </NavLink>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/75 backdrop-blur-xl">
      <div className="page-container flex h-16 items-center gap-3">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-lg font-extrabold text-primary-foreground shadow-md shadow-primary/30 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            {SITE_NAME.charAt(0)}
          </span>
          <span className="text-xl font-extrabold tracking-tight">{SITE_NAME}</span>
        </Link>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <nav className="hidden items-center gap-1 md:flex">{navLinks}</nav>
          <span className="mx-1 hidden h-6 w-px bg-border md:block" />

          <div className="flex rounded-full bg-muted p-0.5 text-xs font-semibold">
            {(['tr', 'en'] as const).map((language) => (
              <button
                key={language}
                onClick={() => changeLanguage(language)}
                aria-pressed={i18n.language === language}
                className={`rounded-full px-2.5 py-1 transition-colors ${
                  i18n.language === language
                    ? 'bg-surface text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {language.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            aria-label={t('Theme')}
            className={`${button('ghost', 'icon')} rounded-full`}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                data-testid="user-menu"
                className="flex items-center gap-2 rounded-full border bg-surface py-1 pr-2.5 pl-1 text-sm font-medium transition hover:border-primary/50 hover:shadow-sm"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {initialOf(user.UserName)}
                </span>
                <span className="hidden max-w-28 truncate sm:block">{user.UserName}</span>
                <ChevronDown
                  className={`size-4 text-muted-foreground transition-transform duration-200 ${
                    menuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0" onClick={() => setMenuOpen(false)} />
                  <div
                    role="menu"
                    className="absolute right-0 z-10 mt-2 w-64 origin-top-right animate-menu-in rounded-2xl border bg-surface p-1.5 shadow-2xl shadow-black/15"
                  >
                    <div className="flex items-center gap-3 px-3 py-2.5">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                        {initialOf(user.UserName)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{user.UserName}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.Email}</p>
                      </div>
                    </div>
                    <div className="my-1 h-px bg-border" />
                    <Link to="/Account" onClick={() => setMenuOpen(false)} className={menuItemClass}>
                      <User />
                      {t('Account')}
                    </Link>
                    {isAdmin && (
                      <>
                        <p className="px-3 pt-2 pb-1 text-xs font-medium text-muted-foreground">
                          {t('Admin')}
                        </p>
                        {adminItems.map(({ label, path, icon: Icon }) => (
                          <Link
                            key={path}
                            to={path}
                            onClick={() => setMenuOpen(false)}
                            className={menuItemClass}
                          >
                            <Icon />
                            {t(label)}
                          </Link>
                        ))}
                      </>
                    )}
                    <div className="my-1 h-px bg-border" />
                    <button
                      onClick={handleSignOut}
                      className={`${menuItemClass} text-destructive hover:bg-destructive/10 [&_svg]:text-destructive`}
                    >
                      <LogOut />
                      {t('LogOut')}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/Login" className={`${button('primary', 'sm')} rounded-full px-4`}>
              {t('Login')}
            </Link>
          )}
        </div>
      </div>

      <nav className="page-container flex gap-1 overflow-x-auto border-t py-2 md:hidden">
        {navLinks}
      </nav>
    </header>
  );
};

export default Header;

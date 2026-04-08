import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Activity, Users, PlusCircle } from 'lucide-react';

const useStyles = createUseStyles((theme) => ({
  layout: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colors.background,
    color: theme.colors.textMain,
    fontFamily: theme.fonts.main,
  },
  header: {
    backgroundColor: theme.colors.surface,
    padding: '1rem 2rem',
    boxShadow: theme.shadows.sm,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backdropFilter: 'blur(10px)',
    background: theme.colors.glass,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.5rem',
    fontWeight: 800,
    color: theme.colors.primary,
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    gap: '2rem',
  },
  navLink: {
    textDecoration: 'none',
    color: theme.colors.textMuted,
    fontWeight: 600,
    fontSize: '1.05rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    transition: theme.transitions.default,
    padding: '0.5rem 0',
    position: 'relative',
    '&:hover': {
      color: theme.colors.primary,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '100%',
      transform: 'scaleX(0)',
      height: '3px',
      bottom: 0,
      left: 0,
      backgroundColor: theme.colors.primary,
      transformOrigin: 'bottom right',
      transition: 'transform 0.3s ease-out',
      borderRadius: theme.radii.full,
    },
    '&:hover::after': {
      transform: 'scaleX(1)',
      transformOrigin: 'bottom left',
    }
  },
  activeLink: {
    color: theme.colors.primaryHover,
    '&::after': {
      transform: 'scaleX(1)',
    }
  },
  main: {
    flex: 1,
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
}));

const Layout = ({ children }) => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? classes.activeLink : '';

  return (
    <div className={classes.layout}>
      <header className={classes.header}>
        <Link to="/" className={classes.logo}>
          <Heart fill={theme.colors.primary} size={28} />
          LifeLine
        </Link>
        <nav className={classes.nav}>
          <Link to="/" className={`${classes.navLink} ${isActive('/')}`}>
            <Activity size={18} /> Dashboard
          </Link>
          <Link to="/requests" className={`${classes.navLink} ${isActive('/requests')}`}>
            <PlusCircle size={18} /> Requests
          </Link>
          <Link to="/register" className={`${classes.navLink} ${isActive('/register')}`}>
            <Users size={18} /> Register
          </Link>
        </nav>
      </header>
      <main className={classes.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;

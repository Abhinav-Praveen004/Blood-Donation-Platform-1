import React, { useEffect, useState } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { driveService } from '../api';
import { MapPin, Calendar, HeartPulse, Users, Droplet, Activity } from 'lucide-react';

const useStyles = createUseStyles((theme) => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem',
    animation: '$fadeIn 0.6s ease',
  },
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(15px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  },
  hero: {
    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, #8A0021 100%)`,
    padding: '5rem 3rem 7rem 3rem',
    borderRadius: theme.radii.lg,
    color: 'white',
    boxShadow: theme.shadows.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
  },
  heroDecor: {
    position: 'absolute',
    right: '-5%',
    top: '-20%',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: 800,
    zIndex: 1,
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: '1.25rem',
    opacity: 0.9,
    maxWidth: '600px',
    lineHeight: 1.6,
    zIndex: 1,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginTop: '-5rem',
    position: 'relative',
    zIndex: 10,
    padding: '0 2rem',
  },
  statCard: {
    background: theme.colors.surface,
    padding: '1.5rem 2rem',
    borderRadius: theme.radii.lg,
    boxShadow: theme.shadows.md,
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    border: `1px solid ${theme.colors.border}`,
    transition: theme.transitions.bounce,
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows.lg,
      borderColor: theme.colors.primary,
    }
  },
  statText: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontSize: '2.2rem',
    fontWeight: 800,
    color: theme.colors.textMain,
    lineHeight: 1.2,
  },
  statLabel: {
    color: theme.colors.textMuted,
    fontSize: '0.95rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2rem',
  },
  driveCard: {
    background: theme.colors.surface,
    padding: '2rem',
    borderRadius: theme.radii.lg,
    boxShadow: theme.shadows.sm,
    border: `1px solid ${theme.colors.border}`,
    transition: theme.transitions.bounce,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: theme.shadows.glow,
      borderColor: theme.colors.primary,
    }
  },
  driveTitle: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: theme.colors.textMain,
    marginBottom: '0.5rem',
  },
  driveInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: theme.colors.textMuted,
    fontSize: '1rem',
    fontWeight: 500,
  },
  sectionTitle: {
    fontSize: '2rem',
    color: theme.colors.textMain,
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  }
}));

const Dashboard = () => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    driveService.getDrives()
      .then(res => setDrives(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className={classes.page}>
      <div className={classes.hero}>
        <div className={classes.heroDecor}></div>
        <h1 className={classes.title}>Every Drop Counts</h1>
        <p className={classes.subtitle}>
          Join our mission to connect life-saving blood donors with those in critical need. Find a donation drive near you and make a difference today.
        </p>
      </div>

      <div className={classes.statsGrid}>
        <div className={classes.statCard}>
          <Users size={48} color={theme.colors.primary} style={{ opacity: 0.8 }} />
          <div className={classes.statText}>
            <span className={classes.statValue}>1,240+</span>
            <span className={classes.statLabel}>Active Donors</span>
          </div>
        </div>
        <div className={classes.statCard}>
          <Droplet size={48} color={theme.colors.primary} style={{ opacity: 0.8 }} />
          <div className={classes.statText}>
            <span className={classes.statValue}>500L</span>
            <span className={classes.statLabel}>Blood Donated</span>
          </div>
        </div>
        <div className={classes.statCard}>
          <Activity size={48} color={theme.colors.primary} style={{ opacity: 0.8 }} />
          <div className={classes.statText}>
            <span className={classes.statValue}>89</span>
            <span className={classes.statLabel}>Lives Saved</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h2 className={classes.sectionTitle}>
          <HeartPulse color={theme.colors.primary} size={32} /> Upcoming Donation Drives
        </h2>
        <div className={classes.cardGrid}>
          {drives.length === 0 ? (
            <p>No upcoming drives found. Please check back later!</p>
          ) : (
            drives.map(drive => (
              <div key={drive.id} className={classes.driveCard}>
                <h3 className={classes.driveTitle}>{drive.name}</h3>
                <div className={classes.driveInfo}>
                  <Calendar size={20} color={theme.colors.primary} />
                  {new Date(drive.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                <div className={classes.driveInfo}>
                  <MapPin size={20} color={theme.colors.primary} />
                  {drive.location}
                </div>
                <div className={classes.driveInfo} style={{marginTop: '0.5rem', color: theme.colors.textMain}}>
                  <strong>Bank:</strong> {drive.blood_banks?.name}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

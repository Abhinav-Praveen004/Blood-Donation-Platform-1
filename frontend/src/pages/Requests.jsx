import React, { useState, useEffect } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { requestService, recipientService } from '../api';
import { Search, Loader, Droplet, User, Phone } from 'lucide-react';

const useStyles = createUseStyles((theme) => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    animation: '$fadeIn 0.5s ease',
  },
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme.colors.surface,
    padding: '2rem',
    borderRadius: theme.radii.lg,
    boxShadow: theme.shadows.sm,
    border: `1px solid ${theme.colors.border}`,
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    color: theme.colors.textMain,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(300px, 1fr) 2fr',
    gap: '2rem',
    alignItems: 'start',
  },
  panel: {
    background: theme.colors.surface,
    padding: '2rem',
    borderRadius: theme.radii.lg,
    boxShadow: theme.shadows.sm,
    border: `1px solid ${theme.colors.border}`,
  },
  panelTitle: {
    fontSize: '1.4rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: theme.colors.textMain,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontWeight: 600,
    fontSize: '0.95rem',
    color: theme.colors.textMain,
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: theme.radii.md,
    border: `1px solid ${theme.colors.border}`,
    fontSize: '1rem',
    fontFamily: theme.fonts.main,
    '&:focus': {
      outline: 'none',
      borderColor: theme.colors.primary,
    }
  },
  button: {
    padding: '0.8rem',
    background: theme.colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: theme.radii.md,
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: theme.transitions.bounce,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    '&:hover': {
      background: theme.colors.primaryHover,
      transform: 'translateY(-2px)',
    }
  },
  requestCard: {
    border: `1px solid ${theme.colors.border}`,
    padding: '1.5rem',
    borderRadius: theme.radii.md,
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    transition: theme.transitions.default,
    '&:hover': {
      borderColor: theme.colors.primary,
    }
  },
  requestHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bloodBadge: {
    background: 'rgba(255, 40, 75, 0.1)',
    color: theme.colors.primary,
    padding: '0.5rem 1rem',
    borderRadius: theme.radii.full,
    fontWeight: 800,
    fontSize: '1.2rem',
  },
  matchResult: {
    marginTop: '1rem',
    padding: '1rem',
    background: '#F0F9FF',
    borderRadius: theme.radii.md,
    border: '1px solid #BEE3F8',
  },
  matchCard: {
    background: theme.colors.surface,
    padding: '1rem',
    borderRadius: theme.radii.md,
    marginTop: '0.5rem',
    boxShadow: theme.shadows.sm,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
}));

const Requests = () => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const [requests, setRequests] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [formData, setFormData] = useState({ recipient_id: '', blood_type: 'A+', quantity: 1 });
  const [loadingMatch, setLoadingMatch] = useState(null);
  const [matches, setMatches] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reqRes, recRes] = await Promise.all([
        requestService.getRequests(),
        recipientService.getRecipients()
      ]);
      setRequests(reqRes.data);
      setRecipients(recRes.data);
      if (recRes.data.length > 0) {
        setFormData(f => ({ ...f, recipient_id: recRes.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await requestService.createRequest({
        ...formData,
        quantity: Number(formData.quantity)
      });
      fetchData();
    } catch (err) {
      alert('Failed to create request: ' + (err.response?.data?.error || err.message));
    }
  };

  const findMatch = async (reqId) => {
    setLoadingMatch(reqId);
    try {
      const res = await requestService.getMatches(reqId);
      setMatches({ ...matches, [reqId]: res.data });
    } catch (err) {
      alert('Failed to fetch matches');
    } finally {
      setLoadingMatch(null);
    }
  };

  return (
    <div className={classes.page}>
      <div className={classes.header}>
        <h1 className={classes.title}>
          <Droplet color={theme.colors.primary} size={36} /> Blood Requests
        </h1>
      </div>

      <div className={classes.grid}>
        {/* Create Request Panel */}
        <div className={classes.panel}>
          <h2 className={classes.panelTitle}>Create New Request</h2>
          <form className={classes.form} onSubmit={handleCreate}>
            <div className={classes.inputGroup}>
              <label className={classes.label}>Recipient</label>
              <select 
                className={classes.input} 
                value={formData.recipient_id}
                onChange={e => setFormData({...formData, recipient_id: e.target.value})}
                required
              >
                {recipients.length === 0 && <option value="">No recipients registerd</option>}
                {recipients.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.contact})</option>
                ))}
              </select>
            </div>
            
            <div className={classes.inputGroup}>
              <label className={classes.label}>Blood Type Required</label>
              <select 
                className={classes.input}
                value={formData.blood_type}
                onChange={e => setFormData({...formData, blood_type: e.target.value})}
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bt => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </div>

            <div className={classes.inputGroup}>
              <label className={classes.label}>Units (Quantity)</label>
              <input 
                type="number" 
                min="1" 
                className={classes.input}
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
                required
              />
            </div>

            <button type="submit" className={classes.button} disabled={recipients.length === 0}>
              Submit Request
            </button>
          </form>
        </div>

        {/* List Panel */}
        <div className={classes.panel}>
          <h2 className={classes.panelTitle}>Active Requests</h2>
          {requests.length === 0 ? (
            <p>No active requests found.</p>
          ) : (
            requests.map(req => (
              <div key={req.id} className={classes.requestCard}>
                <div className={classes.requestHeader}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{req.recipients?.name || 'Unknown Recipient'}</h3>
                    <p style={{ color: theme.colors.textMuted, margin: '0.2rem 0' }}>
                      Status: <strong>{req.status}</strong> &bull; Quantity: {req.quantity}
                    </p>
                  </div>
                  <div className={classes.bloodBadge}>
                    {req.blood_type}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button 
                    className={classes.button} 
                    style={{ background: theme.colors.secondary, padding: '0.6rem 1rem' }}
                    onClick={() => findMatch(req.id)}
                  >
                    {loadingMatch === req.id ? <Loader size={16} /> : <Search size={16} />}
                    Find Compatible Donors
                  </button>
                </div>

                {/* Match Results */}
                {matches[req.id] && (
                  <div className={classes.matchResult}>
                    <p style={{ margin: '0 0 1rem 0', fontWeight: 600 }}>
                      Compatible Donors Found ({matches[req.id].matches.length})
                    </p>
                    <small>Compatible Types: {matches[req.id].compatibleTypes.join(', ')}</small>
                    
                    {matches[req.id].matches.length === 0 ? (
                      <p style={{ color: theme.colors.error, marginTop: '1rem' }}>No eligible donors found.</p>
                    ) : (
                      matches[req.id].matches.map(donor => (
                        <div key={donor.id} className={classes.matchCard}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={18} color={theme.colors.primary} />
                            <strong>{donor.name}</strong> ({donor.blood_type})
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: theme.colors.textMuted }}>
                            <Phone size={16} /> {donor.contact}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;

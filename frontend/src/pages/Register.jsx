import React, { useState } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { donorService, recipientService } from '../api';
import { UserPlus, Activity, Phone } from 'lucide-react';

const useStyles = createUseStyles((theme) => ({
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    width: '100%',
    animation: '$fadeIn 0.5s ease',
  },
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  },
  card: {
    background: theme.colors.surface,
    padding: '2.5rem',
    borderRadius: theme.radii.lg,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    marginBottom: '2rem',
    textAlign: 'center',
    color: theme.colors.textMain,
  },
  tabs: {
    display: 'flex',
    marginBottom: '2rem',
    background: theme.colors.background,
    padding: '0.5rem',
    borderRadius: theme.radii.full,
  },
  tab: {
    flex: 1,
    padding: '0.75rem',
    textAlign: 'center',
    fontWeight: 600,
    cursor: 'pointer',
    borderRadius: theme.radii.full,
    transition: theme.transitions.default,
    color: theme.colors.textMuted,
    border: 'none',
    background: 'transparent',
    '&.active': {
      background: theme.colors.surface,
      color: theme.colors.primary,
      boxShadow: theme.shadows.sm,
    }
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
    transition: theme.transitions.default,
    fontFamily: theme.fonts.main,
    '&:focus': {
      outline: 'none',
      borderColor: theme.colors.primary,
      boxShadow: `0 0 0 3px rgba(255, 40, 75, 0.1)`,
    }
  },
  button: {
    padding: '1rem',
    background: theme.colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: theme.radii.md,
    fontWeight: 700,
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: theme.transitions.bounce,
    marginTop: '1rem',
    '&:hover': {
      background: theme.colors.primaryHover,
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows.md,
    }
  },
  message: {
    padding: '1rem',
    borderRadius: theme.radii.md,
    textAlign: 'center',
    fontWeight: 600,
    marginTop: '1rem',
    '&.success': { background: '#E6FFFA', color: theme.colors.success },
    '&.error': { background: '#FFF5F5', color: theme.colors.error },
  }
}));

const Register = () => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  const [type, setType] = useState('donor'); // 'donor' | 'recipient'
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    blood_type: 'A+',
    contact: '',
    last_donation_date: ''
  });
  const [status, setStatus] = useState(null);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      if (type === 'donor') {
        const payload = { ...formData, age: Number(formData.age) };
        if (!payload.last_donation_date) delete payload.last_donation_date;
        await donorService.createDonor(payload);
      } else {
        const { name, blood_type, contact } = formData;
        await recipientService.createRecipient({ name, blood_type, contact });
      }
      setStatus({ type: 'success', text: 'Registration successful!' });
      setFormData({ name: '', age: '', blood_type: 'A+', contact: '', last_donation_date: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.error || err.message });
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <h2 className={classes.title}>Registration Portal</h2>
        
        <div className={classes.tabs}>
          <button 
            className={`${classes.tab} ${type === 'donor' ? 'active' : ''}`}
            onClick={() => { setType('donor'); setStatus(null); }}
          >
            I want to Donate
          </button>
          <button 
            className={`${classes.tab} ${type === 'recipient' ? 'active' : ''}`}
            onClick={() => { setType('recipient'); setStatus(null); }}
          >
            I need Blood
          </button>
        </div>

        <form className={classes.form} onSubmit={handleSubmit}>
          <div className={classes.inputGroup}>
            <label className={classes.label}>Full Name</label>
            <input required className={classes.input} name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
          </div>

          <div className={classes.inputGroup}>
            <label className={classes.label}>Blood Type</label>
            <select className={classes.input} name="blood_type" value={formData.blood_type} onChange={handleChange}>
              {bloodTypes.map(bt => <option key={bt} value={bt}>{bt}</option>)}
            </select>
          </div>

          <div className={classes.inputGroup}>
            <label className={classes.label}>Contact Number</label>
            <input required className={classes.input} name="contact" value={formData.contact} onChange={handleChange} placeholder="+1 234 567 8900" />
          </div>

          {type === 'donor' && (
            <>
              <div className={classes.inputGroup}>
                <label className={classes.label}>Age</label>
                <input required type="number" min="18" max="65" className={classes.input} name="age" value={formData.age} onChange={handleChange} placeholder="25" />
              </div>
              <div className={classes.inputGroup}>
                <label className={classes.label}>Last Donation Date (Optional)</label>
                <input type="date" className={classes.input} name="last_donation_date" value={formData.last_donation_date} onChange={handleChange} />
              </div>
            </>
          )}

          <button type="submit" className={classes.button}>
            <UserPlus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Register as {type === 'donor' ? 'Donor' : 'Recipient'}
          </button>          
        </form>

        {status && (
          <div className={`${classes.message} ${status.type}`}>
            {status.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;

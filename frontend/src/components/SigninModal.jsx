import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/authContext.js';

// The two self-signup tabs. `role` must match the backend's SELF_SIGNUP_ROLES.
const TABS = [
  {
    role: 'customer',
    label: 'User',
    subtext: 'Sign in to discover and book venues.',
  },
  {
    role: 'venueOwner',
    label: 'Venue Owner',
    subtext: 'Sign in to list and manage your venues.',
  },
];

export function SigninModal() {
  const { signinOpen, closeSignin, loginWithGoogle } = useAuth();
  const [activeRole, setActiveRole] = useState(TABS[0].role);
  const [error, setError] = useState('');

  if (!signinOpen) return null;

  const activeTab = TABS.find((t) => t.role === activeRole);

  function selectTab(role) {
    setActiveRole(role);
    setError('');
  }

  async function handleSuccess(credentialResponse) {
    setError('');
    try {
      // credentialResponse.credential is the Google ID token (a JWT).
      // loginWithGoogle closes this modal on success.
      await loginWithGoogle(credentialResponse.credential, activeRole);
    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.');
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSignin();
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <h2 className="font-semibold text-gray-900">Sign in to BookMyVenue</h2>
          <button
            onClick={closeSignin}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center gap-6 p-6">

          {/* Tabs */}
          <div className="flex w-full rounded-lg border border-gray-200 p-1">
            {TABS.map((tab) => (
              <button
                key={tab.role}
                onClick={() => selectTab(tab.role)}
                className={
                  'flex-1 rounded-md px-4 py-2 text-sm font-medium transition ' +
                  (activeRole === tab.role
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50')
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          <p className="text-sm text-gray-500">{activeTab.subtext}</p>

          {/* Re-mount the button per tab so it reflects the current selection. */}
          <GoogleLogin
            key={activeRole}
            onSuccess={handleSuccess}
            onError={() => setError('Google sign in was cancelled or failed.')}
          />

          {error && <p className="text-center text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

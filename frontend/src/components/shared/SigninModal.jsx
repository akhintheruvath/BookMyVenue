import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/authContext.js';

// Customer Google sign-in popup
export function SigninModal() {
  const { signinOpen, closeSignin, loginWithGoogle } = useAuth();
  const [error, setError] = useState('');

  if (!signinOpen) return null;

  async function handleSuccess(credentialResponse) {
    setError('');
    try {
      // credentialResponse.credential is the Google ID token (a JWT).
      // loginWithGoogle closes this modal on success.
      await loginWithGoogle(credentialResponse.credential);
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

          <p className="text-sm text-gray-500">
            Sign in to discover and book venues.
          </p>

          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setError('Google sign in was cancelled or failed.')}
          />

          {error && <p className="text-center text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}

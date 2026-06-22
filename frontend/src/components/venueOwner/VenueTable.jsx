import { useState } from 'react';

function statusBadge(status) {
  const map = {
    DRAFT:           'bg-gray-100 text-gray-600',
    EDIT_DRAFT:      'bg-yellow-100 text-yellow-700',
    PENDING:         'bg-blue-100 text-blue-700',
    APPROVED:        'bg-green-100 text-green-700',
    REJECTED:        'bg-red-100 text-red-600',
    CHANGES_PENDING: 'bg-orange-100 text-orange-700',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  );
}

function VenueRow({ venue, onAction }) {
  const [busy, setBusy] = useState(false);

  async function handle(action) {
    setBusy(true);
    try {
      await onAction(action, venue);
    } finally {
      setBusy(false);
    }
  }

  const canSubmit  = ['DRAFT', 'EDIT_DRAFT'].includes(venue.status);
  const isApproved = venue.status === 'APPROVED';
  // Backend only hard-deletes DRAFT / EDIT_DRAFT; hide the button elsewhere.
  const canDelete  = ['DRAFT', 'EDIT_DRAFT'].includes(venue.status);

  return (
    <tr className="border-b last:border-0 hover:bg-gray-50">
      <td className="py-3 px-4 text-sm font-medium text-gray-900 max-w-xs truncate">{venue.name}</td>
      <td className="py-3 px-4 text-sm text-gray-500">{venue.city || '—'}</td>
      <td className="py-3 px-4">{statusBadge(venue.status)}</td>
      <td className="py-3 px-4 text-sm text-gray-500">
        {venue.isActive ? (
          <span className="text-green-600 text-xs font-medium">Visible</span>
        ) : (
          <span className="text-gray-400 text-xs font-medium">Hidden</span>
        )}
      </td>
      <td className="py-3 px-4 text-sm text-right">
        <div className="flex items-center justify-end gap-2 flex-wrap">
          {canSubmit && (
            <button
              disabled={busy}
              onClick={() => handle('submit')}
              className="px-3 py-1 text-xs border border-blue-500 text-blue-600 rounded hover:bg-blue-50 disabled:opacity-50 cursor-pointer"
            >
              Submit
            </button>
          )}
          <button
            disabled={busy}
            onClick={() => handle('edit')}
            className="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
          >
            Edit
          </button>
          {isApproved && (
            venue.isActive ? (
              <button
                disabled={busy}
                onClick={() => handle('disable')}
                className="px-3 py-1 text-xs border border-gray-300 text-gray-500 rounded hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
              >
                Disable
              </button>
            ) : (
              <button
                disabled={busy}
                onClick={() => handle('enable')}
                className="px-3 py-1 text-xs border border-green-400 text-green-600 rounded hover:bg-green-50 disabled:opacity-50 cursor-pointer"
              >
                Enable
              </button>
            )
          )}
          {canDelete && (
            <button
              disabled={busy}
              onClick={() => handle('delete')}
              className="px-3 py-1 text-xs border border-red-300 text-red-500 rounded hover:bg-red-50 disabled:opacity-50 cursor-pointer"
            >
              {venue.status === 'EDIT_DRAFT' ? 'Discard Edit' : 'Delete'}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function VenueTable({ venues, onAction, emptyText }) {
  if (venues.length === 0) {
    return <p className="py-10 text-center text-gray-400 text-sm">{emptyText}</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-xs text-gray-400 uppercase tracking-wide">
            <th className="py-2 px-4 font-medium">Name</th>
            <th className="py-2 px-4 font-medium">City</th>
            <th className="py-2 px-4 font-medium">Status</th>
            <th className="py-2 px-4 font-medium">Visibility</th>
            <th className="py-2 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {venues.map((v) => (
            <VenueRow key={v._id} venue={v} onAction={onAction} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

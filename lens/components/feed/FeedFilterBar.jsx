"use client";

const FILTERS = [
  { key: 'personalized', label: 'All' },
  { key: 'life-stage',   label: 'Life Stage' },
  { key: 'interests',    label: 'Interests' },
  { key: 'critical',     label: 'Critical' },
];

const FeedFilterBar = ({ activeFilter, onFilterChange }) => (
  <div
    role="tablist"
    aria-label="Recommendation filters"
    className="mb-6 flex flex-wrap gap-2"
  >
    {FILTERS.map(({ key, label }) => (
      <button
        key={key}
        role="tab"
        aria-selected={activeFilter === key}
        onClick={() => onFilterChange(key)}
        className={
          activeFilter === key
            ? 'rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            : 'rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        }
      >
        {label}
      </button>
    ))}
  </div>
);

export default FeedFilterBar;

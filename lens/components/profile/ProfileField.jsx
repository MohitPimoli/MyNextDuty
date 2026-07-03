const ProfileField = ({ label, value, badge }) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-sm text-gray-500">{label}</span>
    {badge ?? (
      <span className="text-sm font-medium text-gray-900">
        {value ?? '—'}
      </span>
    )}
  </div>
);

export default ProfileField;

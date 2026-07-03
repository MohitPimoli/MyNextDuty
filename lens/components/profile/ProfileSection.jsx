const ProfileSection = ({ title, children }) => (
  <section
    aria-label={title}
    className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
  >
    <h2 className="mb-4 text-base font-semibold text-gray-900">{title}</h2>
    <div className="divide-y divide-gray-100">{children}</div>
  </section>
);

export default ProfileSection;

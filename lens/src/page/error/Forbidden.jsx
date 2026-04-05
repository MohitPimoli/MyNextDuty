const Forbidden = () => {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">403</h1>
      <p className="text-gray-600">You do not have permission to access this resource.</p>
    </div>
  );
};

export default Forbidden;

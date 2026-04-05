const ServerError = () => {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">Something went wrong</h1>
      <p className="text-gray-600">A server error occurred. Please try again later.</p>
    </div>
  );
};
export default ServerError;

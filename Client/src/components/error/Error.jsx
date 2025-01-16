function Error({ error }) {
  return (
    <div className="text-red-600">
      Error loading notes: {error?.message || "Unknown error"}
      <button
        className="ml-2 text-blue-500 hover:underline"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );
}

export default Error;

const OverallStatus = () => {
  return (
    <div>
      <p>You've encountered a bug</p>
      <button onClick={() => window.location.reload()}>Reload Page</button>
    </div>
  );
};

export default OverallStatus;

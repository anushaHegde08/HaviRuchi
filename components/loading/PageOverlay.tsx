export const PageOverlay = ({ show }: { show: boolean }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 bg-transparent cursor-not-allowed" />
  );
};

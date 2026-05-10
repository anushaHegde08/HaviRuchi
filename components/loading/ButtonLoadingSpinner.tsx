const ButtonLoadingSpinner = ({ loadingText }: { loadingText: string }) => {
  return (
    <span className="flex items-center gap-2">
      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
      {loadingText}
    </span>
  );
};

export default ButtonLoadingSpinner;

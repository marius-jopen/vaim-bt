const SubmitButton = ({ text, colorClass }) => (
  <div className="mb-4">
    <button
      type="submit"
      className={`flex w-full justify-center rounded-full pt-1.5 pb-2 px-4 text-xl ${colorClass} `}
    >
      {text}
    </button>
  </div>
);

export default SubmitButton;

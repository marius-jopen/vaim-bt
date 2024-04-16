const SubmitButton = ({ text, colorClass }) => (
  <div className="mb-4">
    <button
      type="submit"
      className={`flex w-full justify-center rounded-full py-2 px-4 ${colorClass} `}
    >
      {text}
    </button>
  </div>
);

export default SubmitButton;

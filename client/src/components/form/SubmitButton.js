const SubmitButton = ({ text, colorClass }) => (
  <div className="mb-4">
    <button
      type="submit"
      className={`flex w-full justify-center rounded-md ${colorClass} px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
    >
      {text}
    </button>
  </div>
);

export default SubmitButton;

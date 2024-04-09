const TextAreaInput = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={label} className="block text-sm font-medium leading-6 text-gray-900">
      {label}
    </label>
    <div className="mt-0.5">
      <textarea
        rows={4}
        name={label}
        value={value}
        onChange={onChange}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        defaultValue={''}
      />
    </div>
  </div>
  );
  
  export default TextAreaInput;
  
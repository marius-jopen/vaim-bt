const TextAreaInput = ({ label, value, onChange, outsideClass }) => (
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
        className={`${outsideClass} block w-full border-none`}
        defaultValue={''}
      />
    </div>
  </div>
  );
  
  export default TextAreaInput;
  

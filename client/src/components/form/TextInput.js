import React from 'react';

const TextInput = ({ label, type = 'text', value, onChange, required = false, placeholder }) => (
  <div className="mb-6">
    <label htmlFor={label} className="block text-sm font-medium leading-6 text-gray-900">
      {label}
    </label>
    <div className="mt-0.5">
      <input
        type={type}
        name={label}
        id={label} // Ensure the label's 'for' attribute maps to this 'id'
        value={value}
        onChange={onChange}
        required={required} // Apply the 'required' prop to the input
        placeholder={placeholder || "you@example.com"} // Use passed placeholder or default
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
    </div>
  </div>
);

export default TextInput;

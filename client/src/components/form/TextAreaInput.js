const TextAreaInput = ({ label, value, onChange, outsideClass, big }) => (
  <div className="mb-4 relative">
    {big &&
      <label htmlFor={label} className="absolute top-2 left-3 block text-neutral-400 text-xl">
        {label}
      </label>
    }

    <div className="mt-0.5">
      <textarea
        rows={4}
        name={label}
        value={value}
        onChange={onChange}
        className={`${outsideClass} ${big ? 'pt-[38px]' : ''} block w-full border-none`}
        defaultValue={''}
      />
    </div>
  </div>
  );
  
  export default TextAreaInput;
  

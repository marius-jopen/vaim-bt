const TextAreaInput = ({ label, value, onChange }) => (
    <div className='flex gap-4 mb-4'>
      <label className='min-w-24'>{label}:</label>
      <textarea
        className='w-full h-32 bg-white border rounded-xl px-3 py-2'
        value={value}
        onChange={onChange}
      />
    </div>
  );
  
  export default TextAreaInput;
  
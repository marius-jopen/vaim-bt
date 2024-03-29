const TextInput = ({ label, type = 'text', value, onChange }) => (
    <div className='flex gap-4 mb-4'>
      <label className='min-w-24'>{label}:</label>
      <input
        className='w-full bg-white border rounded-xl px-3 py-2'
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
  
  export default TextInput;
  
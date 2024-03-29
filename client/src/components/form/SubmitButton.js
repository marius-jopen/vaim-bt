const SubmitButton = ({ text, colorClass }) => (
    <button type="submit" className={`uppercase cursor-pointer w-full py-2 border transition rounded-lg ${colorClass}`}>{text}</button>
  );
  
  export default SubmitButton;
  
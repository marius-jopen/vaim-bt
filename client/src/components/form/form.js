import React, { useEffect, useState } from 'react';
import handleSubmitImage from './handleSubmitImage';
import handleSubmitAnimation from './handleSubmitAnimation';
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import SubmitButton from './SubmitButton';
import LooperSwitch from '../looperSwitch';
import ControlNet from './ControlNet'; // Ensure path correctness
import LoadSettings from './LoadSettings'; // Ensure path correctness

export default function Form() {
  const [prompts, setPrompts] = useState('beautiful lady, (freckles), big smile, ruby eyes, short hair, dark makeup, head and shoulders portrait, cover');
  const [maxFrames, setMaxFrames] = useState('100');
  const [positivePrompts, setPositivePrompts] = useState('hyperdetailed photography, soft light, masterpiece, (film grain:1.3), (complex:1.2), (depth of field:1.4), detailed');
  const [negativePrompts, setNegativePrompts] = useState('grayscale, bw, bad photo, bad photography, bad art:1.4), (watermark, signature, text font, username, error, logo, words, letters, digits, autograph, trademark, name:1.2), (bad hands, bad anatomy, bad body, bad face, bad teeth, bad arms, bad legs, deformities:1.3), morbid, ugly, mutated malformed, mutilated, poorly lit, bad shadow, draft, cropped, out of frame, cut off, censored, jpeg artifacts, glitch, duplicate');
  const [loras, setLoras] = useState('<lora:add-detail-xl:1>');
  const [cn1Enabled, setCn1Enabled] = useState(true);
  const [manualFilePath, setManualFilePath] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [savedEntries, setSavedEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null); // Corrected to manage the entire selected entry object

  useEffect(() => {
    const fetchSavedEntries = async () => {
      try {
        const response = await fetch('http://localhost:4000/list-saved-entries');
        const entries = await response.json();
        setSavedEntries(entries);
        if (entries.length > 0) {
          const mostRecentEntry = entries[0]; // Assuming entries are already sorted; adjust if necessary
          setSelectedEntry(mostRecentEntry); // Directly set the most recent entry object
          applySettings(mostRecentEntry);
        }
      } catch (error) {
        console.error("Failed to fetch saved settings:", error);
      }
    };
    fetchSavedEntries();
  }, []);


  const applySettings = (entry) => {
    if (entry) {
      setPrompts(entry.prompts || '');
      setMaxFrames(entry.maxFrames || '100');
      setPositivePrompts(entry.positivePrompts || '');
      setNegativePrompts(entry.negativePrompts || '');
      setLoras(entry.loras || '<lora:add-detail-xl:1>');
      
      // Check if entry.cn1Enabled is "N/A", undefined, or null, and set it to false; otherwise, use its actual value
      setCn1Enabled(entry.cn1Enabled === "N/A" ? false : entry.cn1Enabled ?? false);
  
      // Only set manualFilePath if cn1Enabled is true
      setManualFilePath(entry.cn1Enabled && entry.cn1Enabled !== "N/A" ? entry.cn1VidPath || '' : '');
    }
  };
  
  
  const handleSelectChange = (entry) => {
    console.log('handleSelectChange called with:', entry);
    applySettings(entry);
    setSelectedEntry(entry); //
  };

  const handleAnimationSubmit = async (e) => {
    e.preventDefault();
    // Use manualFilePath in your submission logic
    await handleSubmitAnimation(e, { prompts, maxFrames, positivePrompts, loras, negativePrompts, cn1Enabled, cn1VidPath: manualFilePath }, setResponseMessage);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    await handleSubmitImage(e, { prompts, positivePrompts, loras, negativePrompts, cn1Enabled, cn1VidPath: manualFilePath,maxFrames }, setResponseMessage);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
            <LooperSwitch />
            <LoadSettings
              savedEntries={savedEntries}
              selectedEntry={selectedEntry}
              setSelectedEntry={handleSelectChange} // Ensure this matches the function name in Form
            />
          </div>

          <div>
            <form onSubmit={handleImageSubmit} className='text-xs'>
              <SubmitButton text="Generate Image" colorClass="bg-blue-200 hover:bg-blue-300" />
            </form>

            <form onSubmit={handleAnimationSubmit} className='text-xs'>
              <SubmitButton text="Generate Video" colorClass="bg-green-200 hover:bg-green-300" />
              <ControlNet cn1Enabled={cn1Enabled} setCn1Enabled={setCn1Enabled} manualFilePath={manualFilePath} setManualFilePath={setManualFilePath} />
              <TextAreaInput label="Prompts" value={prompts} onChange={(e) => setPrompts(e.target.value)} />
              <TextAreaInput label="Positive Prompts" value={positivePrompts} onChange={(e) => setPositivePrompts(e.target.value)} />
              <TextAreaInput label="Negative Prompts" value={negativePrompts} onChange={(e) => setNegativePrompts(e.target.value)} />
              <TextAreaInput label="Loras / Textembeds" value={loras} onChange={(e) => setLoras(e.target.value)} />
              <TextInput label="Max Frames" type="number" value={maxFrames} onChange={(e) => setMaxFrames(e.target.value)} required />     
            </form>
          </div>
      </div>
    </>
  );
}

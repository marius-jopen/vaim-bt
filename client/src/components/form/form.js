import React, { useEffect, useState } from 'react';
import handleSubmitImage from './handleSubmitImage';
import handleSubmitAnimation from './handleSubmitAnimation';
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import SubmitButton from './SubmitButton';

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
  const [selectedEntryId, setSelectedEntryId] = useState('');

  useEffect(() => {
    const fetchSavedEntries = async () => {
      try {
        // Fetch the list of saved settings
        const response = await fetch('http://localhost:4000/list-saved-entries');
        const entries = await response.json();
        setSavedEntries(entries);

        // Fetch the latest settings and apply them
        if (entries.length > 0) {
          const mostRecentEntry = entries[entries.length - 1];
          applySettings(mostRecentEntry);
        }
      } catch (error) {
        console.error("Failed to fetch saved settings:", error);
      }
    };
  
    fetchSavedEntries();
  }, []);

  const applySettings = (settings) => {
    setPrompts(settings.prompts);
    setMaxFrames(settings.maxFrames);
    setPositivePrompts(settings.positivePrompts);
    setNegativePrompts(settings.negativePrompts);
    setLoras(settings.loras);
    setCn1Enabled(settings.cn1Enabled);
    setManualFilePath(settings.cn1VidPath);
  };

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    setSelectedEntryId(selectedId);
    const selectedEntry = savedEntries.find(entry => entry.timestamp === selectedId);
    if (selectedEntry) {
      applySettings(selectedEntry);
    }
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
      <div className="order-2 lg:order-1">
        <form onSubmit={handleAnimationSubmit} className='text-xs'>
          <TextAreaInput label="Prompts" value={prompts} onChange={(e) => setPrompts(e.target.value)} />
          <TextAreaInput label="Positive Prompts" value={positivePrompts} onChange={(e) => setPositivePrompts(e.target.value)} />
          <TextAreaInput label="Negative Prompts" value={negativePrompts} onChange={(e) => setNegativePrompts(e.target.value)} />
          <TextAreaInput label="Loras / Textembeds" value={loras} onChange={(e) => setLoras(e.target.value)} />
          <TextInput label="Max Frames" type="number" value={maxFrames} onChange={(e) => setMaxFrames(e.target.value)} required />     
         
          <button type="button" className="mb-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={() => setCn1Enabled(!cn1Enabled)}>
            {cn1Enabled ? "Controlnet is On" : "Controlnet is Off"}
          </button>

          {cn1Enabled && (
            <div className="mt-4">  
              <TextInput
                label="Video File Path"
                type="text"
                value={manualFilePath}
                onChange={(e) => setManualFilePath(e.target.value)}
                required
                placeholder="Complete field to .mp4 video"
              />
            </div>
          )}


          <SubmitButton text="Generate Video" colorClass="bg-green-200 hover:bg-green-300" />
        </form>

        <form onSubmit={handleImageSubmit} className='mt-4 text-xs'>
          <SubmitButton text="Generate Image" colorClass="bg-blue-200 hover:bg-blue-300" />
        </form>

           {/* Dropdown to select a saved entry */}
      <select onChange={handleSelectChange} value={selectedEntryId} className="mb-4">
        {savedEntries.map(entry => (
          <option key={entry.timestamp} value={entry.timestamp}>
            {entry.prompts} - {new Date(entry.timestamp).toLocaleString()}
          </option>
        ))}
      </select>
      </div>
    </>
  );
}

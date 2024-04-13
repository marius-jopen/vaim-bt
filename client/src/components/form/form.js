import React, { useEffect, useState } from 'react';
import handleSubmitImage from './handleSubmitImage';
import handleSubmitAnimation from './handleSubmitAnimation';
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import SubmitButton from './SubmitButton';
import LooperSwitch from '../looperSwitch';
import ControlNet from './ControlNet'; // Ensure path correctness
import LoadSettings from './LoadSettings'; // Ensure path correctness
import FindRelevantSentence from '../chatgpt/FindRelevantSentence';
import { usePrompts } from '../promptsContext'; // Adjust the path as necessary

export default function Form() {
  // const [prompts, setPrompts] = useState('beautiful lady, (freckles), big smile, ruby eyes, short hair, dark makeup, head and shoulders portrait, cover');
  const [maxFrames, setMaxFrames] = useState('300');
  const [positivePrompts, setPositivePrompts] = useState('(flowers:0.6), (clean, futuristic:1.2), (coloured background:2), (saturated colours:1.2), flat_color, (symmetry:1.2), ');
  const [negativePrompts, setNegativePrompts] = useState('blurry, unsharp, grayscale, bw, bad photo, bad photography, bad art:1.4), (watermark, signature, text font, username, error, logo, words, letters, digits, autograph, trademark, name:1.2), (bad hands, bad anatomy, bad body, bad face, bad teeth, bad arms, bad legs, deformities:1.3), morbid, ugly, mutated malformed, mutilated, poorly lit, bad shadow, draft, cropped, out of frame, cut off, censored, jpeg artifacts, glitch, duplicate');
  const [loras, setLoras] = useState(' <lora:add-detail-xl:1>  <lora:Wake_Up_sdxl:1>');
  const [cn1Enabled, setCn1Enabled] = useState(false);
  const [manualFilePath, setManualFilePath] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [savedEntries, setSavedEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null); // Corrected to manage the entire selected entry object
  const { prompts, setPrompts } = usePrompts();
  const [caption, setCaption] = useState(''); // New state for caption

  useEffect(() => {
    const fetchSavedEntries = async () => {
      try {
        const response = await fetch('http://localhost:4000/list-saved-entries');
        const entries = await response.json();
        setSavedEntries(entries);
        if (entries.length > 0) {
          const mostRecentEntry = entries[entries.length]; // Assuming entries are already sorted; adjust if necessary
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
      setPrompts('(A clean render of a ' + entry.prompts.prompts + ':3)' || '');
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
    // console.log('handleSelectChange called with:', entry);
    applySettings(entry);
    setSelectedEntry(entry); //
  };

  const handleAnimationSubmit = async (e) => {
    e.preventDefault();
    // Use manualFilePath in your submission logic
    await handleSubmitAnimation(e, { caption, prompts, maxFrames, positivePrompts, loras, negativePrompts, cn1Enabled, cn1VidPath: manualFilePath }, setResponseMessage);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    await handleSubmitImage(e, { prompts, positivePrompts, loras, negativePrompts, cn1Enabled, cn1VidPath: manualFilePath,maxFrames }, setResponseMessage);
  };

  
  return (
    <>
      <div>
        <div className='text-center text-4xl mt-2 mb-4 font-bold'>
          vAIm
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-8">
          <div>
            <FindRelevantSentence setPrompts={setPrompts} />
            <LooperSwitch />
          </div>

          <div>
            <div className='flex gap-4'>
              <form onSubmit={handleAnimationSubmit} className='text-xs w-full'>
                <SubmitButton text="Generate Video" colorClass="bg-green-400 hover:bg-green-500" />
              </form>
              <form onSubmit={handleImageSubmit} className='text-xs w-full'>
                <SubmitButton text="Generate Image" colorClass="bg-blue-400 hover:bg-blue-500" />
              </form>
            </div>
            {/* <TextAreaInput label="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} /> */}
            <TextAreaInput label="Prompts" value={prompts.prompts} onChange={(e) => setPrompts({...prompts, prompts: e.target.value})} />
            <TextAreaInput label="Positive Prompts" value={positivePrompts} onChange={(e) => setPositivePrompts(e.target.value)} />
            <TextAreaInput label="Negative Prompts" value={negativePrompts} onChange={(e) => setNegativePrompts(e.target.value)} />
            <TextAreaInput label="Loras / Textembeds" value={loras} onChange={(e) => setLoras(e.target.value)} />
            <TextInput label="Max Frames" type="number" value={maxFrames} onChange={(e) => setMaxFrames(e.target.value)} required />     
            <ControlNet cn1Enabled={cn1Enabled} setCn1Enabled={setCn1Enabled} manualFilePath={manualFilePath} setManualFilePath={setManualFilePath} />
          </div>
        </div>
        
        {/* <div className='mb-8'>
          <LoadSettings
            savedEntries={savedEntries}
            selectedEntry={selectedEntry}
            setSelectedEntry={handleSelectChange} // Ensure this matches the function name in Form
          />
        </div> */}
      </div>
    </>
  );
}
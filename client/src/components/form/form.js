import React, { useEffect, useState } from 'react';
import handleSubmitImage from './handleSubmitImage';
import handleSubmitAnimation from './handleSubmitAnimation';
import TextAreaInput from './TextAreaInput';
import SubmitButton from './SubmitButton';
import LooperSwitch from '../looperSwitch';
import { usePrompts } from '../promptsContext';

export default function Form() {
  const [positivePrompts, setPositivePrompts] = useState('(flowers:0.6), (clean:1.2), (coloured background:2), (saturated colours:1.2), flat_color, (symmetry:0.6)');
  const [negativePrompts, setNegativePrompts] = useState('blurry, unsharp, grayscale, bw, bad photo, bad photography, bad art:1.4), (watermark, signature, text font, username, error, logo, words, letters, digits, autograph, trademark, name:1.2), (bad hands, bad anatomy, bad body, bad face, bad teeth, bad arms, bad legs, deformities:1.3), morbid, ugly, mutated malformed, mutilated, poorly lit, bad shadow, draft, cropped, out of frame, cut off, censored, jpeg artifacts, glitch, duplicate');
  const [loras, setLoras] = useState(' <lora:add-detail-xl:1>  <lora:Wake_Up_sdxl:1>');
  const [responseMessage, setResponseMessage] = useState('');
  const { prompts, setPrompts } = usePrompts();
  const [caption, setCaption] = useState('');
  const [sentence, setSentence] = useState('');
  const [poem, setPoem] = useState({ speech: '', source: '', prompts: '' });
  const [loading, setLoading] = useState(false);

  const handleAnimationSubmit = async (e) => {
    e.preventDefault();
    await handleSubmitAnimation(e, { caption, prompts, positivePrompts, loras, negativePrompts }, setResponseMessage);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    await handleSubmitImage(e, { prompts, positivePrompts, loras, negativePrompts }, setResponseMessage);
  };

  const generatePoem = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/search-sentence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentence }),
      });
      const data = await response.json();
      if (data.success && data.poem) {
        const lines = data.poem.split('\n');
        const parts = lines.reduce((acc, line) => {
          const [key, value] = line.split(':');
          if (key && value) { // Check if both key and value are present
            acc[key.trim().toLowerCase()] = value.trim();
          }
          return acc;
        }, {});
        setPoem(parts);
        setPrompts(parts);
      } else {
        alert('Failed to generate poem: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching poem:', error);
      alert('Error fetching poem. Please check the console for more details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <div className='h-[60vh] bg-[#00ff94]'>
          <div className='w-2/3 mx-auto'>
            <div className='text-center'>
              Wie verändert künstliche Intelligenz unsere demokratische Gesellschaft?
            </div>

            <div>
              <TextAreaInput outsideClass="rounded-2xl" label="Ich wünsche mir für Deutschland, dass..." value={sentence} onChange={(e) => setSentence(e.target.value)} />
            </div>

            <div className='flex justify-between gap-4'>
              <form onSubmit={generatePoem} className='w-full'>
                <SubmitButton text={loading ? "Generating..." : "Generate Thoughts"} colorClass="bg-black text-white" disabled={loading} />
              </form>

              <form onSubmit={handleImageSubmit} className='w-full'>
                <SubmitButton text="Generate Image" colorClass="bg-neutral-400 text-black" />
              </form>

              <form onSubmit={handleAnimationSubmit} className='w-full'>
                <SubmitButton text="Generate Video" colorClass="bg-white text-black" />
              </form>
            </div>
          </div>
        </div>

        <div className='h-[40vh] bg-black'>
          BLACK
        </div>

        <div className='bg-neutral-100 py-3 px-5 rounded-lg border border-neutral-200 text-sm mb-6'>
              <div><span className='font-medium'>Speech:</span> {poem.speech}</div>
              <div><span className='font-medium'>Source:</span> {poem.source}</div>
              <div><span className='font-medium'>Prompts:</span> {poem.prompts}</div>
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-8">
          <div>
            <LooperSwitch />
          </div>

          <div>
            <div className='flex gap-4'>

            </div>
            <TextAreaInput label="Prompts" value={prompts.prompts} onChange={(e) => setPrompts({...prompts, prompts: e.target.value})} />
            <TextAreaInput label="Positive Prompts" value={positivePrompts} onChange={(e) => setPositivePrompts(e.target.value)} />
            <TextAreaInput label="Negative Prompts" value={negativePrompts} onChange={(e) => setNegativePrompts(e.target.value)} />
            <TextAreaInput label="Loras / Textembeds" value={loras} onChange={(e) => setLoras(e.target.value)} />
          </div>
        </div>
      </div>
    </>
  );
}

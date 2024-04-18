import React, { useEffect, useState } from 'react';
import handleSubmitImage from './handleSubmitImage';
import handleSubmitAnimation from './handleSubmitAnimation';
import TextAreaInput from './TextAreaInput';
import SubmitButton from './SubmitButton';
import LooperSwitch from '../looperSwitch';
import { usePrompts } from '../promptsContext';

export default function Form() {
  const [positivePrompts, setPositivePrompts] = useState('in the style of unreal engine futuristic mirror');
  // const [negativePrompts, setNegativePrompts] = useState('blurry, unsharp, grayscale, bw, bad photo, bad photography, bad art:1.4), (watermark, signature, text font, username, error, logo, words, letters, digits, autograph, trademark, name:1.2), (bad hands, bad anatomy, bad body, bad face, bad teeth, bad arms, bad legs, deformities:1.3), morbid, ugly, mutated malformed, mutilated, poorly lit, bad shadow, draft, cropped, out of frame, cut off, censored, jpeg artifacts, glitch, duplicate');
  const [loras, setLoras] = useState(' <lora:unreal_engine_futuristic_mirror_style-000010neu:1>');
  const [responseMessage, setResponseMessage] = useState('');
  const { prompts, setPrompts } = usePrompts();
  const [caption, setCaption] = useState('');
  const [sentence, setSentence] = useState('');
  const [poem, setPoem] = useState({ speech: '', source: '', prompts: '' });
  const [loading, setLoading] = useState(false);

  const handleAnimationSubmit = async (e) => {
    e.preventDefault();
    await handleSubmitAnimation(e, { caption, prompts, positivePrompts, loras }, setResponseMessage);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    await handleSubmitImage(e, { prompts, positivePrompts, loras }, setResponseMessage);
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
        <div className='bg-[#00ff94]'>
          <div className='w-2/3 mx-auto'>
            <div className='text-center text-2xl  pt-20 pb-12'>
              Wie verändert künstliche Intelligenz unsere demokratische Gesellschaft?
            </div>

            <div>
              <TextAreaInput big={false} outsideClass="px-5 py-3 text-neutral-400 rounded-2xl text-2xl" label="Ich wünsche mir für Deutschland, dass..." value={sentence} onChange={(e) => setSentence(e.target.value)} />
            </div>

            <div className='flex justify-between gap-4 pt-3 pb-24'>
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

        <div className='bg-black flex gap-8 pt-6 pb-2 px-6'>
          <div className='text-white w-full'>
            <LooperSwitch />
          </div>

          <div className='text-white w-full text-xl'>
            <div className='pb-8'>
              <div className='text-neutral-400'>
                Rede
              </div> 

              <div className='text-white'>
                {poem.speech}
              </div>
            </div>

            <div>
              <div className='text-neutral-400'>
                Quelle
              </div> 

              <div className='text-white'>
                {poem.source}
              </div>
            </div>
          </div>

          <div className='text-white w-full'>
            <TextAreaInput big={true} outsideClass="text-black text-xl rounded-2xl h-[350px]" label="Prompt" value={prompts.prompts} onChange={(e) => setPrompts({...prompts, prompts: e.target.value})} />
            
            <div className='hidden'>
              <TextAreaInput big={true} outsideClass="text-black rounded-2xl h-20" label="Unterstützende Prompts" value={positivePrompts} onChange={(e) => setPositivePrompts(e.target.value)} />
              <TextAreaInput big={true} outsideClass="text-black rounded-2xl h-24" label="Loras" value={loras} onChange={(e) => setLoras(e.target.value)} />
            </div>
       
            {/* <div className='text-neutral-400 text-right	pb-2'>
              WortWandel, by Marius Jopen & Paula Kühn
            </div> */}
          </div>

        </div>
      </div>
    </>
  );
}

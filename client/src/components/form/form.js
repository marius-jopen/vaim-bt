import React, { useState } from 'react';
import handleSubmitImage from './handleSubmitImage'; // Make sure this path is correct
import handleSubmitAnimation from './handleSubmitAnimation'; // Make sure this path is correct
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import SubmitButton from './SubmitButton';

export default function Form() {
  const [prompts, setPrompts] = useState('beautiful lady, (freckles), big smile, ruby eyes, short hair, dark makeup, head and shoulders portrait, cover');
  const [maxFrames, setMaxFrames] = useState('100');
  const [positivePrompts, setPositivePrompts] = useState('hyperdetailed photography, soft light, masterpiece, (film grain:1.3), (complex:1.2), (depth of field:1.4), detailed');
  const [negativePrompts, setNegativePrompts] = useState('grayscale, bw, bad photo, bad photography, bad art:1.4), (watermark, signature, text font, username, error, logo, words, letters, digits, autograph, trademark, name:1.2), (bad hands, bad anatomy, bad body, bad face, bad teeth, bad arms, bad legs, deformities:1.3), morbid, ugly, mutated malformed, mutilated, poorly lit, bad shadow, draft, cropped, out of frame, cut off, censored, jpeg artifacts, glitch, duplicate');
  const [loras, setLoras] = useState('<lora:add-detail-xl:1>');
  const [responseMessage, setResponseMessage] = useState('');

  const handleAnimationSubmit = async (e) => {
    e.preventDefault();
    await handleSubmitAnimation(e, { prompts, maxFrames, positivePrompts, loras, negativePrompts }, setResponseMessage);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    await handleSubmitImage(e, { prompts, positivePrompts, loras, negativePrompts }, setResponseMessage);
  };

  return (
    <>
      <div className="order-2 lg:order-1">
        <form onSubmit={handleAnimationSubmit} className='text-xs'>
        <TextAreaInput label="Prompts" value={prompts} onChange={(e) => setPrompts(e.target.value)} />
          <TextAreaInput label="Positive Prompts" value={positivePrompts} onChange={(e) => setPositivePrompts(e.target.value)} />
          <TextAreaInput label="Negative Prompts" value={negativePrompts} onChange={(e) => setNegativePrompts(e.target.value)} />
          <TextAreaInput label="Loras" value={loras} onChange={(e) => setLoras(e.target.value)} />
          <TextInput label="Max Frames" type="number" value={maxFrames} onChange={(e) => setMaxFrames(e.target.value)} required />
          <SubmitButton text="Generate Video" colorClass="bg-green-200 hover:bg-green-300" />
        </form>

        <form onSubmit={handleImageSubmit} className='mt-4 text-xs'>
          {/* Image form button only, since details are managed in state */}
          <SubmitButton text="Generate Image" colorClass="bg-blue-200 hover:bg-blue-300" />
        </form>
        {/* <div className='text-xs mt-1 neutral-500 mt-2 text-center'>
          {responseMessage && <p>{responseMessage}</p>}
        </div> */}
      </div>
    </>
  );
}

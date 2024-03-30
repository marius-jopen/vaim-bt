import React from 'react';
import TextInput from './TextInput'; // Adjust the import path as necessary

const ControlNet = ({ cn1Enabled, setCn1Enabled, manualFilePath, setManualFilePath }) => {
    return (
        <>
            <button 
                type="button" 
                className={`mb-4 flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-neutral-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600 
                ${cn1Enabled ? "bg-neutral-600 text-white" : "bg-neutral-300 text-black"}`} // Dynamically change classes based on cn1Enabled
                onClick={() => setCn1Enabled(!cn1Enabled)}
            >
                {cn1Enabled ? "ControlNet is On" : "ControlNet is Off"}
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
        </>
    );
};

export default ControlNet;

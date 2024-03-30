// ControlNet.js
import React from 'react';
import TextInput from './TextInput'; // Adjust the import path as necessary

const ControlNet = ({ cn1Enabled, setCn1Enabled, manualFilePath, setManualFilePath }) => {
    return (
        <>
            <button 
                type="button" 
                className="mb-4 flex w-full justify-center rounded-md bg-neutral-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600" 
                onClick={() => setCn1Enabled(!cn1Enabled)}
            >
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
        </>
    );
};

export default ControlNet;

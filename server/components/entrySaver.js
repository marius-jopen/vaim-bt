// entrySaver.js
import fs from 'fs';
import { join } from 'path';

// Use process.cwd() to get the current working directory (root of the project)
const saveFilePath = join(process.cwd(), 'save.txt');

export function saveEntry({
  prompts,
  positivePrompts,
  negativePrompts,
  loras,
  maxFrames,
  cn1Enabled,
  cn1VidPath
}) {
  const entry = {
    prompts,
    positivePrompts,
    negativePrompts,
    loras,
    maxFrames,
    cn1Enabled,
    cn1VidPath
  };
  const entryLine = JSON.stringify(entry) + '\n';

  try {
    fs.appendFileSync(saveFilePath, entryLine, 'utf8');
    console.log('Entry saved successfully.');
  } catch (err) {
    console.error('Failed to save entry:', err);
  }
}

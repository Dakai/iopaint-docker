// src/routes/api/process.js

import { json } from '@sveltejs/kit';

export async function GET() {
  try {
    // Use the `pgrep` command to get the process ID
    const processId = await exec(`pgrep iopaint`)

    // Check if the process ID is valid
    if (processId) {
      return json({ processId });
    } else {
      return json({ message: 'Process not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error checking process:', error);
    return json({ message: 'Error checking process' }, { status: 500 });
  }
}

// Helper function to execute shell commands
async function exec(command: string) {
  return new Promise((resolve, reject) => {
    const { exec } = require('child_process');
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}


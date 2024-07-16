import type { RequestEvent } from '@sveltejs/kit';
import { exec, spawn } from 'child_process';
import { WebSocket, WebSocketServer } from 'ws';
//import Docker from 'dockerode'

let cmd = "iopaint start --model "
//let cmd = 'python -u test.py start --model ';
let args =
  ' --device=cpu --host=0.0.0.0 --enable-realesrgan \
--realesrgan-model RealESRGAN_x4plus --realesrgan-device cpu \
--enable-gfpgan --gfpgan-device cpu \
--enable-remove-bg --enable-interactive-seg --interactive-seg-model=vit_l --interactive-seg-device=cpu';

let wss: WebSocketServer | undefined;

let currentProcess: ReturnType<typeof spawn> | null = null;

let processData = { id: 0 };

const initWebSocketServer = () => {
  if (!wss) {
    wss = new WebSocketServer({ host: '0.0.0.0', port: 9880 });
    console.log('WebSocketServer started on port 9880');
    wss.on('connection', (ws) => {
      console.log('New WebSocket Connection');
      ws.on('message', (message) => {
        console.log('received: %s', message);
      });
    });
    wss.on('error', (error) => {
      console.log('error', error);
    });
    wss.on('close', () => {
      console.log('WebSocketServer closed');
      wss = undefined;
    });
  }
};

initWebSocketServer();

export const actions = {
  stop: async (req: RequestEvent) => {
    console.log('actions stop', processData);
    if (processData.id) {
      //console.log('stop', processData.id);
      exec('killall iopaint');
      processData.id = 0; // Reset processId after killing
      return { success: true };
    } else {
      return { success: false, error: 'No active process to stop' };
    }
  },

  run: async (req: RequestEvent) => {
    const data = await req.request.formData();
    const model = data.get('model');
    if (!model) {
      return { error: 'No model selected' }
    }
    const run = cmd + model + args
    currentProcess = spawn(run, [], { shell: true })
    //const process = exec(run);
    if (currentProcess.stdout != null) {
      currentProcess.stdout.on('data', (data: any) => {
        wss?.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            console.log('send', data.toString());
            client.send(JSON.stringify({ output: data.toString() }));
          }
        });
      });
    } else if (currentProcess.stderr != null) {
      currentProcess.stderr.on('data', (data: any) => {
        wss?.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ error: data.toString() }));
          }
        });
      });
    }

    currentProcess.on('close', (code) => {
      console.log(`Child process exited with code ${code}`);
      wss?.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'processEnded' }));
        }
      });
      currentProcess = null;
      processData.id = 0;
    });
    currentProcess.pid ? processData.id = currentProcess.pid : null;
    console.log('run', processData.id);

    return { success: true, id: currentProcess.pid };
  }
};

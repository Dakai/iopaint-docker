import type { RequestEvent } from '@sveltejs/kit';
import { exec, spawn } from 'child_process';
import { WebSocket, WebSocketServer } from 'ws';
//import Docker from 'dockerode'

//let cmd = "iopaint start --model "
let cmd = 'python -u test.py start --model ';
let args =
  ' --device=cpu --host=0.0.0.0 --enable-realesrgan \
--realesrgan-model RealESRGAN_x4plus --realesrgan-device cpu \
--enable-gfpgan --gfpgan-device cpu \
--enable-remove-bg --enable-interactive-seg --interactive-seg-model=vit_l --interactive-seg-device=cpu';

let wss: WebSocketServer | undefined;

let currentProcess: ReturnType<typeof spawn> | null = null;

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
    const data = await req.request.formData();
    const processId = data.get('processId');
    console.log(processId)

    //const { processId } = await req.request.json();
    //if (currentProcess && currentProcess.pid === processId) {
    //  currentProcess.kill();
    //  currentProcess = null;
    //  wss?.clients.forEach((client) => {
    //    if (client.readyState === WebSocket.OPEN) {
    //      client.send(JSON.stringify({ type: 'processEnded' }));
    //    }
    //  });
    //  return { success: true };
    //}
    //return { success: false, error: 'Process not found' };
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
            client.send(JSON.stringify({ ouptput: data.toString() }));
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
    });

    return { success: true, processId: currentProcess.pid };
    //const process = exec(run, (error, stdout, stderr) => {
    //  if (error) {
    //    wss?.clients.forEach((client) => {
    //      if (client.readyState === WebSocket.OPEN) {
    //        client.send(JSON.stringify({ error: error.message }));
    //      }
    //    })
    //    console.log(`error: ${error.message}`);
    //    return;
    //  }
    //  if (stderr) {
    //    wss?.clients.forEach((client) => {
    //      if (client.readyState === WebSocket.OPEN) {
    //        client.send(JSON.stringify({ error: stderr }));
    //      }
    //    })
    //    console.log(`stderr: ${stderr}`);
    //    return;
    //  }
    //  wss?.clients.forEach((client) => {
    //    if (client.readyState === WebSocket.OPEN) {
    //      client.send(JSON.stringify({ output: data.tostring()stdout }));
    //    }
    //  })
    //  console.log(`stdout: ${stdout}`);
    //})
    //return wss.close()
  }
};

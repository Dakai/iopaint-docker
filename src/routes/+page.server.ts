import type { RequestEvent } from "@sveltejs/kit";
import { exec } from 'child_process'
import { WebSocket, WebSocketServer } from "ws";

let cmd = "iopaint start --model "
let args = " --device=cpu --host=0.0.0.0 --enable-realesrgan \
--realesrgan-model RealESRGAN_x4plus --realesrgan-device cpu \
--enable-gfpgan --gfpgan-device cpu \
--enable-remove-bg --enable-interactive-seg --interactive-seg-model=vit_l --interactive-seg-device=cpu"

let wss: WebSocketServer | undefined;

const initWebSocketServer = () => {
  if (!wss) {
    wss = new WebSocketServer({ port: 9880 });
    console.log("WebSocketServer started on port 9880");
    wss.on("connection", (ws) => {

      ws.on("message", (message) => {
        console.log("received: %s", message);
      });
    })
    wss.on('error', (error) => {
      console.log('error', error)
    })
    wss.on("close", () => {
      console.log("WebSocketServer closed");
      wss = undefined
    })
  }
}

initWebSocketServer();

export const actions = {
  run: async (req: RequestEvent) => {
    const data = await req.request.formData();
    const model = data.get('model')
    console.log(data)
    let run = ''
    if (model) {
      run = cmd + model + args;
    }
    else
      return { error: 'No model selected' }

    return new Promise((resolve, reject) => {
      const process = exec(run, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          reject({ error: error.message })
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);

          reject({ error: stderr })
          return;
        }
        console.log(`stdout: ${stdout}`);
      })
      console.log('process', process.pid)
    })

  },
  stop: async () => {
    let pid = 0;
    exec('kill ' + pid, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    })
  },
  test: async (req: RequestEvent) => {
    const data = await req.request.formData();
    const model = data.get('model')
    //console.log(data)
    let run = 'ls'
    //if (model) {
    //  run = cmd + model + args;
    //}
    //console.log(run)
    const process = exec(run, (error, stdout, stderr) => {
      if (error) {
        wss?.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ error: error.message }));
          }
        })
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        wss?.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ error: stderr }));
          }
        })
        //console.log(`stderr: ${stderr}`);
        return;
      }
      wss?.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ output: stdout }));
        }
      })
      console.log(`stdout: ${stdout}`);
    })
    console.log('process', process.pid)
    //return wss.close()
  }
}

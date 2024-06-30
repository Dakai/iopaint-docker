import type { RequestEvent } from "@sveltejs/kit";
import { exec } from 'child_process'
import { WebSocket, WebSocketServer } from "ws";
//import Docker from 'dockerode'

//let cmd = "iopaint start --model "
let cmd = "python test.py start --model "
let args = " --device=cpu --host=0.0.0.0 --enable-realesrgan \
--realesrgan-model RealESRGAN_x4plus --realesrgan-device cpu \
--enable-gfpgan --gfpgan-device cpu \
--enable-remove-bg --enable-interactive-seg --interactive-seg-model=vit_l --interactive-seg-device=cpu"

let wss: WebSocketServer | undefined;

//const docker = new Docker();

const initWebSocketServer = () => {
  if (!wss) {
    wss = new WebSocketServer({ host: '0.0.0.0', port: 9880 });
    console.log("WebSocketServer started on port 9880");
    wss.on("connection", (ws) => {
      console.log('New WebSocket Connection')
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
  run: async (req: RequestEvent) => {
    const data = await req.request.formData();
    const model = data.get('model')
    console.log(model)
    let run = ''
    if (model) {
      run = cmd + model + args;
    }
    else {
      console.log('No model selected')
      wss?.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ error: 'No model selected' }));
        }
      })
      return
    }
    //console.log(run)
    const process = exec(run)
    if (process.stdout != null) {
      process.stdout.on('data', (data: any) => {
        wss?.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ ouptput: data.toString() }));
          }
        });
      });
    } else if (process.stderr != null) {
      process.stderr.on('data', (data: any) => {
        wss?.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ error: data.toString() }));
          }
        });
      });

    }
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
    console.log('process', process.pid)
    //return wss.close()
  }
}

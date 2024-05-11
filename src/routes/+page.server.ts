import type { RequestEvent } from "@sveltejs/kit";
import { output, process_id } from '$lib/stores';
import { exec } from 'child_process'
import { get } from 'svelte/store'

let cmd = "iopaint start --model "
let args = " --device=cpu --host=0.0.0.0 --enable-realesrgan \
--realesrgan-model RealESRGAN_x4plus --realesrgan-device cpu \
--enable-gfpgan --gfpgan-device cpu \
--enable-remove-bg --enable-interactive-seg --interactive-seg-model=vit_l --interactive-seg-device=cpu"

export const actions = {
  run: async (req: RequestEvent) => {
    const data = await req.request.formData();
    const model = data.get('model')
    const run = cmd + model + args;
    let child = exec(run, (error, stdout, stderr) => {
      if (error) {
        output.set(error.message)
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        output.set(stderr)
        console.log(`stderr: ${stderr}`);
        return;
      }
      output.set(stdout)
      console.log(`stdout: ${stdout}`);
    })
    child.pid ? process_id.set(child.pid) : null;
  },
  stop: async () => {
    let pid = get(process_id);
    exec('kill ' + pid, (error, stdout, stderr) => {
      if (error) {
        output.set(error.message)
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        output.set(stderr)
        console.log(`stderr: ${stderr}`);
        return;
      }
      output.set(stdout)
      console.log(`stdout: ${stdout}`);
    })
  }
}

import type { RequestEvent } from "@sveltejs/kit";
import { exec } from 'child_process'

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
    console.log(run)
    exec(run, (error, stdout, stderr) => {
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

  }
}
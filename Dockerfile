# Use the official Python image, which always includes the latest Python version
#FROM python:alpine
FROM python:3.10.11
#FROM oven/bun:debian
# Set the working directory inside the container
WORKDIR /app

# Set an environment variable to store where the virtual environment will be created
#ENV VIRTUAL_ENV=/app/venv

#RUN apt-get update && apt-get install python3 ffmpeg libsm6 libxext6 curl git unzip python3-venv -y
#RUN apt-get update && apt-get install python3 python3-venv pip -y libgl1

# Create the virtual environment
#RUN python3 -m venv $VIRTUAL_ENV
#RUN . $VIRTUAL_ENV/bin/activate
# Ensure that the virtual environment is activated:
# This makes the virtual environment the default Python,
# so we do not need to specify the path to it
#ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Copy the requirements file into the container at /app
# This assumes you have a requirements.txt file in your project
# for managing dependencies. If you don't, you'll need to adjust
# accordingly and possibly use `pip install` commands directly.

#COPY requirements.txt .
#
## Install dependencies in the virtual environment
#RUN pip3 install --upgrade pip && \
#    pip3 install torch==2.1.0 torchvision==0.16.0 --extra-index-url https://download.pytorch.org/whl/cpu && \ 
#    pip3 install -r requirements.txt
#

#RUN pip3 install --upgrade pip && \
#    apt-get update && apt-get install ffmpeg libsm6 libxext6 curl git unzip -y && \
#    pip3 install torch==2.1.0 torchvision==0.16.0 --extra-index-url https://download.pytorch.org/whl/cpu && \ 
#    pip3 install -r requirements.txt

COPY . .

RUN apt-get update && \
    apt-get install ffmpeg libsm6 libxext6 curl git curl unzip htop psmisc procps-ng -y && \
    curl -fsSL https://bun.sh/install | bash && \
    . /root/.bashrc && \
    /root/.bun/bin/bun install && /root/.bun/bin/bun run build && chmod +x run.sh

EXPOSE 3000
# WebSocket Port
EXPOSE 9880
#CMD ["bun", "./build/index.js"]
CMD ["./run.sh"]
#CMD ["iopaint", "start","--model=lama", "--device=cpu", "--host=0.0.0.0", "--enable-realesrgan", "--realesrgan-model", "RealESRGAN_x4plus", "--realesrgan-device", "cpu", "--enable-gfpgan", "--gfpgan-device", "cpu","--enable-remove-bg", "--enable-interactive-seg", "--interactive-seg-model=vit_l", "--interactive-seg-device=cpu"]

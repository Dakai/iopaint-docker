# Use the official Python image, which always includes the latest Python version
#FROM python:alpine
FROM python:3.10.11-slim-buster
# Set the working directory inside the container
WORKDIR /app

# Set an environment variable to store where the virtual environment will be created
ENV VIRTUAL_ENV=/opt/venv

# Create the virtual environment
RUN python -m venv $VIRTUAL_ENV

# Ensure that the virtual environment is activated:
# This makes the virtual environment the default Python,
# so we do not need to specify the path to it
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Copy the requirements file into the container at /app
# This assumes you have a requirements.txt file in your project
# for managing dependencies. If you don't, you'll need to adjust
# accordingly and possibly use `pip install` commands directly.
COPY requirements.txt .

# Install dependencies in the virtual environment
RUN pip3 install --upgrade pip && \
    apt-get update && apt-get install ffmpeg libsm6 libxext6  -y && \
    pip3 install torch==2.1.0 torchvision==0.16.0 --extra-index-url https://download.pytorch.org/whl/cpu && \ 
    pip3 install -r requirements.txt

COPY . .

RUN apt-get install -y bun git && \
    bun run build

# Copy the rest of your application's code into the container at /app
#COPY . .

EXPOSE 3000

ENTRYPOINT ["bun", "./build/index.js"]

#CMD ["iopaint", "start","--model=lama", "--device=cpu", "--host=0.0.0.0", "--enable-realesrgan", "--realesrgan-model", "RealESRGAN_x4plus", "--realesrgan-device", "cpu", "--enable-gfpgan", "--gfpgan-device", "cpu","--enable-remove-bg", "--enable-interactive-seg", "--interactive-seg-model=vit_l", "--interactive-seg-device=cpu"]

#!/bin/bash

python3 -m venv "$VIRTUAL_ENV"
. "$VIRTUAL_ENV"/bin/activate
pip3 install --upgrade pip
# temp disable
#pip3 install torch==2.1.0 torchvision==0.16.0 --extra-index-url https://download.pytorch.org/whl/cpu
#pip3 install -r requirements.txt
# temp disable

bun ./build/index.js

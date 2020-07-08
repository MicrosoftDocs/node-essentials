#!/usr/bin/env bash

nvm_install_script=https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh
NVM_DIR="$HOME/.nvm"
NVM_NODE_VERSION=14

if [ ! -d "$HOME/.nvm" ]; then
    echo "> Downloading NVM..."
    curl -s -o- $nvm_install_script | bash >/dev/null 2>&1
    export NVM_DIR=$NVM_DIR

    # loads nvm
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  

    # loads nvm bash_completion
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" 

    echo "> Installing Node.js v$NVM_NODE_VERSION+..."
    nvm install $NVM_NODE_VERSION >/dev/null 2>&1
fi

echo >&2 "> Node.js $(node --version) is ready to use."

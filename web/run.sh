#! /bin/bash

DIR=$(pwd | grep -o '[^/]*$')

if [ $DIR != "Pixel-Puzzle" ]; then
    echo "Please run the script from the Pixel-Puzzle directory"
    exit 1
fi


# CHECK FOR PYTHON

HAS_PYTHON=false
PYTHON3=false

if [ -x "$(command -v python3)" ]; then
    HAS_PYTHON=true
    PYTHON3=true
elif [ -x "$(command -v python)" ]; then
    HAS_PYTHON=true
fi

if [ $HAS_PYTHON == false ]; then
    echo "Python is not installed"
    exit 1
fi



# CREATE VENV

if [ -d "venv" ]; then
    echo "Virtual environment already exists"
    echo "Clearing previous environment"
    rm -rf venv # Remove the virtual environment
fi

echo "Creating virtual environment"
if [ $PYTHON3 == true ]; then
    python3 -m venv venv
else
    python -m venv venv
fi


# ACTIVATE VENV

echo "Activating virtual environment"
source venv/bin/activate


# INSTALL REQUIREMENTS

PIP3=false
if [ -x "$(command -v pip3)" ]; then
    PIP3=true
fi

echo "Installing requirements"
if [ $PIP3 == true ]; then
    pip3 install -q -r requirements.txt
else
    pip install -q -r requirements.txt
fi


# RUN THE GAME

echo "Running the game"
if [ $PYTHON3 == true ]; then
    python3 web/server.py
else
    python web/server.py
fi
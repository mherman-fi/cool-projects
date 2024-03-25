#!/bin/bash

git status
git add .
read -rp "Enter commit message: " message
git commit -m "$message"
git push

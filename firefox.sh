#!/usr/bin/env bash
mkdir ./temp
cp -r ./data ./images ./lib ./src ./README.md ./temp
jq -s add ./manifest.json ./firefox-extras.json | jq 'del(.key, .update_url, .options_page)'> ./temp/manifest.json
cd ./temp
zip -r firefox.zip ./data ./images ./lib ./src README.md ./manifest.json
cd ..
cp ./temp/firefox.zip .
rm -rf ./temp
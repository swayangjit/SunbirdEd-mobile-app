#!/bin/bash
file="configurations/configuration.prod.ts"
# config properties exist or not
if [[ -f $file ]]; then 
    echo "File exists"
    # Simple script to clean install
    rm -rf node_modules
    rm -rf www
    rm package-lock.json

    npm i --python=/usr/bin/python3.6

    # Read properties from config.properties
    while read -r line; do
        if [[ "$line" == *"APP_NAME"* ]]; then
        APP_NAME=$(echo "$line" | sed 's/APP_NAME//g' | sed 's/[^a-zA-Z0-9]//g')
        elif [[ "$line" == *"APPLICATION_ID"* ]]; then
        APP_ID=$(echo "$line" | sed 's/APPLICATION_ID//g' | sed 's/[^a-zA-Z0-9._]//g')
        fi
    done <$file

    # Update capacitor.config.ts
    sed -i'' -e "s/'app.name'/'$APP_NAME'/" capacitor.config.ts
    sed -i'' -e "s/'app.id'/'$APP_ID'/" capacitor.config.ts

    echo "updated appname and appid"

    # Build your Ionic app, add android, generate icons and build
    # npx cap add android
    # appIcon
    node scripts/uploadAppIcon.js
    npx @capacitor/assets generate --iconBackgroundColor '#ffffff' --iconBackgroundColorDark '#222222' --splashBackgroundColor '#ffffff' --splashBackgroundColorDark '#111111'
    
    # Build your Ionic app
    ionic build --prod && npx cap sync
    npx cap copy android && npx cap update android
    cd android && ./gradlew app:bundleRelease && ./gradlew assembleDebug && cd ..

else
    echo "File does not exists"
fi
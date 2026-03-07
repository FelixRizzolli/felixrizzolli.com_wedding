#!/bin/bash

## SSH setup

chmod 700 /root/.ssh
chmod 600 /root/.ssh/*
chmod 644 /root/.ssh/*.pub
chown -R root:root /root/.ssh

## VSCode settings setup

# -> copy settings.template.json to settings.json
settingsPath='/workspace/.vscode/settings.json'
templatePath='/workspace/.vscode/settings.template.json'
cp "$templatePath" "$settingsPath"
chmod 600 "$settingsPath" || true
echo "[setup.sh] Copied $templatePath -> $settingsPath"

# -> mongodb vscode extension configuration
export MONGODB_CONNECTION_STRING="mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?authSource=admin&authMechanism=SCRAM-SHA-256"

node <<'NODE'
    const fs = require('fs');
    const settingsPath = '/workspace/.vscode/settings.json';
    const tmpPath = settingsPath + '.tmp';
    const conn = process.env.MONGODB_CONNECTION_STRING;
    if (!conn) {
        console.error('[setup.sh] MONGODB_CONNECTION_STRING not set');
        process.exit(1);
    }
    if (!fs.existsSync(settingsPath)) {
        console.error('[setup.sh] settings.json not found at', settingsPath);
        process.exit(0);
    }
    let content = fs.readFileSync(settingsPath, 'utf8');
    content = content.replace(/\$MONGODB_CONNECTION_STRING/g, conn);
    fs.writeFileSync(tmpPath, content, { mode: 0o600 });
    fs.renameSync(tmpPath, settingsPath);
    console.log('[setup.sh] Injected MONGODB_CONNECTION_STRING into', settingsPath);
NODE
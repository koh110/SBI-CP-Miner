# SBI-CP-Miner

SBI-CP-Miner is a mining tool of the SBI IPO challenge point.

## Getting Started Guide

```bash
$ git clone https://github.com/Ajido/SBI-CP-Miner
$ cd SBI-CP-Miner
$ npm install

$ SBI_ID='xxx' SBI_PASS='xxx' SBI_ORDER_PASS='xxx' node main.js
```

## For Jenkins

https://github.com/GoogleChrome/puppeteer/issues/2519

```bash
cd node_modules/puppeteer/.local-chromium

find . -type d | xargs -L1 -Ixx sudo chmod 755 xx
find . -type f -perm /u+x | xargs -L1 -Ixx sudo chmod 755 xx
find . -type f -not -perm /u+x | xargs -L1 -Ixx sudo chmod 644 xx
```

## Ubuntu Dependencies

https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md

```
gconf-service
libasound2
libatk1.0-0
libc6
libcairo2
libcups2
libdbus-1-3
libexpat1
libfontconfig1
libgcc1
libgconf-2-4
libgdk-pixbuf2.0-0
libglib2.0-0
libgtk-3-0
libnspr4
libpango-1.0-0
libpangocairo-1.0-0
libstdc++6
libx11-6
libx11-xcb1
libxcb1
libxcomposite1
libxcursor1
libxdamage1
libxext6
libxfixes3
libxi6
libxrandr2
libxrender1
libxss1
libxtst6
ca-certificates
fonts-liberation
libappindicator1
libnss3
lsb-release
xdg-utils
wget
```


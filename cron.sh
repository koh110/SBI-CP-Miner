#!/bin/bash

set -euo pipefail

cd $(dirname $0) && export $(cat .env | xargs) && node main.js

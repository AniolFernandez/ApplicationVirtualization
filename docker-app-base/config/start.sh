#!/bin/bash
/usr/bin/Xvfb $DISPLAY -screen 0 1920x1080x24+32 -nolisten tcp -nolisten unix &
sleep 3
i3 &
sleep 1
/gateway/main > /gateway/log 2>&1 &
/run.sh

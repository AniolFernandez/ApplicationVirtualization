#!/bin/bash
/usr/bin/Xvfb $DISPLAY -screen 0 1920x1080x24+32 -nolisten tcp -nolisten unix &
sleep 3
#x11vnc -display $DISPLAY -listen localhost -forever &
#/usr/share/novnc/utils/launch.sh --vnc localhost:5900 &
i3 &
sleep 1
/gateway/main > /gateway/log 2>&1 &
/run.sh
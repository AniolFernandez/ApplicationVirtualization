#!/bin/bash
export DISPLAY=:99
/usr/bin/Xvfb $DISPLAY -screen 0 1920x1080x24+32 -ac -nolisten tcp -nolisten unix &
#x11vnc -display $DISPLAY -listen localhost -forever &
#/usr/share/novnc/utils/launch.sh --vnc localhost:5900 &
i3 &
/gateway/main > /gateway/log 2>&1 &
/run.sh

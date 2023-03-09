FROM ubuntu

ENV DEBIAN_FRONTEND=noninteractive

COPY config/start.sh /
COPY config/run.sh /
COPY config/i3-config /home/USER/.config/i3/config
COPY config/gateway /gateway
WORKDIR /gateway
RUN apt-get update \
    && apt-get install xvfb x11vnc novnc i3 golang-go ffmpeg gimp -y \
    && go build rtp-to-webrtc.go \
    && rm -r *.* \
    && apt-get purge -y --auto-remove golang-go \
    && useradd -m USER \
    && chmod +x /start.sh \
    && chown USER:USER /start.sh \
    && chmod +x /run.sh \
    && chown USER:USER /run.sh \
    && chown -R USER:USER /home/USER/ \
    && chown -R USER:USER /gateway



USER USER
CMD ["/start.sh"]


#UTILITZAR AQUESTA!!!
#ffmpeg -r 30 -f x11grab -draw_mouse 0 -s 1920:1080 -i :99 -pix_fmt yuv420p -tune zerolatency -filter:v "crop=1920:1080:0:0" -c:v libx264 -quality realtime -f rtp rtp://127.0.0.1:5004
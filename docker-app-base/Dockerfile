FROM ubuntu
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install gimp xvfb x11vnc novnc i3 -y
RUN useradd -m USER
ADD config/start.sh /
ADD config/run.sh /
RUN chmod +x /start.sh
RUN chown USER:USER /start.sh
RUN chmod +x /run.sh
RUN chown USER:USER /run.sh
ADD config/i3-config /home/USER/.config/i3/config
RUN chown -R USER:USER /home/USER/
USER USER
CMD ["/start.sh"]

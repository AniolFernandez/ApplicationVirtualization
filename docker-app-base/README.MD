# Build image
`docker build . -t appvirt-base`

# Run image
`docker run --rm -it --name [container-name] --network host appvirt-base`

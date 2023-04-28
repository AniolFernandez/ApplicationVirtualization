#!/bin/bash

image="$(basename "$PWD")"
docker build . -t $image
docker tag $image $1/$image
docker push $1/$image
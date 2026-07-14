#!/bin/bash
IMAGE=used-car-marketplace

docker build -t $IMAGE .

docker tag $IMAGE:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/$IMAGE:latest

docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/$IMAGE:latest

kubectl apply -f k8s/

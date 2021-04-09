#!/bin/bash

echo What should the version be?
read VERSION

docker build -t darrenkeenfanduel/gbnfl-api:$VERSION .
docker push darrenkeenfanduel/gbnfl-api:$VERSION

ssh root@46.101.34.153 "docker pull darrenkeenfanduel/gbnfl-api:$VERSION && docker tag darrenkeenfanduel/gbnfl-api:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"
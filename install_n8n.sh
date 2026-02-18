#!/bin/bash
set -e

echo "=== 1/4 Actualizando sistema ==="
apt-get update -y
apt-get install -y ca-certificates curl

echo "=== 2/4 Instalando Docker ==="
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
ARCH=$(dpkg --print-architecture)
CODENAME=$(. /etc/os-release && echo "$VERSION_CODENAME")
echo "deb [arch=${ARCH} signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${CODENAME} stable" > /etc/apt/sources.list.d/docker.list
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "=== 3/4 Lanzando contenedor n8n ==="
mkdir -p /root/.n8n
docker rm -f n8n 2>/dev/null || true
docker run -d \
  --restart unless-stopped \
  --name n8n \
  -p 5678:5678 \
  -v /root/.n8n:/home/node/.n8n \
  n8nio/n8n

echo "=== 4/4 Configurando firewall ==="
apt-get install -y ufw
ufw allow 22
ufw allow 5678
ufw --force enable

echo ""
echo "========================================="
echo "  INSTALACION COMPLETADA CON EXITO"
echo "  Accede a n8n en: http://46.62.201.206:5678"
echo "========================================="
docker ps --filter name=n8n

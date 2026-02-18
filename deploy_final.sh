#!/bin/bash
set -e

echo "=== 1/4 Configurando actualización automática de DuckDNS ==="
mkdir -p /root/duckdns
cat <<EOF > /root/duckdns/duck.sh
echo url="https://www.duckdns.org/update?domains=ssecija&token=b21a060c-c389-458d-bb14-995110b16a74&ip=" | curl -k -o /root/duckdns/duck.log -K -
EOF
chmod +x /root/duckdns/duck.sh
# Añadir a crontab si no existe
(crontab -l 2>/dev/null | grep -v "duck.sh"; echo "*/5 * * * * /root/duckdns/duck.sh >/dev/null 2>&1") | crontab -
/root/duckdns/duck.sh
echo "DOCKER_UPDATE_OK"

echo "=== 2/4 Preparando Docker Compose (Proxy + n8n) ==="
mkdir -p /root/semanasanta
cd /root/semanasanta

# Paramos el n8n anterior para evitar conflictos de puertos
docker rm -f n8n 2>/dev/null || true

cat <<EOF > docker-compose.yml
version: '3.8'
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    environment:
      - N8N_SECURE_COOKIE=false
      - WEBHOOK_URL=https://ssecija.duckdns.org
    volumes:
      - /root/.n8n:/home/node/.n8n
EOF

echo "=== 3/4 Levantando servicios ==="
docker compose up -d

echo "=== 4/4 Abriendo puertos en el firewall ==="
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 81/tcp
ufw --force enable

echo "========================================================="
echo "  DESPLIEGUE INICIAL COMPLETADO"
echo "  1. Entra en http://46.62.201.206:81"
echo "  2. Email: admin@example.com | Pass: changeme"
echo "  3. Configura el Proxy Host para ssecija.duckdns.org"
echo "========================================================="

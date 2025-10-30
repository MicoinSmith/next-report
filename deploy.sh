#!/bin/bash

set -e

APP_NAME="next-report"
REMOTE_HOST="root@NextReport"
DEPLOY_DIR="/home/NextReport"
TEMP_DIR="./_deploy_tmp"
PKG_NAME="next-report-$(date +%Y%m%d_%H%M%S).tar.gz"

echo "[1/6] 本地构建"
corepack enable || true
yarn install --immutable || yarn install
yarn build

echo "[2/6] 打包文件"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"
# 仅打包运行所需文件
cp -r .next "$TEMP_DIR/.next"
cp -r public "$TEMP_DIR/public" 2>/dev/null || true
cp package.json "$TEMP_DIR/"
cp yarn.lock "$TEMP_DIR/" 2>/dev/null || true
cp next.config.mjs "$TEMP_DIR/" 2>/dev/null || true
if [ -f .env.production ]; then cp .env.production "$TEMP_DIR/.env"; fi
tar --no-xattrs -czf "$PKG_NAME" -C "$TEMP_DIR" .

echo "[3/6] 上传压缩包 -> $REMOTE_HOST:$DEPLOY_DIR"
scp "$PKG_NAME" "$REMOTE_HOST:$DEPLOY_DIR/"

echo "[4/6] 远端清理并解压"
ssh "$REMOTE_HOST" "\
  set -e; \
  cd $DEPLOY_DIR; \
  PKG=\$(ls -t $PKG_NAME 2>/dev/null || echo '') ; \
  if [ -z \"$PKG_NAME\" ]; then PKG=$PKG_NAME; fi; \
  rm -rf .next node_modules public || true; \
  tar -xzf $PKG; \
  rm -f $PKG || true; \
  corepack enable || true; \
  yarn install --production --frozen-lockfile || yarn install --production; \
  if pm2 describe $APP_NAME >/dev/null 2>&1; then \
    pm2 restart $APP_NAME; \
  else \
    pm2 start 'yarn start' --name $APP_NAME --time; \
  fi; \
  pm2 save || true; \
"

echo "[5/6] 清理本地临时文件"
rm -rf "$TEMP_DIR" "$PKG_NAME"

echo "[6/6] 部署完成"
#!/usr/bin/env bash
#
# Publish the site to S3 and invalidate CloudFront.
# The site is served from CloudFront (S3 origin, private via OAC), not GitHub Pages.

set -euo pipefail

BUCKET="spcmky-net-site"
DISTRIBUTION="EPZXE1UBMC7YZ"
REGION="us-east-2"

cd "$(dirname "$0")"

echo "==> syncing to s3://${BUCKET}"

# Assets carry a modest TTL; HTML stays short so content changes surface quickly.
aws s3 cp assets/css/main.css "s3://${BUCKET}/assets/css/main.css" \
  --region "$REGION" --content-type "text/css; charset=utf-8" \
  --cache-control "public, max-age=3600"

aws s3 cp assets/js/main.js "s3://${BUCKET}/assets/js/main.js" \
  --region "$REGION" --content-type "application/javascript; charset=utf-8" \
  --cache-control "public, max-age=3600"

for f in index.html 404.html; do
  aws s3 cp "$f" "s3://${BUCKET}/${f}" \
    --region "$REGION" --content-type "text/html; charset=utf-8" \
    --cache-control "public, max-age=300"
done

aws s3 cp robots.txt "s3://${BUCKET}/robots.txt" \
  --region "$REGION" --content-type "text/plain; charset=utf-8" \
  --cache-control "public, max-age=3600"

aws s3 cp sitemap.xml "s3://${BUCKET}/sitemap.xml" \
  --region "$REGION" --content-type "application/xml; charset=utf-8" \
  --cache-control "public, max-age=3600"

echo "==> invalidating CloudFront"
ID=$(aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION" \
  --paths '/*' --query 'Invalidation.Id' --output text)

echo "==> invalidation ${ID} created"
echo "==> https://www.spcmky.net"

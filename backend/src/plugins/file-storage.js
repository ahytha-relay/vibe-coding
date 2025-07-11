const fp = require('fastify-plugin');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

async function fileStoragePlugin(fastify, opts) {
  const s3 = new S3Client({
    region: opts.s3Region || process.env.AWS_REGION,
    credentials: {
      accessKeyId: opts.s3AccessKeyId || process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: opts.s3SecretAccessKey || process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const bucket = opts.s3Bucket || process.env.S3_BUCKET;

  fastify.decorate('fileStorage', {
    upload: async ({ Key, Body, ContentType }) => {
      const command = new PutObjectCommand({ Bucket: bucket, Key, Body, ContentType });
      return s3.send(command);
    },
    download: async ({ Key }) => {
      const command = new GetObjectCommand({ Bucket: bucket, Key });
      return s3.send(command);
    },
    delete: async ({ Key }) => {
      const command = new DeleteObjectCommand({ Bucket: bucket, Key });
      return s3.send(command);
    },
    bucket,
  });
}

module.exports = fp(fileStoragePlugin);

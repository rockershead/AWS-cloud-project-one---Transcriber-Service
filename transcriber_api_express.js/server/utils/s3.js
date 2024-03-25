const {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const _ = require("lodash");
const stream = require("stream");

function getClient() {
  /*const client = new S3Client({
    credentials: {
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });*/
  const client = new S3Client({
    credentials: {
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS,
      secretAccessKey: process.env.AWS_SECRET,
    },
  });
  return client;
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const _buf = [];

    stream.on("data", (chunk) => _buf.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(err));
  });
}

async function getSigneds3Url(path, bucket) {
  const client = getClient();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: path,
  });
  const url = await getSignedUrl(client, command, {
    expiresIn: 3600,
  });

  return url;
}

async function getFiles3Url(path, bucket) {
  const url = await getSigneds3Url(path, bucket);

  return url;
}

async function listFiles(path, bucket) {
  try {
    const client = getClient();

    const command = new ListObjectsV2Command({
      Bucket: bucket, // required
      Delimiter: "/",
      Prefix: path,
    });

    const { Contents } = await client.send(command);

    //console.log(Contents);

    return Contents;
  } catch (err) {
    console.log(err);
  }
}

async function uploadFile(path, bucket, body) {
  let _body = body;
  if (_body instanceof stream) {
    //convert into buffer
    _body = await streamToBuffer(body);
  }
  console.log(_body);
  const client = getClient();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: path,
    Body: _body,
  });
  await client.send(command);

  //const url = await getSigneds3Url(path, bucket);

  //return url;
}

module.exports = { uploadFile, getFiles3Url, listFiles };

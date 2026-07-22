const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

function uploadFile(file) {
  return new Promise((resolve, reject) => {
    if (!file?.buffer) {
      reject(new Error("Invalid audio file"));
      return;
    }

    const extension =
      file.originalname?.split(".").pop() || "mp3";

    imagekit.upload(
      {
        file: file.buffer,
        fileName: `song-${Date.now()}.${extension}`,
        folder: "/moody-player/songs",
        useUniqueFileName: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );
  });
}

module.exports = uploadFile;
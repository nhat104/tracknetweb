const fs = require("fs");
const ffmpeg = require("ffmpeg");
const { VideoLabel } = require("@mui/icons-material");

const videoPath = "./tenni1.mp4";
const outputPath = "E:/tracknet_web/output";

const process = new ffmpeg(videoPath, (err, video) => {
  if (!err) {
    console.log("The video is ready to be processed");
    console.log(video.metadata.filename);
  } else {
    console.log(err);
  }
});
// process.then((video) => {
//   console.log(video.metadata);
//   video.fnExtractFrameToJPG(outputPath, {
//     frame_rate: 1,
//     number: 5,
//   });
// });

// fs.writeFileSync(outputPath, frame);

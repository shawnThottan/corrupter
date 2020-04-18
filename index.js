var l_ffmpeg = require('ffmpeg');
var ffmpeg = require('fluent-ffmpeg');
var Jimp = require('jimp');

var fs = require('fs');

const filename = 'city';
let frameCount = 2400;
const tbMixedFrames = 50;
let width, height;
const images = [];

zeroPad = (n,length) => {
    var s=n+"",needed=length-s.length;
    if (needed>0) s=(Math.pow(10,needed)+"").slice(1)+s;
    return s;
}

loadImages = async () => {
    for (let i = 1; ; i++) {
        const file = `${__dirname}/frames/${filename}/_${i}.jpg`;
        if (!fs.existsSync(file)) break;
        const image = await Jimp.read(file);
        images.push(image);
    }
    frameCount = images.length;
    width = images[0].bitmap.width;
    height = images[0].bitmap.height;
    console.log({width, height})
}

editImages = async () => {
    for (let k = 0; k < frameCount; k++) {
        for (let i = 0; i < width; i++) {
            xi = i * Math.PI / width;
            sinXi = Math.sin(xi);
            frame = Math.round(sinXi * tbMixedFrames) + k;
            if (frame < 0) frame *= -1;
            if (frame > frameCount - 1) frame %= frameCount - 1;
            for (let j = 0; j < height; j++) {
                images[k].bitmap.data[4 * (j * width + i)] = images[frame].bitmap.data[4 * (j * width + i)];
                images[k].bitmap.data[4 * (j * width + i) + 1] = images[frame].bitmap.data[4 * (j * width + i) + 1];
                images[k].bitmap.data[4 * (j * width + i) + 2] = images[frame].bitmap.data[4 * (j * width + i) + 2];
                images[k].bitmap.data[4 * (j * width + i) + 3] = images[frame].bitmap.data[4 * (j * width + i) + 3];
            }
        }
        console.log(k + 1, frameCount);
        images[k].writeAsync(`frames/${filename}_corrupted/${zeroPad(k + 1, 4)}.png`);
    }
}

const corrupt = async (req,res) => {
    let video = await new l_ffmpeg(`./videos/${filename}.mp4`);

    await video.fnExtractFrameToJPG(`./frames/${filename}`, {
        number: frameCount,
        file_name: '',
    })

    let sound = false;
    try {
        await video.fnExtractSoundToMP3(`./sounds/${filename}.mp3`);
        sound = true;
    } catch(e) {}

    await loadImages();
    await editImages();

    const input = ffmpeg(`./frames/${filename}_corrupted/%04d.png`);

    if (sound) input.addInput(`./sounds/${filename}.mp3`)

    input.outputOption('-shortest')
        .save(`./public/${filename}.avi`);
};

corrupt();

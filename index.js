const fs = require('fs')
  , gm = require('gm').subClass({imageMagick: true});

const buildDir = './build';

if (!fs.existsSync(buildDir)){
    fs.mkdirSync(buildDir);
}

const extensions = [
   'jpg',
   'webp',
   'png',
]

const inputImage = './office.jpg';

function generateWithExtensions(name, transformFunc) {
  const label = name.split('-').join(' ');
  extensions.forEach((extension) => {
    const path = `${buildDir}/${name}.${extension}`;
    transformFunc(gm(inputImage))
      .write(path, function (err) {
        if (!err) console.log(`${extension} ${label}: done`);
      });
  });
}

// output original file on all format and all available image properties
generateWithExtensions('original', (stream) => {
  return stream
  .identify(function (err, data) {
      if (err){
        return console.log('Error on identify', err);
      }
      fs.writeFile(`${buildDir}/original-file-info.json`, JSON.stringify(data, null, 4), function(err) {
        if(err) {
          return console.log('Error saving original file info on identify', err);
        }

        console.log('original file info: done');
      });
  })
  .strip();
});

// resize, remove quality and remove EXIF profile data
generateWithExtensions('office-less-quality', (stream) => {
  return stream
    .strip()
    .quality(60);
});

// resize, remove quality and remove EXIF profile data
generateWithExtensions('office-small', (stream) => {
  return stream
    .strip()
    .resize(1250, 513)
    .quality(60);
});

// resize, remove a lot of quality, blur and remove EXIF profile data
generateWithExtensions('office-blur', (stream) => {
  return stream
    .strip()
    .resize(1250, 513)
    .quality(40)
    .blur(3, 3);
});


console.log('PROCESSING...');

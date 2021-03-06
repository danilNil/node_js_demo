var photos = [];
photos.push({
  name: 'Node.js Logo',
  path: 'http://nodejs.org/images/logos/nodejs-green.png'
});
photos.push({
  name: 'Ryan Speaking',
  path: 'http://nodejs.org/images/ryan-speaker.jpg'
});

var Photo = require('../models/Photo');
var path = require('path');
var fs = require('fs');
var join = path.join;


exports.submit = function (dir) {
  console.log("dir: " + dir);
  return function(req, res, next){
    console.log("req.files: " + req.files);
    console.log("req.body: ");
    console.dir(req.body);
    //console.dir(req);
    var img = req.files.photo.image;
    var name = req.body.photo.name || img.name;
    var path = join(dir, img.name);
    fs.rename(img.path, path, function(err){
      if (err) return next(err);
      Photo.create({
        name: name,
        path: img.name
      }, function (err) {
        if (err) return next(err);
        res.redirect('/');
      });
    }); 
  };
};

exports.list = function(req, res){
  Photo.find({}, function(err, photos){
    if (err) return next(err);
      res.render('photos', {
        title: 'Photos',
        photos: photos
      }); 
  });
};

exports.form = function(req, res){
   res.render('photos/upload', {
     title: 'Photo upload'
   });
};

exports.download = function(dir){
  return function(req, res, next){
    var id = req.params.id;
    Photo.findById(id, function(err, photo){
      if (err) return next(err);
      var path = join(dir, photo.path);
      console.log("we start downloading");
      console.log(path);
      res.download(path, photo.name+'.jpeg', function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("done downloading");
        }
      });
    });
  }; 
};
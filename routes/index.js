
var moment = require('moment');

var Photo = require('../models/photo.js');

var fs = require('fs');
var AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});
var s3 = new AWS.S3();

// main page
exports.index =  function(req,res){

  // query for all images
  var photoQuery = Photo.find({});
  photoQuery.sort('-created');
  photoQuery.exec(function(err, photos){
    if (err) {
      console.error("uhoh something went wrong");
      console.error(err);
      res.send("error on querying images");

    } else {

      console.log(photos);
      templateData = {
        title : 'Image Upload to S3 Demo',
        photos : photos
      };

      res.render("index.html", templateData);

    }
  })

  
  
};

exports.display_photo = function(req, res){ 

  photo_id = req.params.photo_id;

  Photo.findById(photo_id, function(err, photo) {

    if (err) {
      console.error(err);
      res.send("Unable to find photo");
    } else {

      templateData = {
        photo : photo
      }

      // display photo
      res.render('photo_detail.html', templateData);
    }
  });

};

exports.delete_photo = function(req, res) {

  // get the photo
  // delete from S3
  // delete from Mongo
  var photo_id = req.params.photo_id;

  Photo.findById(photo_id, function(err, photo){

    if (err) {
      console.error(err);
      res.send("unable to find the photo");
    } else {

      // delete from S3
      s3.client.deleteObject({Bucket: 'dwd_uploads', Key: photo.image}, function(err, data) {
        console.log(err, data)

        // delete from MongoDB
        photo.remove(function(err){
          if (err) {
            console.error("error when trying to remove photo document from mongo")
            console.error(err);

            res.send("Unable to remove photo document from Mongo");
          }

          // else redirect to main page

          res.redirect('/')

        })
      });


    }

  })

};

exports.new_photo = function(req, res){

  // Get File upload information  
  var filename = req.files.image.filename; // actual filename of file
  var path = req.files.image.path; //will be put into a temp directory
  var mimeType = req.files.image.type; // image/jpeg or actual mime type


  // Create a new blog post
  var photoPost = new Photo(); // create Blog object
  photoPost.title = req.body.title;
  photoPost.urltitle = req.body.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_')
  photoPost.caption = req.body.caption;
  
  // any file upload?
  console.log("about to upload")

  // 2) create file name with logged in user id + cleaned up existing file name. function defined below.
  cleanedFileName = cleanFileName(filename);

  // 3a) We first need to open and read the image upload into a buffer
  fs.readFile(path, function(err, file_buffer){

    // pick the Amazon S3 Bucket
    var s3bucket = new AWS.S3({params: {Bucket: 'dwd_uploads'}});
    
    // Set the bucket object properties
    // Key == filename
    // Body == contents of file
    // ACL == Should it be public? Private?
    // ContentType == MimeType of file ie. image/jpeg.
    var params = {
      Key: cleanedFileName,
      Body: file_buffer,
      ACL: 'public-read',
      ContentType: mimeType
    };
    
    // Put the Object in the Bucket
    s3bucket.putObject(params, function(err, data) {
      if (err) {
        console.log(err)

      } else {
        console.log("Successfully uploaded data to s3 bucket");

        // add image to blog post
        photoPost.image = cleanedFileName;
      }

      photoPost.save();

      res.redirect('/');

    });

  });

};

var cleanFileName = function(filename) {
    
    // cleans and generates new filename for example userID=abc123 and filename="My Pet Dog.jpg"
    // will return "abc123_my_pet_dog.jpg"
    fileParts = filename.split(".");
    
    //get the file extension
    fileExtension = fileParts[fileParts.length-1]; //get last part of file
    
    //add time string to make filename a little more random
    d = new Date();
    timeStr = d.getTime();
    
    //name without extension "My Pet Dog"
    newFileName = fileParts[0];
    
    return newFilename = timeStr + "_" + fileParts[0].toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_') + "." + fileExtension;
    
}

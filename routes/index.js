
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

  templateData = {
    'title' : 'Image Upload to S3 Demo'
  };
  res.render("index.html", templateData);
  
};

exports.newimage = function(req, res){

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

    var s3bucket = new AWS.S3({params: {Bucket: 'dwd_uploads'}});
    var params = {
      Key: cleanedFileName,
      Body: file_buffer,
      ACL: 'public-read',
      ContentType: mimeType
    };
    
    s3bucket.putObject(params, function(err, data) {
      if (err) {
        console.log(err)

      } else {
        console.log("Successfully uploaded data to s3 bucket");

        // add image to blog post
        photoPost.images.push(cleanedFileName);
      }

      photoPost.save();

      res.redirect('/edit/'+photoPost.id);

    });

  });

};

exports.edit = function(req,res) {
    
    console.log(req.param('photo_id'));

    Blog.findById(req.param('photo_id'), function(err, blogpost){

      if (err) {
        
        res.send("Uhoh something went wrong");
        console.log(err);

      } else if (blogpost.user != req.user.id){

        res.send('You do not own this blog post.');
      
      } else {
        
        console.log(blogpost);
        
        var template_data = {
          title : 'Edit Blog Post',
          blogpost : blogpost,
          currentUser : req.user
        };

        res.render('blog_form.html', template_data);
      } 



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

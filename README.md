
## HEROKU

Install Heroku's Toolbelt, this will give you access to Heroku and the Foreman tool to start and stop your app. Download here, <https://toolbelt.heroku.com/>

## USAGE

### First things first

First time running the code you need to install the required modules that are defined in **package.json**. Navigate to the code directory in Terminal. Install all dependencies by running the following command.
	
	npm install

You only need to run this code once, every time you update **package.json**.

### Git init, commit

Create a git repository in your code directory

	git init
	git add .
	git commit -am "init commit"

### Create Heroku App

Create a Heroku app, we need to do this so we can get a database set up.

	heroku create


### MongoDB (MongoLab) Addon

**FOR NEW HEROKU APPS THAT DON'T ALREADY HAVE A MONGODB DATABASE.**

Add a [MongoDB MongoLab database](https://addons.heroku.com/mongolab) to your new Heroku app, we need this database to store the Image filenames that are uploaded

	heroku addons:add mongolab:starter

### Prepare your Environment Variable File

Need to store the MongoLab connection uri in .env for local development. We grab it from Heroku's config

	heroku config --shell | grep MONGOLAB_URI >> .env

This will autofill your .env file.


## Amazon Web Services

This app uses Amazon S3 Web Service for storage of the uploaded images. You must have an Amazon AWS account AND have your access credentials 

### Register with Amazon Web Services

Create an account on Amazon Web Services, you can use your Amazon account, [http://aws.amazon.com/console/](http://aws.amazon.com/console/) Click on the Sign Up button.

### Log in and create new S3 bucket

When you're registered and logged into the AWS site, visit the console, [https://console.aws.amazon.com/console/home?#](https://console.aws.amazon.com/console/home?#)

In the Storage and Content Delivery section click on S3, scalable storage in the cloud, [https://console.aws.amazon.com/s3/home](https://console.aws.amazon.com/s3/home).

Now we will create a bucket (like a directory). The bucket will be the container for your uploaded files. On the left panel of the S3 console, click 'Create Bucket'. Provide a **bucket name** and leave the **Region** to US Standard. Then click **Create**.

### Add environment variables to .env and Heroku

Inside the AWS Console, on the top menu bar click on your name, then click **SECURITY CREDENTIALS**.

On the SECURITY CREDENTIALS page, you will have access to

* ACCESS KEY ID
* SECRET ACCESS KEY

Open your .env file and add 2 new variables for Amazon AWS

**.env**

	AWS_ACCESS_KEY=XXXXXXXXXXXX
	AWS_SECRET_KEY=XXXXXXXXXXX

Save your .env file.

Now let's push the new AWS variable to Heroku config, run the commands in Terminal

	heroku config:add AWS_ACCESS_KEY_ID=XXXXXXXXXXX
	heroku config:add AWS_SECRET_ACCESS_KEY=XXXXXXXXXXX 

You can confirm the AWS variables are on heroku by running the command,

	heroku config

### Start the server

Navigate to code directory in Terminal: 
	
	foreman start

If successful, your Terminal window will read... 

> Server started on port 5000

### View the webpages

Open Web Browser and navigate to [http://localhost:5000](http://localhost:5000)

Available URLs 

* [http://localhost:5000/](http://localhost:5000)


### Stopping the server (CTRL+C)

You must manually stop the NodeJS in the Terminal window that is running the script. 

If the Terminal window, stop the script with **CTRL+C**


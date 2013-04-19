
## HEROKU

Install Heroku's Toolbelt, this will give you access to Heroku and the Foreman tool to start and stop your app. Download here, <https://toolbelt.heroku.com/>

## USAGE

### First things first

First time running the code you need to install the required modules that are defined in **package.json**. Navigate to the code directory in Terminal. Install all dependencies by running the following command.
	
	npm install

You only need to run this code once, every time you update **package.json**.

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


### This project is the implementation of Role based access control. and this repository contains only backend code.
# Run the code locally
- Clone the repository: `git clone https://github.com/VivekSite/rbac_system.git`
- Install all the dependencies: `yarn install`
- Create .env file and add required variables
	`cp .env.example .env`
- ```
	NODE_ENV=development
	PORT=8080
	MONGO_URI=mongodb://localhost:27017/rbac_server
	ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4200  # add more origins separated by commas

	ACCESS_TOKEN_SECRET=****************************
	REFRESH_TOKEN_SECRET==****************************
	HASH_SECRET==****************************
	OTP_SECRET==****************************

	EMAIL_SENDER=example@exampl.com
	EMAIL_PASS_KEY='**** **** **** ****'

	```
- Build and start the application `yarn dev`

- Application uses JWT token for authentication and authorization. I'm using browser cookies to store the access and refreshToken. accessToken will get expired in 1hour and refreshToken will expiresIn 30day.
- For role based authentication I'm storing role information in the jwt payload and whenever user makes request to backend I'm checking is user has permission to access particular resouces or not.

# Application for Corona Test Centers

This is a complete booking system to reservate dates and handle results at a corona test
station. It was developed in a hurry and contains therefore maybe some bugs or
shortcomings.

## :heart_eyes: Features
This application provides the following features:

- Login with email
- Multiple reservations per email address
- Test result overview after login
- Reservation confirmation email with calender invitation
- Test result transmission via E-Mail with digital verifiable PDF
- Test log generation with privacy policy
- Ids with check digit to avoid misentry
- Easy result entry through barcodes
- Start time, end time, number of slots and dates per slot configurable
- Configurable overall or weekly number of tests
- Admin area with basic statistics and possibility to add more dates
- Result overview for admins

Features which are currently missing:

- Location selection
- Waiting list
- Canceling and editing of reservations via admin page

## :rocket: Getting Started
To run the application you need a MySQL or Postgres Database. Add the db url to the `.env` file (rename e.g. `.env-example`).

```
DATABASE_URL="mysql://user:password@localhost:3306/db_name"
```

This application also needs a secure random string (e.g. `openssl rand -hex 32`) in the `.env` file.

```
SECRET=random_string
```

Mail configuration and list of moderator email addresses should also go to `.env`.

```
SMTP_HOST=smtp.yourserver
SMTP_PORT=587
SMTP_USER=testung@yourdomain
SMTP_PASSWORD=password
SMTP_FROM=testung@yourdomain

MODERATORS=mod1@yourdomain,mod2@yourdomain
```

You can find more configuration options in `.env-example`. If you want to change the text
(including email and so on), you have to do it directly in the code.

Now you have to run the following commands to run the application:

```bash
yarn install
yarn deploy:db
yarn build
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result. Open [http://localhost:3000/elw](http://localhost:3000/elw) to enter the
moderator page and
[http://localhost:3000/station](http://localhost:3000/station) for the stadion
page (result entry).

In production you can use [pm2] to run this application as service with

```
pm2 start yarn --name "corona-testing" --interpreter bash -- start
```

Or you can use the following service file for system.d:

```
[Unit]
Description=corona-testing - Next.js application for registration and more
Documentation=
After=network.target

[Service]
WorkingDirectory=/opt/corona-testing/
Environment=NODE_ENV=production
Environment=NODE_ICU_DATA=/opt/corona-testing/node_modules/full-icu
Type=simple
User=corona-tt
ExecStart=/usr/bin/yarn next start -p 3078
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

## :pick: Troubleshooting
- Make sure that your node installation is using full ICU. Otherwise set
  `NODE_ICU_DATA=PATH_TO_APP/node_modules/full-icu` as environment variable.
- PDFs are generated via [puppeteer], so make sure you don't miss any dependencies.

## :camera: Screenshots
### User
![Screenshot ](https://github.com/drkTettnang/corona-testing/raw/main/docs/screenshot-welcome.png)
![Screenshot ](https://github.com/drkTettnang/corona-testing/raw/main/docs/screenshot-selection.png)
![Screenshot ](https://github.com/drkTettnang/corona-testing/raw/main/docs/screenshot-registration.png)
![Screenshot ](https://github.com/drkTettnang/corona-testing/raw/main/docs/screenshot-complete.png)

### Moderator
![Screenshot ](https://github.com/drkTettnang/corona-testing/raw/main/docs/screenshot-moderator.png)
![Screenshot ](https://github.com/drkTettnang/corona-testing/raw/main/docs/screenshot-result.png)
![Screenshot ](https://github.com/drkTettnang/corona-testing/raw/main/docs/screenshot-test-log.png)

### Station
![Screenshot ](https://github.com/drkTettnang/corona-testing/raw/main/docs/screenshot-anmeldung-station.png)
![Screenshot ](https://github.com/drkTettnang/corona-testing/raw/main/docs/screenshot-station-signin.png)
![Screenshot ](https://github.com/drkTettnang/corona-testing/raw/main/docs/screenshot-station-result.png)

[pm2]: https://pm2.keymetrics.io
[puppeteer]: https://github.com/puppeteer/puppeteer
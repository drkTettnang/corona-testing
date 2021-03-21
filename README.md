# Application for Corona Test Centers

This is a complete booking system to reservate dates and handle results at a corona test
station. It was developed in a hurry and contains therefore maybe some bugs or
shortcomings.

## :heart_eyes: Features
This application provides the following features:

- Login with email
- Location selection
- Two-phase locking to prevent overbooking
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
- Cancel bookings easily in the admin area with email notification
- Built-in barcode reader

Features which are currently missing:

- Waiting list
- Editing of reservations via admin page

## :rocket: Getting Started
To run the application you need a MySQL Database. Add the db url to the `.env` file (rename e.g. `.env-example`).

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

You can find more configuration options in `.env-example`. We moved most texts
(e.g. mail body, welcome text) to one template folder which is not under source
control. Therefore you have to copy `templates-example/` to `templates/` and
adapt everything to your needs. Beware that you carefully check the changelog on
upgrades for modifications of the templates.

Now you have to run the following commands to run the application:

```bash
yarn install
yarn deploy:db
cp -r templates-example/ templates/
yarn build
yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result. Open [http://localhost:3000/elw](http://localhost:3000/elw) to enter the
moderator page and
[http://localhost:3000/station](http://localhost:3000/station) for the station
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
Environment=TZ=Europe/Berlin
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

In most configurations the node application is not directly reachable,
instead a web server like Apache is used as proxy. An example vhost could look like this:

```
<VirtualHost *:80>
	ServerName YOUR.DOMAIN

	RewriteEngine On
	Redirect permanent / https://YOUR.DOMAIN/
</VirtualHost>

<VirtualHost *:443>
	ServerName YOUR.DOMAIN

	Header always set Strict-Transport-Security "max-age=15768000;"
	Header always set Content-Security-Policy "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline';"

	DocumentRoot /var/www/YOUR.DOMAIN
	<Directory /var/www/YOUR.DOMAIN>
		SSLRenegBufferSize 10486000
	</Directory>

	SSLEngine On
	SSLCertificateFile /etc/letsencrypt/live/YOUR.DOMAIN/fullchain.pem
	SSLCertificateKeyFile /etc/letsencrypt/live/YOUR.DOMAIN/privkey.pem

	ProxyPass /.well-known/acme-challenge/ !
	ProxyPass / http://localhost:3078/
	ProxyPassReverse / http://localhost:3078/
</VirtualHost>
```

This application provides a web cron endpoint `/api/web-cron` to run a garbage
collector which deletes expired entries and bookings which are older than 14
days to keep everything GDPR conform. To protect the endpoint you can specify a
secret in `.env` which you have to append as `/api/web-cron?auth=SECRET`. Make
sure the task is not executed concurrent, otherwise the archive could be messed
up.

## :pick: Troubleshooting
- Make sure that your node installation is using full ICU. Otherwise set
  `NODE_ICU_DATA=PATH_TO_APP/node_modules/full-icu` as environment variable.
- PDFs are generated via [puppeteer], so make sure you don't miss any
  dependencies. You can use the following snippet to test if everything is
  working as expected.

  ```js
  const puppeteer = require('puppeteer');

  (async function(){
          const browser = await puppeteer.launch();
          const page = await browser.newPage();

          console.log(await page.evaluate('(new Date("2021-03-14T10:54:23.527Z")).toLocaleString("de-DE")'), 'should be "14.3.2021, 11:54:23"');

          await browser.close();
  })();
  ```

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
![Screenshot ](https://github.com/drkTettnang/corona-testing/raw/main/docs/screenshots-station-mobil.png)

[pm2]: https://pm2.keymetrics.io
[puppeteer]: https://github.com/puppeteer/puppeteer

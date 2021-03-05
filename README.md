This is a simple booking system to reservate dates at an one day corona test
station. It was developed in a hurry and contains therefore maybe some bugs or
shortcomings.

## :heart_eyes: Features
This application provides the following features:

- Login with email
- Up two 5 reservations per email address (2 adults + 3 children)
- Test result overview after login
- Reservation confirmation email with calender invitation
- Test result transmission via E-Mail
- Test log generation with privacy policy
- Ids with check digit to avoid misentry
- Easy result entry
- Start time, end time, number of slots and dates per slot configurable
- Automatic rest slot on halftime

Features which are currently missing:

- Result overview for admins
- Day and location selection. Currently this application is only meant to be used for a one day testing station.
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

You can configure your dates in `lib/const.ts`. If you want to change the text
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
[http://localhost:3000/elw/test-log](http://localhost:3000/elw/test-log) to
generate all test logs (this page is designed only to be look good if printed).

In production you can use [pm2] to run this application as service with

```
pm2 start yarn --name "corona-testing" --interpreter bash -- start
```

ALTER TABLE bookings AUTO_INCREMENT=10000;

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

[pm2]: https://pm2.keymetrics.io
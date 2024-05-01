# Shelf Stability System

## Login Guide
Logging in via Duke SSO registers your account as a non-admin user with limited priveleges. To login as the super admin, use
- Username: admin
- Password: superStabilityTracker378
  
Note that logging in as an admin grants you full read/write access to the system, so please do not abuse this by deleting entities you didn't create or overloading our database. Thanks!

## Developer Guide
This app uses [Next.js](https://nextjs.org/) to have both frontend and backend code contained within a single codebase with a RESTful API to connect them. We use [Prisma](https://www.prisma.io/) as an ORM to communicate with our database in a type-safe way.

We use a postgres database with the tables `Assay`, `AssayResult`, `AssayType`, `AssayTypeForExperiment`, `Condition`, `Experiment`, and `User`. Experiments have some number of Conditions, as expressed by an experiment id in each condition, and some number of AssayTypeForExperiments. AssayTypeForExperiment serves as a table mapping assay types for a specific experiment to the associated technicians, along with any future experiment specific data. Assays have ids for an Experiment, Condition, and AssayType that they belong to. There is no limit on how many Assays may link to a given Experiment or AssayTypeForExperiment. We also use two different views: `AssayAgendaView` and `ExperimentWeekView`. The exact details of our database schema are in the `prisma/schema.prisma` file.

For development:
- Install Node.js v21.6.1. We recommend using [nvm](https://github.com/nvm-sh/nvm) for this
- Clone this GitHub repository
- Create a `.env` file in the root of the project with the format shown below. The details for populating this file will be provided by someone who knows them.
```
DATABASE_URL="<database connection string>"
NEXTAUTH_SECRET=<secret>
NEXTAUTH_URL=<public address of the webserver>
DUKE_CLIENT_ID=<SSO client ID>
DUKE_CLIENT_SECRET=<SSO client secret>
SENDGRID_API_KEY=<secret>
SENDER_EMAIL=<email address of sender for email service>
```
- In the root of the project, run `npm install`
- Run `npm run dev` to start the webserver. You should now be able to access it at [http://localhost:3000](http://localhost:3000)

## Deployment Guide

We started with an Ubuntu 22.04 server with the following packages installed:
- Node.js v21.6.1 (installed through [nvm](https://github.com/nvm-sh/nvm) although this method is not required)
- nginx
- [pm2](https://www.npmjs.com/package/pm2) (Optional, but useful)
- postgresql (if hosting the database on the same machine, however we will not be detailing how to setup the database software) 

Clone this repository to somewhere on the machine. Create a file called `.env` in the root with the format
```
DATABASE_URL="<database connection string>"
NEXTAUTH_SECRET=<secret>
```
Replace the database connection string with whatever connection string is used for the database you're using and the secret with some random string of your choice (an easy way to generate this is with `openssl rand -base64 32`). These instructions assume your database software is already running somewhere it can be reached from the server.

`cd` into the project root and run the following commands:

```bash
npm install # Install all required packages

# If starting a fresh install with no data:
npx prisma migrate deploy # Deploy the database schema

# If restoring from a backup
pg_restore -U postgres -d postgres -1 <path/to/your/backup.sql>
```

Then start the webserver. 
For a production environment, run this to build the project:
```bash
npm run build
```
Followed by this to start the server:
```bash
npm run start
```
or if you're using pm2
```bash
pm2 start npm --name "prod" -- start # "prod" may be replaced with a name of your choosing
```

To launch the webserver on boot with pm2:
```bash
pm2 startup

# Paste the command it instructs you to run

pm2 save
```

The webserver will now be accepting http requests on port 8080. `nginx` will be needed to get it accepting https requests on port 80.

There are many ways to configure nginx to achieve this, however, this was our method
- In `/etc/nginx/nginx.conf`, within the `http` block, add:
```nginx
server {
    server_name <your domain name(s) here>;
    location / {
        proxy_pass http://localhost:8080;
    }
}
```
- In the same file, comment out the following lines (although perhaps useful, we did not need these):

```nginx
include /etc/nginx/conf.d/*.conf;
include /etc/nginx/sites-enabled/*;
```
- Follow the instructions on the [Certbot website](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal) to obtain and install an HTTPS certificate

The first time you connect to the website, you will be presented with a page to setup the initial admin password. It is recommended to do this sometime before the server can be accessed from outside the network.

## Backup Guide
Our backup system is implemented using a cron job that SSHs into the webserver and dumps a backup using postgres's `pg_dump` utility. Progress notifications and failure alerts are sent using a discord webhook (although other alerts should be relatively simple to set up).

To set up this system:
Install python and [paramiko](https://www.paramiko.org/)

Edit the constants in `scripts/make-backup` to specify the folder to save backups to, the authentication details to retrieve backups from the production server, and the webhook url to post updates and alerts to.

Copy the script into `/etc/cron.daily`. Make sure the file is owned by the root user and that no other users or groups have write access to it.

The files output by the backup system are long sets of SQL commands. They can easily be run by the database using the `pg_restore` command:
```bash
pg_restore -U postgres -d postgres -1 <path/to/your/backup.sql>
```
The username you use may be different depending on your SQL server setup. Note that this may conflict in minor ways if the database is not empty, so you should wipe the database before restoring a backup.

# Shelf Stability System

## Developer Guide
This app uses [Next.js](https://nextjs.org/) to have both frontend and backend code contained within a single codebase with a RESTful API to connect them. We use [Prisma](https://www.prisma.io/) as an ORM to communicate with our database in a type-safe way.

We use a postgres database with the tables `Assay`, `AssayType`, `Condition`, and `Experiment`. Experiments have some number of AssayTypes and Conditions, as expressed by an experiment id in each of them. Assays have ids for an Experiment, Condition, and AssayType that they belong to. There is no limit on how many Assays may link to a given Experiment, Conditon, or AssayType.

For development:
- Install Node.js v21.6.1. We recommend using [nvm](https://github.com/nvm-sh/nvm) for this
- Clone this GitHub repository
- Create a `.env` file in the root of the project with the format shown below. The details for populating this file will be provided by someone who knows them.
```
DATABASE_URL="<database connection string>"
NEXTAUTH_SECRET=<secret>
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
npx prisma migrate deploy # Deploy the database schema
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

The first time you connect to the website, you will be presented with a Set Password page to setup the initial password. It is recommended to do this sometime before the server can be accessed from outside the network.

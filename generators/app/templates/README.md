[![Build Status](https://travis-ci.org/<%= github %>.svg?branch=master)](https://travis-ci.org/<%= github %>)

> <%= project %>

Boilerplate for [Harp](http://harpjs.com) with Gulp support, responsive images and a simple blog structure.

## Setup

1. Setup boilerplate using [Yeoman](http://yeoman.io): `yo mzharp` (see full documentation at [Generator MZ Harp](https://github.com/marzeelabs/generator-mzharp))
2. Navigate inside the new directory with `cd my-harp`
3. Install all dependencies with `npm install`. This is handled by the Yeoman generator.
4. (optional) install gulp and harp globally with `npm install -g gulp harp` so you get the CLIs available. Alternatively, these packages are also defined as local dependencies.

This will get you a copy of the repository locally and also download all node dependencies such as [harp](http://harpjs.com/), [Gulp](http://gulpjs.com/), [jimp](https://github.com/oliver-moran/jimp), [Browsersync](https://www.browsersync.io/), etc.

## Run

In order to serve your local copy of the website, while on the project directory, just do `gulp` and everything will be handled for you.

The default task for *gulp* will:

1. Create responsive versions of the blog's images with *jimp*
2. Minify and concatenate the multiple JS scripts with *uglify*
3. Build the static files for the website in the *www* dir with *harp*
4. Serve the website in [localhost:3333](http://localhost:3333) with *harp* and *Browsersync*

#### Responsive images

The default *gulp* tasks take care of processing the images in various sizes for the responsive image markup, as well as replacing the code in the compiled HTML. All that is required is for the author to add the image files in the *_posts-images* directory and include the base image (also copied to *public/images/posts/*) in the post - e.g. *[alt](/images/posts/file.extension)*

## Development

For development guidelines, please check the harp documentation at http://harpjs.com/docs/development/

## Reviewing and hosting

In order to review the static site, this boilerplate is integrated with [Heroku's pipelines](https://devcenter.heroku.com/articles/pipelines), which spins up a new site for each pull request and commit.

Travis is also setup to automatically build the website and deploy the static files to a branch on Github:

1. Install the Travis CLI tool with `gem install travis`.
2. Log in to Travis with `travis login`.
3. Create a new RSA key with `ssh-keygen -t rsa -C "Deploy key for <%= project %>" -f deploy_key` (don't use a passphrase!).
4. Put the contents of the generated file **deploy_key.pub** into https://github.com/<username>/<repository>/settings/keys as new deploy key with write access. You can delete this file, you won't need it anymore.
5. Use the Travis CLI to encrypt your file with `travis encrypt-file deploy_key --add`. The *add* option should automatically update your .travis.yml file with a line starting with "openssl aes-256" in the "before_install" section.
6. Delete the previously generated **deploy_key** file - do not commit it to the repository! The only file you must commit is the encrypted file **deploy_key.enc**.
7. Configure the *DEPLOY_FROM* and *DEPLOY_TO* branches in **scripts/deploy.sh** and the git username and email you want to show up in the deploy commits (this is handled automatically when you use the Yeoman generator).
8. When a PR is successfully merged to the **DEPLOY_FROM** branch you chose, Travis will build the website and commit the result to your chosen **DEPLOY_TO** branch. Don't forget that Travis must be set up to build PRs AND pushes (this is handled automatically when you use the Yeoman generator).

## Credits

Made by [Marzee Labs](http://marzeelabs.org)

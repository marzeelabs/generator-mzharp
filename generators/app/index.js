'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the swift ' + chalk.red('Marzee Labs HarpJS') + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'project',
        message: 'Your project machine name (this will also be your GitHub repository name)',
        default: path.basename(process.cwd()) // Default to current folder name
      },
      {
        type: 'input',
        name: 'description',
        message: 'Your project description',
        default: 'The project description'
      },
      {
        type: 'input',
        name: 'github_account',
        message: 'Your GitHub owner name (your user account or organisation account)',
        default: 'marzeelabs'
      },
      {
        type: 'confirm',
        name: 'heroku',
        message: 'Would you like to use Heroku to set up a review app pipeline?',
        default: true
      },
      {
        type: 'confirm',
        name: 'travis',
        message: 'Would you like to use Travis CI for automated testing?',
        default: true
      },
      {
        type: 'confirm',
        name: 'travis_to_github',
        message: 'Would you like to use Travis CI for deployming your production site to Github Pages?',
        default: true
      },

      {
        type: 'input',
        name: 'cname',
        message: 'The custom domain for GitHub Pages',
        default: path.basename(process.cwd()) + '.example.org',
        when: function(answers) {
          return answers.travis_to_github;
        }
      },
      {
        type: 'input',
        name: 'deploy_from',
        message: 'The git branch you would like Travis CI to deploy from',
        default: 'master',
        when: function(answers) {
          return answers.travis_to_github;
        }
      },
      {
        type: 'input',
        name: 'deploy_to',
        message: 'The git branch you would like Travis CI to deploy into',
        default: 'gh-pages',
        when: function(answers) {
          return answers.travis_to_github;
        }
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.project;
      this.props = props;
    }.bind(this));
  },

  configuring: function () {
    this.log(yosay('Gotcha! Generating template files.'));
  },

  writing: function () {
    var params = {
      project: this.props.project,
      description: this.props.description,
      github_account: this.props.github_account,
      github: this.props.github_account + '/' + this.props.project,
      heroku: this.props.heroku,
      travis: this.props.travis,
      travis_to_github: this.props.travis_to_github,
      cname: this.props.cname,
      deploy_from: this.props.deploy_from,
      deploy_to: this.props.deploy_to
    }

    var templates = [
      { "src": "README.md"},
      { "src": "_gitignore", "dest": ".gitignore" },
      { "src": "_package.json", "dest": "package.json" },
      { "src": "_gulpfile.js", "dest": "gulpfile.js" },
      { "src": "harp.json"},
      { "src": "public/_data.json" },
      { "src": "scripts/deploy.sh" },
      { "src": "Procfile", "when": this.heroku },
      { "src": "_travis.yml", "dest": ".travis.yml", "when": this.travis },
      { "src": "CNAME", "when": typeof this.props.cname === 'string' },
    ];

    // Copy directories without templating
    this.fs.copy(
      this.templatePath('public'),
      this.destinationPath('public')
    );
    this.fs.copy(
      this.templatePath('scripts'),
      this.destinationPath('scripts')
    );

    for (var key in templates) {
      var template = templates[key];
      var dest = template.dest === undefined ? template.src : template.dest;
      if (template.when === undefined || template.when === true) {
        this.fs.copyTpl(
          this.templatePath(template.src),
          this.destinationPath(dest),
          params
        );
      }
    }
  },

  install: function () {
    this.log(yosay('Installing dependencies. This might take a while'));
    this.npmInstall();
  },

  end: function () {
    this.log(yosay('Finished generating, but there are a few more steps to run through!'));

    this.log(chalk.blue.bold('We suggest you run these commands in a different window so you can follow the help instructions here!'));

    this.log("\n" + chalk.green.bold.underline('Set up your GitHub repository:'));
    this.log(chalk.red.bold('git init && git add -A && git commit -m "Initial commit"') + ': make your first commit');
    this.log(chalk.red.bold('git remote add origin ' + this._formatGitHub(this.props.github_account, this.props.project)) + ': add a GitHub remote');
    this.log(chalk.red.bold('git push origin master') + ': push your changes to GitHub');

    if (this.props.heroku) {
      this.log("\n" + chalk.green.bold.underline('Heroku pipeline:'));
      this.log(chalk.red.bold('heroku create ' + this.props.project) + ': create your Heroku project');
      this.log(chalk.red.bold('git push heroku master') + ': push your app to Heroku - this will build the project');
      this.log(chalk.red.bold('heroku open') + ': open the app in your web browser');
      this.log(chalk.red.bold('heroku pipelines:create ' + this.props.project) + ': set up pipeline support for review apps');
      this.log(chalk.red.bold('heroku pipelines:open ' + this.props.project) + ': open heroku UI pipeline support.');
      this.log('   In the UI, click "Connect to Github", then "Enable review apps" and - all via the UI - commit a file called ' + chalk.gray.bold('app.json') + ' to your repository. Tick all the boxes.');
      this.log('   Now, open a PR in your GitHub repository and a review app will be built automatically.');
    }

    if (this.props.travis) {
      this.log("\n" + chalk.green.bold.underline('Travis CI:'));
      this.log(chalk.red.bold('travis enable') + ': enable travis integration.')
    }

    if (this.props.travis_to_github) {
      this.log("\n" + chalk.green.bold.underline('Travis CI deploying to GitHub pages:'));
      this.log('Setup custom domain to GitHub Pages: ' + chalk.blue.bold.underline('https://help.github.com/articles/using-a-custom-domain-with-github-pages/'));
      this.log('Add an encrypted deployment key to your ' + this.props.project + 'repository, following these instructions: ' + chalk.blue.bold.underline('https://github.com/marzeelabs/generator-mzharp/tree/master/generators/app/templates#reviewing-and-hosting'));
      this.log('Every time you push to ' + chalk.gray.bold(this.props.deploy_from) + ', Travis CI will automatically build your app and push to ' + chalk.gray.bold(this.props.deploy_to) + ', which will be picked up by GitHub pages.');
      this.log('Your app will be accessible at ' + chalk.blue.bold.underline(this.props.cname));
    }

    this.log("\n" + chalk.green.bold.underline('Commands for local development:'));
    this.log(chalk.red.bold('gulp') + ': you can preview your project in ' + chalk.blue.bold.underline('localhost:3330'));
    this.log(chalk.red.bold('gulp build') + ': build your Harp project manually');
  },

  _formatGitHub: function (account, repo) {
    return 'https://github.com/' + account + '/' + repo + '.git'
  }
});

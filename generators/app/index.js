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

    var prompts = [{
      type: 'input',
      name: 'project',
      message: 'Your project machine name',
      default: path.basename(process.cwd()) // Default to current folder name
    },
    {
      type: 'input',
      name: 'description',
      message: 'Your project description',
    },
    {
      type: 'input',
      name: 'github',
      message: 'Your GitHub repository name (something like marzeelabs/repo-name)',
    },
    {
      type: 'input',
      name: 'deploy_from',
      message: 'The git branch you would like Travis CI to deploy from',
      default: 'master',
    },
    {
      type: 'input',
      name: 'deploy_to',
      message: 'The git branch you would like Travis CI to deploy into',
      default: 'gh-pages',
    }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.project;
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    var params = {
      project: this.props.project,
      description: this.props.description,
      github: this.props.github,
      deploy_from: this.props.deploy_from,
      deploy_to: this.props.deploy_to,
    }

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      params
    );

    this.fs.copyTpl(
      this.templatePath('_gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      params
    );

    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      params
    );

    this.fs.copy(
      this.templatePath('_gitignore'),
      this.destinationPath('.gitignore')
    );

    this.fs.copy(
      this.templatePath('public'),
      this.destinationPath('public')
    );
    this.fs.copyTpl(
      this.templatePath('public/_data.json'),
      this.destinationPath('public/_data.json'),
      params
    );

    this.fs.copy(
      this.templatePath('scripts'),
      this.destinationPath('scripts')
    );
    this.fs.copyTpl(
      this.templatePath('scripts/deploy.sh'),
      this.destinationPath('scripts/deploy.sh'),
      params
    );
  },

  install: function () {
    this.installDependencies();

    if (this.props.github) {
      this.log(chalk.blue('************************************************************'));
      this.log(chalk.blue('Do not forget to enable Travis-CI via https://travis-ci.org/'));
      this.log(chalk.blue('************************************************************'));
    }
  }
});

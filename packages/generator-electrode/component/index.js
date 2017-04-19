"use strict";

var _ = require("lodash");
var chalk = require("chalk");
var yeoman = require("yeoman-generator");
var path = require('path');
var extend = _.merge;
var parseAuthor = require('parse-author');

var ReactComponentGenerator = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);
  },
  initializing: function () {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    // Pre set the default props from the information we have at this point
    this.props = {
      packageName: this.pkg.name
    };

    if (_.isObject(this.pkg.author)) {
      this.props.developerName = this.pkg.author.name;
      this.props.createDirectory = true;
    } else if (_.isString(this.pkg.author)) {
      var info = parseAuthor(this.pkg.author);
      this.props.developerName = info.name;
    }
  },
  prompting: {
    greeting: function () {
      this.log(
        "\n" + chalk.bold.underline("Welcome to the Electrode Component Generator") +
        "\n" +
        "\nWe're going to set up a new " + chalk.bold("Electrode") + " component, ready for development with" +
        "\n" + chalk.bold("gulp, webpack, demo, electrode component archetype, and live-reload")
      );
    },
    askFor: function () {
      if (this.pkg.name || this.options.name) {
        this.props.name = this.pkg.name || _.kebabCase(this.options.name);
      }
      var prompts = [{
        type: "input",
        name: "projectName",
        message: "What is your Package/GitHub project name? (e.g., 'wysiwyg-component')",
        default: "wysiwyg-component"
      },
      {
        type: "input",
        name: "packageName",
        message: "What is the ClassName for your component?",
        default: this.props.componentName
      }, {
        type: "input",
        name: "packageName",
        message: "What will be the npm package name?",
        default: this.props.packageName
      }, {
        type: "input",
        name: "packageGitHubOrg",
        message: "What will be the GitHub organization username (e.g., 'walmartlabs')?",
        default: this.props.packageGitHubOrg
      }, {
        type: "input",
        name: "developerName",
        message: "What is your name? (for copyright notice, etc.)",
        default: this.props.developerName
      },
      {
        type: "input",
        name: "ghUser",
        message: "What is your GitHub Username?",
        default: this.props.developerName
      }, {
        type: "list",
        name: "quoteType",
        message: "Use double quotes or single quotes?",
        choices: ["\"", "'"],
        default: "\""
      }, {
        type: "input",
        name: "ghRepo",
        message: "What is the name of the GitHub repo where this will be published?",
        default: this.packageName
      }, {
        type: "confirm",
        name: "createDirectory",
        message: "Would you like to create a new directory for your project?",
        default: true
      }];
      return this.prompt(prompts).then((props) => {
        this.props = extend(this.props, props);
        this.projectName = this.props.projectName;
        this.packageName = this.props.projectName;
        this.developerName = this.props.developerName.split(" ").map(_.toLower).join("");
        this.quoteType = this.props.quoteType;
        this.ghUser = this.props.ghUser;
        this.ghRepo = this.props.ghRepo;
        this.packageGitHubOrg = this.props.packageGitHubOrg;
        this.createDirectory = this.props.createDirectory;
        this.componentName = _.kebabCase(_.deburr(this.props.projectName))
          .replace(/^\s+|\s+$/g, "")
          .replace(/(^|[-_ ])+(.)/g, function (match, first, second) {
            return second.toUpperCase();
          });
        this.currentYear = new Date().getFullYear();
        if (this.props.createDirectory) {
          var newRoot = this.destinationPath() + '/' + this.packageName;
          this.destinationRoot(newRoot);
        }
      });
    }
  },

  writing: {
    project: function () {
      this.copy("packages/component/babelrc", "packages/" + this.projectName + "/.babelrc");
      this.copy("packages/component/gitignore", "packages/" + this.projectName + "/.gitignore");
      this.copy("packages/component/npmignore", "packages/" + this.projectName + "/.npmignore");
      this.copy("packages/component/editorconfig", "packages/" + this.projectName + "/.editorconfig");
      if (this.quoteType === "'") {
        this.template("packages/component/eslintrc", "packages/" + this.projectName + "/.eslintrc");
      }
      this.template("packages/component/_gulpfile.js", "packages/" + this.projectName + "/gulpfile.js");
      this.template("packages/component/_package.json", "packages/" + this.projectName + "/package.json");
      this.template("packages/component/_readme.md", "packages/" + this.projectName + "/README.md");
    },
    component: function () {
      this.template("packages/component/src/components/_component.jsx", "packages/" + this.projectName + "/src/components/" + this.projectName + ".jsx");
      this.template("packages/component/src/styles/_component.css", "packages/" + this.projectName + "/src/styles/" + this.projectName + ".css");

      // l10n language templates
      this.template("packages/component/src/lang/_DefaultMessages.js", "packages/" + this.projectName + "/src/lang/default-messages.js");
      this.template("packages/component/src/lang/_en.json", "packages/" + this.projectName + "/src/lang/en.json");
      this.template("packages/component/src/lang/tenants/electrodeio/_defaultMessages.js", "packages/" + this.projectName + "/src/lang/tenants/electrodeio/default-messages.js");

      this.template("packages/component/src/_Component.js", "packages/" + this.projectName + "/src/index.js");
    },
    test: function () {
      this.template("packages/component/test/client/eslintrc", "packages/" + this.projectName + "/test/client/.eslintrc");
      this.template("packages/component/test/client/components/_component.spec.jsx", "packages/" + this.projectName + "/test/client/components/" + this.projectName + ".spec.jsx");
      this.copy("packages/component/test/client/components/helpers/_intlEnzymeTestHelper.js", "packages/" + this.projectName + "/test/client/components/helpers/intl-enzyme-test-helper.js");
    }
    /*
    demo: function () {
      this.template("demo/_demo.jsx", "demo/demo.jsx");
      this.template("demo/_demo.css", "demo/demo.css");
      this.template("demo/examples/_component.example", "demo/examples/" + this.projectName + ".example");
    } */
  },

  install: function () {
    this.npmInstall();
  },

  end: function () {
    if (this.quoteType === "'") {
      this.spawnCommandSync("node_modules/.bin/eslint", ["--fix", "src", "demo", "example", "test", "--ext", ".js,.jsx"]);
    }
    var chdir = this.createDirectory ? "'cd " + this.packageName + "' then " : "";
    this.log(
      "\n" + chalk.green.underline("Your new Electrode component is ready!") +
      "\n" +
      "\nYour component is in src/ and your demo files are in demo/" +
      "\n" +
      "\nType " + chdir + "'gulp demo' to run the development build and demo tasks." +
      "\n"
    );
  }

});

module.exports = ReactComponentGenerator;

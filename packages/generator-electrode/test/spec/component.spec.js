const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");
const mockery = require("mockery");

describe("electrode:component", function() {
  this.timeout(180000);
  before(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });

    mockery.registerMock("npm-name", function() {
      return Promise.resolve(true);
    });

    mockery.registerMock("github-username", function() {
      return Promise.resolve("unicornUser");
    });

    mockery.registerMock(require.resolve("generator-license/app"), helpers.createDummyGenerator());
  });

  after(function() {
    mockery.disable();
  });

  describe("generating a new component", function() {
    const answers = {
      githubUrl: "https://github.com",
      quotes: "'",
      yarn: false,
      packageName: "test-component",
      createDirectory: true,
      developerName: "test-dev",
      projectName: "test-component"
    };
    helpers
      .run(path.resolve("component"))
      .withPrompts(answers)
      .withArguments("skip-install")
      .then(function() {
        assert.file("README.md");
      });
  });
});

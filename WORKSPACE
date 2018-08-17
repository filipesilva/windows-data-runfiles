git_repository(
    name = "build_bazel_rules_nodejs",
    remote = "https://github.com/bazelbuild/rules_nodejs.git",
    tag = "0.11.5",
    sha256 = "7997f40731eb77ca765784ae562a81a987b87fb8bdefd5a2491d282b3532e7e1"
)

load("@build_bazel_rules_nodejs//:package.bzl", "rules_nodejs_dependencies")
rules_nodejs_dependencies()

load("@build_bazel_rules_nodejs//:defs.bzl", "node_repositories", "yarn_install")
node_repositories(
  package_json = ["//:package.json"],
  preserve_symlinks = True,
)
yarn_install(
    name = "managed_dependencies",
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)
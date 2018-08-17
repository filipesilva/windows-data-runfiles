load("@build_bazel_rules_nodejs//:defs.bzl", "jasmine_node_test")

# This rule runs tests in nodejs.
jasmine_node_test(
    name = "test",
    srcs = [
        ":lib", 
        "data_runfiles.spec.js",
    ],
    data = ["data.json"],
    node_modules = "@managed_dependencies//:node_modules",
)

# We need to define a genrule to pretend this file is built.
# Otherwise the relative resolution from the data file would find the source file.
genrule(
    name = "lib",
    srcs = ["relative_module.js"],
    outs = ["relative_module_built.js"],
    cmd = "cp $< $@",
)

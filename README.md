# Relative path resolution from data files

When a data file is resolved on Windows via the runfiles manifest it is resolved back to the workspace path.

Since this path is in the user workspace relative resolutions from it will yield paths in the workspace and not the execroot.

In Linux/OSX this is not a problem because the data file path resolves to a symlink in the execroot, and thus relative paths from there will still be in the execroot.

In some cases the data file path needs to be used as a base path from which to resolve relative paths. This is common in the NodeJS ecosystem, where code loads JSON files that contain paths to other modules that need to be loaded.

But once we have an absolute path inside the workspace folder, relative paths from that file will still be absolute paths in the workspace and cannot be looked up in the manifest.

This becomes a bigger problem when passing data paths to third party libraries, since on those we have no control over how those files are processed or used.

In the reproduction section next I will give a concrete example.

Note: the problem here is described for data files, but this also happens for source files that do not need to be built.


## Example

You should see the following on the test log when running `bazel test ...` on Windows:

```
Started
relative data path is: ./data.json
resolved data path is: D:\sandbox\windows-data-runfiles\data.json
data content is: {
  "relativeModulePath": "relative_module_built.js"
}
relative module path is: relative_module_built.js
joined module path is: D:\sandbox\windows-data-runfiles\relative_module_built.js

Failures:
1) data resolution via runfiles should be able to resolve paths relative to data files
```

`D:\sandbox\windows-data-runfiles\` is my local workspace path, and https://github.com/bazelbuild/rules_nodejs is used for module resolution (including runfiles).

Below are the relevant runfile mappings on my machine:

```
__main__/data.json D:/sandbox/windows-data-runfiles/data.json
__main__/data_runfiles.spec.js D:/sandbox/windows-data-runfiles/data_runfiles.spec.js
__main__/relative_module_built.js C:/users/kamik/_bazel_kamik/5pi3ckcv/execroot/__main__/bazel-out/x64_windows-fastbuild/genfiles/relative_module_built.js
```

Resolving the data file follows this logic:

- I am currently in the parent file: `D:/sandbox/windows-data-runfiles/data_runfiles.spec.js`
- I want to resolve `./data.json`
   - look up the parents runfile entry: `__main__/data_runfiles.spec.js`
   - resolve the relative path relative to that entry: `__main__/data.json`
   - lookup that path on the manifest: `D:/sandbox/windows-data-runfiles/data.json`
- `./data.json` from `D:/sandbox/windows-data-runfiles/data_runfiles.spec.js` resolves to `D:/sandbox/windows-data-runfiles/data.json`

Inside the data file there is a relative path to another module that needs to be loaded (`relative_module_built.js`).

Performing path manipulation we join the directory name of the data file (`D:/sandbox/windows-data-runfiles/`) with the relative path to obtain `D:/sandbox/windows-data-runfiles/relative_module_built.js`.

This file does not exist in the workspace path because it is a built file, and this absolute path cannot be resolved via the manifest either because it does not match any of the entries.

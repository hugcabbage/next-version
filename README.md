# Next version action

This action generates version number, like v1, v1.2, v1.2.3...

This action simply calculates the version number and has no semantic function. You can specify the mode(length):

* 1, like v1.
* 2, like v1.2, the value range is 0-9 except for the first part.
* 3, like v1.2.2, the value range is 0-9 except for the first part.
* ...

In theory, you can specify the length of the infinite length.

## Usage

### Pre-requisites

Create a workflow `.yml` file in your repository's `.github/workflows` directory.

### Inputs

* `prefix` - A prefix. Required: `false`, Default: `v`.
* `mode` - Specify the length by number. Required: `false`, Default: `1`.
* `repo_path` - The path where the repository is. Required: `false`, Default: `.`.

### Outputs

* `version` - A version string.

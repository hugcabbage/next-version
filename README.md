# Next version action

This action generates version number, like v1, v1.2, v1.2.3.

This action simply calculates the version number and has no semantic function.There are three modes:

* short, like v1.
* medium, like v1.2, the value range is 0-9 except for the first part.
* long, like v1.2.2, the value range is 0-9 except for the first part.

## Usage

### Pre-requisites

Create a workflow `.yml` file in your repository's `.github/workflows` directory.

### Inputs

* `prefix` - A prefix. Required: `false`, Default: `v`.
* `mode` - There are three modes, `short`, `medium`, `long`. Required: `false`, Default: `short`.

### Outputs

* `version` - A version string.

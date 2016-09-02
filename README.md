# blucify-cli
> CLI tool for Blucify

## Installation ##
``` bash
$ npm install -g blucify-cli
```

## Usage ##
Below is an overview about the commands you can use:

### New project ###
For initializing a new project, use the following command:
``` bash
$ blucify new <project-name>
```

### Scaffolding ###
#### Component ####
For scaffolding a component, use the following command:
``` bash
$ blucify make:component <component-name>

# Use -s or --split if you want to use seperate files instead of a single .vue-file.
$ blucify make:component <component-name> -s
```

#### Layout ####
For scaffolding a layout, use the following command:
``` bash
$ blucify make:layout <layout-name>

# Use -s or --split if you want to use seperate files instead of a single .vue-file.
$ blucify make:layout <layout-name> -s
```

#### Mixin ####
For scaffolding a mixin, use the following command:
``` bash
$ blucify make:mixin <mixin-name>
```

#### Page ####
For scaffolding a page, use the following command:
``` bash
$ blucify make:page <page-name>

# Use -s or --split if you want to use seperate files instead of a single .vue-file.
$ blucify make:page <page-name> -s
```

#### Transformer ####
For scaffolding a transformer, use the following command:
``` bash
$ blucify make:transformer <transformer-name>
```

#### Vuex Module ####
For scaffolding a Vuex module, use the following command:
``` bash
$ blucify make:vuex-module <module-name>
```

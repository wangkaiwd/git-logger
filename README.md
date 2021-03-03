## git-logger

`git-logger` can input your git commit which in certain time frame.

### Usage

you can also install the package globally using npm:

```shell
npm i git-logger -g
```

Once that's done, you can run this command inside your project's root directory:

```shell
pglog -a username
```

Run this command to see a list of all available options:

```shell
pglog --help
```

### Available Options

* `-f` or `--filename`: Filename to output which relative current work directory(Default to `changelog.md` under current
  work directory).
* `-s` or `--start`: Git commit start time(Default to current time)
* `-e` or `--end`: Git commit end time(Default to Monday of current week)
* `-a` or `--author`: Author of git commit(Required options)

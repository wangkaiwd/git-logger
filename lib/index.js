const { padLeft } = require('./util');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

class Logger {
  constructor (options) {
    this.mergeOptions(options);
  }

  mergeOptions (options) {
    this.options = {
      directory: path.resolve(process.cwd(), './changelog.md'),
      end: this.formatDate(new Date()),
      ...options
    };
    if (!this.options.start) {
      this.options.start = this.defaultStartDate();
    }
  }

  formatDate (date) {
    date = new Date(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${padLeft(month)}-${padLeft(day)}`;
  }

  defaultStartDate () {
    const endDate = new Date(this.options.end);
    const week = endDate.getDay() + 1;
    endDate.setDate(-week);
    return this.formatDate(endDate);
  }

  normalizeMessage (stdout) {
    const commits = stdout.split(`\n`);
    return commits.reduce((map, commit) => {
      let [date, message] = commit.split('---');
      date = this.formatDate(date);
      const messages = map.get(date) ?? [];
      messages.push(message);
      map.set(date, messages);
      return map;
    }, new Map);
  }

  joinData (map) {
    let data = '';
    map.forEach((val, key) => {
      if (data !== '') {
        data += `\r\n`;
      }
      data += `### ${key}\r\n`;

      val.forEach((item, i) => {
        data += `${i + 1}. ${item}\r\n`;
      });
    });
    return data;
  }

  write (data) {
    let absPath = '';
    const { directory } = this.options;
    if (path.isAbsolute(directory)) {
      absPath = directory;
    } else {
      absPath = path.join(process.cwd(), directory);
    }
    fs.writeFile(absPath, data, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log('generate commit file successfully');
    });
  }

  log () {
    const { start, end, author } = this.options;
    const command = `git log --pretty=format:"%ad---%s" --after="${start}" --until="${end}" --author="${author}"`;
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
      const map = this.normalizeMessage(stdout);
      const data = this.joinData(map);
      this.write(data);
    });
  }
}

module.exports = Logger;

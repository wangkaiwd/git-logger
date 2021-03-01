const { padLeft } = require('./util');
const { exec } = require('child_process');

class Logger {
  constructor (options) {
    this.mergeOptions(options);
  }

  mergeOptions (options) {
    this.options = {
      directory: process.cwd(),
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

  normalizeMessage (commits) {

  }

  log () {
    const command = `git log --pretty=format:"%ad---%s" --after="${this.options.start}" --until="${this.options.end}" --author="wangkaiwd"`;
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
      }
      const commits = stdout.split(`\n`);
      const arr = commits.reduce((memo, commit) => {
        const [date, message] = commit.split('---');
        return memo.concat({ date, message });
      }, []);
      console.log(arr);
    });
  }
}

module.exports = Logger;

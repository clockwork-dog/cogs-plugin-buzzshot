#!/usr/bin/env node
const open = require("open");

const url = process.argv[process.argv.length - 1];
const boxName = process.argv.length > 3 ? process.argv[2] : null;
const queryString = boxName
  ? "?simulator=true&t=media_master&name=" + encodeURIComponent(boxName)
  : "";
open(url + queryString);

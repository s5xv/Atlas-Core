const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data.json');

let cache = null;

function load() {
  if (cache) return cache;
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    cache = JSON.parse(raw);
  } catch {
    cache = {};
  }
  return cache;
}

function save() {
  fs.writeFileSync(DB_PATH, JSON.stringify(cache), 'utf-8');
}

function get(key) {
  return load()[key];
}

function set(key, val) {
  load()[key] = val;
  save();
}

function del(key) {
  const data = load();
  delete data[key];
  save();
}

function getAll() {
  return load();
}

module.exports = { get, set, del, getAll, load };
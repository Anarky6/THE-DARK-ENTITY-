const spinnies = require('spinnies');

const spinner = { 
  interval: 120,
  frames: [
    "🕐",
    "🕑",
    "🕒",
    "🕓",
    "🕔",
    "🕕",
    "🕖",
    "🕗",
    "🕘",
    "🕙",
    "🕚",
    "🕛"
  ]
};

let globalSpinner;

const getGlobalSpinner = (disableSpinners = false) => {
  if (!globalSpinner) globalSpinner = new spinnies({ color: 'blue', succeedColor: 'green', spinner, disableSpinners });
  return globalSpinner;
};

const spinners = getGlobalSpinner(false);

const start = (id, text) => {
  spinners.add(id, { text: text });
};

const info = (id, text) => {
  spinners.update(id, { text: text });
};

const success = (id, text) => {
  spinners.succeed(id, { text: text });
};

const close = (id, text) => {
  spinners.fail(id, { text: text });
};

module.exports = { start, info, success, close };

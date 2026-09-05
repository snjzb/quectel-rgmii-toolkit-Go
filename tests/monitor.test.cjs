const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = { window: { addEventListener() {} }, document: { readyState: 'loading', addEventListener() {} } };
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, '../development/simpleadmin/www/js/monitor.js'), 'utf8'), context);
const { chartOptions } = context.window.SimpleAdminMonitor;
test('radio choices hide missing LTE and retain zero SINR', () => {
 const modes = context.window.SimpleAdminMonitor.availableRadioModes;
 assert.equal(JSON.stringify(modes({signal:[{rsrpNR:-80,sinrNR:14,rsrpLTE:null,sinrLTE:null}]})), '["NR"]');
 assert.equal(JSON.stringify(modes({signal:[{rsrpNR:null,sinrNR:null,rsrpLTE:null,sinrLTE:0}]})), '["LTE"]');
 assert.equal(JSON.stringify(modes({signal:[]})), '[]');
});
test('signal uses exactly two legends and independent units on opposite axes', () => {
  const data = { serverTime: 600000, signal: [{ time: 590000, rsrpNR: -95, sinrNR: 22, rsrpLTE: -89, sinrLTE: 18, temperature: 43 }, { time: 595000, rsrpNR: null, sinrNR: null, temperature: null }], ping: [{ time: 599000, rtt: null, jitter: null, status: 'timeout' }] };
  const options = chartOptions(data, 'NR', {}, true);
  assert.equal(JSON.stringify(options.signal.legend.data), '["RSRP","SINR"]');
  assert.equal(options.signal.yAxis[0].position, 'left');
  assert.equal(options.signal.yAxis[1].position, 'right');
  assert.equal(options.signal.series[1].yAxisIndex, 1);
  assert.equal(options.signal.series[0].data[0][1], -95);
  assert.equal(options.signal.series[0].data[1][1], null);
  assert.equal(options.signal.series[0].connectNulls, false);
  assert.equal(options.signal.xAxis.min, 300000);
  assert.equal(options.ping.series[2].data.length, 1);
  assert.equal(options.temperature.series[0].data[1][1], null);
  assert.equal(chartOptions(data, 'LTE', {}, false).signal.series[0].data[0][1], -89);
});

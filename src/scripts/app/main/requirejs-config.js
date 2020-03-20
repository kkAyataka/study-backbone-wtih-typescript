'use strict';

requirejs.config({
  baseUrl: 'scripts/libs',
  paths: {
      app: '../app',
      jquery: 'jquery-3.4.1',
      'backbone-inheritance': 'backbone',
      'backbone-composition': 'backbone',
      'backbone-bridge': 'backbone',
  },
});

window.onerror = function(msg, src, lineno, colno, err) {
  requirejs(['app/util/console-logger'], (cl) => {
    cl.fatal(msg, err);
  });
};

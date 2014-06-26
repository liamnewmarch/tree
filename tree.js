(function() {

  var canvas, config, context, initialStartPoint, min;


  // Set configurable parameters

  config = {
    numGenerations: 9,
    numChildBranches: 3,
    branchLength: 100,
    angle: 90,
    colours: {
      background: 'rgb(32, 32, 32)',
      branch: 'rgba(255, 255, 255, 0.5)'
    }
  };


  // A Point holds two numbers

  function Point(x, y) {
    if (typeof x === 'number') {
      this.x = x;
    } else {
      this.x = NaN;
    }

    if (typeof y === 'number') {
      this.y = y;
    } else {
      this.y = NaN;
    }
  }


  // A Branch draws between two Points
    
  function Branch(startPoint, parentAngle, generation) {
    
    var alpha, angle, endX, endY, i;

    this.startPoint = startPoint;

    // Set alpha

    alpha = (config.numGenerations - generation) / config.numGenerations;

    // Set stroke style with alpha

    context.strokeStyle = 'rgba(255, 255, 255, ' + alpha.toFixed(2) + ')';

    // We have a start points, create an end point

    angle = generation ? parentAngle + this.variation(config.angle) : 90;
    endX = startPoint.x - config.branchLength * Math.cos(angle / (180 / Math.PI));
    endY = startPoint.y - config.branchLength * Math.sin(angle / (180 / Math.PI));
    this.endPoint = new Point(endX, endY);

    // Trigger the draw function

    this.draw();

    // If within generation limit, spawn child branches

    if (generation++ < config.numGenerations) {
      i = 0;
      while (i++ < config.numChildBranches) {
        new Branch(this.endPoint, angle, generation);
      }
    }
  }

  Branch.prototype.draw = function() {

    // Draw between start points and end points

    context.beginPath();
    context.moveTo(this.startPoint.x, this.startPoint.y);
    context.lineTo(this.endPoint.x, this.endPoint.y);
    context.closePath();
    return context.stroke();
  };

  Branch.prototype.variation = function(amount) {

    // Simple variance function

    return Math.random() * amount - amount / 2;
  };


  // Redraw the tree after resize, but wait a second so we don't draw like crazy

  var resizeTimeout = false;

  window.addEventListener('resize', function() {

    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
      resizeTimeout = false;
    }

    resizeTimeout = setTimeout(function() {
      resizeTimeout = false;     
      init();
    }, 100);

  }, false);

  function init() {

    // Resize the canvas to fit

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Change branch sizes so the tree fits the canvas
    
    min = canvas.width < canvas.height ? canvas.width / 2 : canvas.height;
    config.branchLength = min / config.numGenerations;

    // Flood fill the canvas to reset it

    context.strokeStyle = config.colours.branch;
    context.fillStyle = config.colours.background;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Create a start point at middle bottom and start branching from there

    initialStartPoint = new Point(canvas.width / 2, canvas.height);

    new Branch(initialStartPoint, 90, 0);
  }


  // Set up the canvas and context

  canvas = document.querySelector('canvas');
  context = canvas.getContext('2d', { alpha: false });

  // And go

  init();

})();

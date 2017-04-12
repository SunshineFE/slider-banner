var defaultOptions = {}
var images = [{
  src: 'http://p3.music.126.net/ho641_8yoAw1rHOK5jHrYw==/18700493767083115.jpg'
},
{
  src: 'http://p3.music.126.net/xdfiKX7lJrPWhgfSJDaR7w==/18700493767083128.jpg'
},
{
  src: 'http://p4.music.126.net/PBHjjfQRXgopkZNTJD0lzA==/18700493767083113.jpg'
},
{
  src: 'http://p3.music.126.net/jagvBrsMvPfhe9mbDc9P6w==/18498183627560608.jpg'
},
{
  src: 'http://p3.music.126.net/jUC2_9plmxB0tvzQjEjCMw==/18773061534515678.jpg'
},
{
  src: 'http://p3.music.126.net/ZYo1o_bv-8e-bPdtlhPX-w==/18953381439659446.jpg'
}
]
function Slider(el, options) {
  this.options = options || {};
  this.container = document.querySelector(el);
  this.imageList = this.options.images || images;
  this.init();
  this.create();
  this.render();
  // this.circleSlider();
  this.renderImages();
  this.bindEvent();
}

Slider.prototype = {
  constructor: Slider,
  init: function () {
    this.clientX = 0;
    this.target = null;
    this.diff = 0;
    this.translateX = 0;
    this.index = 0;
    this.stop = false;
  },

  render: function () {
    this.container.appendChild(this.wrapper);
  },

  createWrapper: function () {
    this.wrapper = document.createElement('ul');
    this.wrapper.classList.add('xx-banner-wrapper');
  },

  create: function () {
    var that = this;

    this.createWrapper();
    this.imageList.forEach(function (image) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      var img = new Image();

      img.dataset.src = image.src;
      li.classList.add('xx-banner-item');
      a.appendChild(img);
      li.appendChild(a);
      that.wrapper.appendChild(li);
    })
  },

  circleSlider: function () {
    var children = this.wrapper.children;

    this.wrapper.insertBefore(children[children.length - 1].cloneNode(true), children[0]);
    this.wrapper.append(children[0].cloneNode(true));
  },

  renderImages: function () {
    if (!this.silders) {
      this.silders = this.wrapper.querySelectorAll('.xx-banner-item')
    }

    if (!this.images) {
      this.images = this.wrapper.querySelectorAll('img')
    }

    var renderIds = this.getRenderIndexs(),
      that = this,
      fixedContainer = this.fixedContainer.bind(this);

    this.images.forEach(function (image, index) {
      // if (renderIds.indexOf(index) > -1 && !image.src) {
      image.onload = fixedContainer;
      image.src = image.dataset.src;
      // }
    })
  },

  getRenderIndexs: function () {
    var len = this.images.length;

    if (this.index === 0) {
      return [len - 1, 0, 1]
    } else if (this.index === len - 1) {
      return [len - 2, len - 1, 0]
    }

    return [this.index - 1, this.index, this.index + 1]
  },

  fixedContainer: function (e) {
    var target = e.target || e.srcElement;

    if (!this.height || !this.width) {
      this.height = target.height;
      this.width = target.width;
    }

    if (this.container.style.height !== target.height + 'px') {
      this.container.style.height = target.height + 'px';
      this.container.style.width = target.width + 'px';
    }

    this.silders.forEach(function (silder) {
      if (silder.offsetWidth === 0) {
        silder.style.width = target.width + 'px';
      }
    })
  },

  handleImageLoaded: function (e) {

  },

  bindEvent: function () {
    var eventHandler = this.eventHandler.bind(this);

    this.wrapper.addEventListener('mousedown', eventHandler)
    this.wrapper.addEventListener('mousemove', eventHandler)
    this.wrapper.addEventListener('mouseup', eventHandler)
    this.wrapper.addEventListener('mouseout', eventHandler)
    this.wrapper.addEventListener('dragstart', this.handleDragStart.bind(this))
  },

  handleDragStart(e){
    this.preventDefault(e);
    this.stopPropagation(e);
  },

  getOffset: function (el) {
    return el.getBoundingClientRect();
  },

  preventDefault: function (e) {
    e.preventDefault();
    e.returnValue = false;
  },

  stopPropagation: function (e) {
    e.stopPropagation();
    e.cancelBubble = true;
  },

  mousemoveHandler: function (e) {
    var event = this.$event;
    var curClientX = event.clientX;

    this.diff = this.diff + (curClientX - this.clientX);

    if (this.target === null) {
      this.preventDefault(event);
      this.stopPropagation(event);
      return
    }
    if (Number.isNaN(this.diff)) {
      this.diff = 0;
    }
    this.handleDiff();
  },

  handleDiff: function () {
    var event = this.$event;

    if (!this.target) {
      this.preventDefault(event);
      this.stopPropagation(event);
      this.diff = 0;
      return
    }

    var target = this.target;
    var translateX = this.index * this.width * -1;

    this.clientX = event.clientX;
    translateX = translateX + this.diff;
    if (target) {
      var prev = this.getPrev();
      var next = this.getNext();

      var prevSibling = this.getIndexedEl(prev);
      var nextSibling = this.getIndexedEl(next);
      var diff = this.diff;

      target.style.transform = 'translate(' + translateX + 'px,0)'
      prevSibling.style.transform = 'translate(' + (-(prev + 1) * this.width + diff) + 'px,0)'
      nextSibling.style.transform = 'translate(' + (-(next-1) * this.width + diff) + 'px,0)'
    }
  },

  getPrev: function () {
    var prev = this.index - 1;

    if (prev < 0) {
      prev = this.images.length - 1;
    }

    return prev;
  },

  getNext() {
    var next = this.index + 1;

    if (next >= this.images.length) {
      next = 0;
    }

    return next;
  },

  getIndexedEl: function (index) {
    return this.target.parentNode.children.item(index)
  },

  go: function (distance) {
    var index = this.index;
    var nid = index + distance;
    var len = this.images.length;
    var speed = 5,target;

    nid = this.fixCurIndex(nid);

    var nextS = this.fixCurIndex(index + 1);
    var nextSibling = this.getIndexedEl(nextS);
    var nstart = -(nextS - 1) * this.width + this.diff;
    var nend;

    var prev = this.fixCurIndex(index - 1);
    var prevSibling = this.getIndexedEl(prev);
    var pstart = -(prev + 1) * this.width + this.diff;
    var pend;
    //下一张
    if(distance === 1){
        nend = -(this.fixCurIndex(nextS)) * this.width;
        
        this.transition(nextSibling,nstart,nend,5)

    }else if(distance === -1){//上一张
        pend = -(this.fixCurIndex(prev) ) * this.width;

        this.transition(prevSibling,pstart,pend,5)
    } else{
      nend = nstart - this.diff;
      pend = pstart - this.diff;

      this.transition(nextSibling,nstart,nend,5)
      this.transition(prevSibling,pstart,pend,5)
    }

      var cstart = this.index * -this.width + this.diff;
      var cend = -(this.index + distance) * this.width;
      this.transition(this.target,cstart,cend,5)
    // }

    
    // index +=distance;
    // index = this.fixCurIndex(index);
    // this.index = index;
    // var tx = -index * this.width;

    // this.silders.forEach(function (silder) {
    //   silder.style.transform = 'translate3d(' + tx + 'px,0px,0px)';
    // })
    this.index = nid;
    this.diff = 0;
    this.target = null;
  },

  fixCurIndex: function (index) {
    var len = this.images.length;

    index = index < 0 ? len - 1 : index;
    index = index >= this.images.length ? 0 : index;

    return index;
  },

  bindHandleTarget: function (e) {
    var target = e.target;
    var isRealTarget = function (t) {
      return t.classList && t.classList.contains('xx-banner-item')
    }
    var count = 20;

    while (!this.target && target.parentNode && --count) {
      target = target.parentNode;
      this.target = isRealTarget(target) ? target : null;
    }

    if (count <= 0) {
      throw new Error('some error' + target)
    }

    if (!this.target) {
      throw new Error('widthout target')
    }
  },

  eventHandler: function (e) {
    var target = e.target;

    if (e.type === 'mousedown') {
      this.bindHandleTarget(e);
    } else {
      this.preventDefault(e);
      this.stopPropagation(e);
    }

    if (!this.target) {
      return
    }

    this.$event = e;

    switch (e.type) {
      case 'mousedown':
        this.clientX = e.clientX;
        // this.index = [].indexOf.call(this.silders,this.target);
        break;
      case 'mousemove': this.mousemoveHandler(e); break;
      case 'mouseup': this.mouseupHandler(); break;
      case 'mouseout': this.handleMouseout(); break;
      default: console.warn('happen undefined type');
    }
  },

  handleMouseout:function(){
    var event = this.$event;

    this.stop = true;
    this.preventDefault(event);
    this.stopPropagation(event);

    this.mouseupHandler();
  },

  RAF: function (handler) {
    var raf = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (fn) {
        setTimeout(fn, 1000 / 60)
      };

    raf(handler);
  },

  transition: function (target,start, end, speed) {
    var distance = end - start,
      direction = distance > 0 ? 1 : -1;

    var middlePoint = start + distance / speed;
    var that = this;

    if (Math.abs(distance) < 1) {
      middlePoint = end;
      distance = 0;
    }

    this.RAF(function () {
      target.style.transform = 'translate3d(' + middlePoint + 'px,0px,0px)';
      if (distance != 0) {
        that.transition(target,middlePoint, end, speed);
      }
    });
  },

  mouseupHandler: function () {
    var threshold = 0.3;
    var rate = this.diff / this.width;

    if (rate >= threshold) {
      this.go(-1);
    } else if (rate <= -threshold) {
      this.go(1);
    } else {
      this.go(0);
    }

    this.target = null;
    
  }
}

window.Slider = Slider;
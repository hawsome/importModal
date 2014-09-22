'use strict';

(function ($) {
  var tmpl,
      $container = {},
      $modal,
      $closeBtn,
      selector,
      closeBtn = '.b-btn_close-modal',
      html,
      scrollbarWidth,
      documentWidth = document.body.clientWidth,
      responsiveWidth;

  var bindModal = function () {
    $(selector).on('click', function (e) {
      openModal();
      e.preventDefault();
    });
  }; // bindModal

  var openModal = function () {
    var containerEl = document.createElement('div'),
        backgroundEl = document.createElement('div'),
        centerEl = document.createElement('div'),
        modalEl = document.createElement('div'),
        closeBtnEl = document.createElement('a');

    // if the modal doesn't exist, create it
    if (!$container.length) {
      containerEl.style.cssText = 'display: none; position: fixed; top: 0; right: 0; left: 0; bottom: 0; z-index: 999999; overflow-x: hidden; overflow-y: auto;';
      containerEl.className = 'b-modal-container';
      backgroundEl.style.cssText = 'display: table; table-layout: fixed; width: 100%; height: 100%; background: rgba(0,0,0,0.5); cursor: pointer;';
      backgroundEl.className = 'b-modal-bg';
      centerEl.style.cssText = 'display: table-cell; text-align: left; vertical-align: middle;';
      modalEl.style.cssText = 'margin: 24px auto; cursor: auto; overflow: auto; box-shadow: 0 0 40px 0 #000;'
      modalEl.className = 'b-modal';
      closeBtnEl.href = '#';
      closeBtnEl.className = 'b-btn_close-modal';

      // check to see if the document width is less than the responsive width
      // if it is, initiate some responsive goodness
      if(documentWidth <= responsiveWidth) {
        modalEl.style.cssText = 'width: 100%; max-width: 100%; height: 100vh; max-height: 100vh; margin-left: 100%; cursor: auto; overflow: auto; box-shadow: 0 0 40px 0 #000;'
      }

      modalEl.appendChild(closeBtnEl);
      centerEl.appendChild(modalEl);
      backgroundEl.appendChild(centerEl);
      containerEl.appendChild(backgroundEl);

      $('body').prepend(containerEl);

      // assign the $container and $closeBtn
      $container = $('.b-modal-container');
      $modal = $('.b-modal');
      $closeBtn = $('.b-btn_close-modal');
    }

    // gut out the modal, then insert the close button and template
    $modal.empty();
    $modal.append($closeBtn);
    $modal.append(html);

    scrollLock('lock');

    // fire it up
    if(documentWidth <= responsiveWidth) {
      $container.show();
      $modal.animate({
        'margin-left': 0
      }, 350);
    } else {
      $container.hide().fadeIn();
    }

    // preventDefault and stopPropagation
    return false;
  }; // openModal

  var closeModal = function () {
    // if it's a mobile modal, slide out the modal instead of just fading out
    if(documentWidth <= responsiveWidth) {
      $modal.animate({
        'margin-left': '100%'
      }, 350, function () {
        $container.fadeOut(function () {
          scrollLock('unlock');
        });
      });
    } else {
      $container.fadeOut(function () {
        scrollLock('unlock');
      });
    }
  }; // closeModal

  var scrollLock = function (action) {
    if (action === 'lock') {
      // lock up the scrolling on the body if there's a vertical scrollbar
      if(scrollbarWidth()) {
        $('body').css({
          'overflow': 'hidden',
          'padding-right': scrollbarWidth() + 'px' // fix the scrollbar from pushing the content
        });
      } else {
        $('body').css({
          'overflow': 'hidden'
        })
      }
    } else if (action === 'unlock') {
      if(scrollbarWidth()) {
        // restore the scrollbar on callback
        $('body').css({
          'overflow': '',
          'padding-right': ''
        });
      } else {
        $('body').css({
          'overflow': ''
        });
      }
    } else {
      console.warn('You didn\'t choose a valid action for the scrollLock function, you can only \'lock\' or \'unlock\' the scroll.');
      return false;
    }
  }; // scrollLock

  var scrollbarWidth = function () {
    var outer = document.createElement('div'),
        widthNoScroll,
        inner,
        widthWithScroll;

    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps

    document.body.appendChild(outer);

    widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = 'scroll';

    // add innerdiv
    inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
  }; // hazScrollbar

  var bind = function() {
    // bind close modal
    $('body').on('click', '.b-modal-bg, ' + closeBtn, function (e) {
      closeModal();
      return false;
    });
    // prevent the clicks from bubbling up when clicking on the modal
    $('body').on('click', '.b-modal', function (e) {
      e.stopPropagation();
    });
    // bind the ESC button
    $(document).on('keyup', function (e) {
      if (e.keyCode === 27) {
        closeModal();
      }
    });
  }; // bind

  $.extend({
    modal: function (action) {
      (function init() {
        switch (action) {
          case 'open':
            openModal();
            break;
          case 'close':
            closeModal();
            break;
          default:
            console.error('You have chosen an invalid action, please pass only: \'open\', or \'close\'');
        }
        // maintain jQuery chainability
        return this;
      }()); // init
    } // modal
  }); // $.extend

  $.fn.extend({
    modal: function (action, options) {
      options = $.extend({
        selector: this.selector,
        closeBtn: null,
        html: '<p>Import some sexy HTML by doing: <pre style="font-size: 12px">$(\'selector\').modal(\'bind\', {<br>&nbsp;&nbsp;html: \'sexy HTML goes here\'<br>});</pre></p>'
        + 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo modi nostrum delectus nam ad fugit exercitationem maxime! Perspiciatis expedita dolore fugiat nulla deserunt tempore rem, assumenda, quia, commodi non esse!Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis esse, quis porro error ipsa architecto dicta sint dolore vitae. Impedit sunt, odit eveniet corporis repudiandae eos optio error odio nulla.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias est quibusdam, possimus doloribus sapiente! Maxime quo quia quisquam quibusdam laboriosam vel, magnam repellat aliquid reprehenderit alias, nisi molestias placeat earum?Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti autem nam optio, aliquam aliquid aperiam debitis similique distinctio, reiciendis, sed dolorum minima minus deleniti, deserunt repellendus quod! Eos, aliquid, ut.',
        responsiveWidth: '320'
      }, options || {}); // options

      selector = options.selector;
      closeBtn = options.closeBtn || closeBtn;
      html = options.html;
      responsiveWidth = options.responsiveWidth;

      (function init() {
        switch (action) {
          case 'bind':
            bindModal();
            break;
          case 'open':
            openModal();
            break;
          default:
            console.error('You have chosen an invalid action, please pass only: \'bind\', \'open\', or \'close\'');
        }
        bind();
        // maintain jQuery chainability
        return this;
      }()); // init
    } // modal
  }); // $.fn.extend
}(jQuery));
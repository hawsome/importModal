'use strict';

(function ($) {
  // require doT
  if (!doT) {
    console.error('You don\'t have doT installed, get it from here: http://olado.github.io/doT/ to use this modal');
    return false;
  }

  var tmpl,
      $container = {},
      $modal,
      $closeBtn,
      selector,
      closeBtn = '.b-btn_close-modal',
      html;

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
      backgroundEl.style.cssText = 'display: table; width: 100%; height: 100%; background: rgba(0,0,0,0.5); cursor: pointer;';
      backgroundEl.className = 'b-modal-bg';
      centerEl.style.cssText = 'display: table-cell; text-align: center; vertical-align: middle;';
      modalEl.style.cssText = 'position: relative; max-width: 100%; margin: 24px auto; cursor: auto; overflow: auto; background: $white; box-shadow: 0 0 40px 0 lighten(#000, 25%);'
      modalEl.className = 'b-modal';
      closeBtnEl.href = '#';
      closeBtnEl.className = 'b-btn_close-modal';

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

    // gut out the modal and then insert the close button and template
    $('.b-modal').empty();
    $('.b-modal').append($closeBtn);
    $('.b-modal').append(html);

    // lock up the scrolling on the body if there's a vertical scrollbar
    if(scrollVisible) {
      $('body').css({
        'overflow': 'hidden',
        'padding-right': '15px' // fix the scrollbar from pushing the content
      });
    } else {
      $('body').css({
        'overflow': 'hidden'
      })
    }

    // fire it up
    $container.hide().fadeIn();

    // preventDefault and stopPropagation
    return false;
  }; // openModal

  var closeModal = function () {
    $container = $('.b-modal-container');

    if(scrollVisible) {
      $container.fadeOut(function () {
        // restore the scrollbar on callback
        $('body').css({
          'overflow': '',
          'padding-right': ''
        });
      });
    } else {
      $('body').css({
        'overflow': ''
      })
    }
  }; // closeModal

  var scrollVisible = function () {
    return $(document).height() > $(window).height() && !Modernizr.touch;
  }; // scrollVisible

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
        html: '<p>everything is awesome</p>'
      }, options || {}); // options

      selector = options.selector;
      closeBtn = options.closeBtn || closeBtn;
      html = options.html;

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
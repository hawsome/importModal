(function ($) {
  'use strict';
  var $container = {},
      $alignMiddle,
      $modal,
      $closeBtn,
      selector,
      closeBtn = '.b-btn_close-modal',
      html,
      responsiveWidth,
      documentWidth = document.body.clientWidth,
      overflowContainer,
      afterOpenCallback,
      afterCloseCallback,
      isAnimating = false,
      mqlToDesktop,
      mqlToMobile;

  var openModal = function () {
    var containerEl = document.createElement('div'),
        backgroundEl = document.createElement('div'),
        centerEl = document.createElement('div'),
        modalEl = document.createElement('div'),
        closeBtnEl = document.createElement('a');

    // if the modal doesn't exist, create it
    if (!$container.length) {
      containerEl.style.cssText = 'display: none; position: fixed; top: 0; right: 0; left: 0; bottom: 0; z-index: 999999; overflow: auto;';
      containerEl.className = 'b-modal-container';
      backgroundEl.style.cssText = 'display: table; table-layout: fixed; width: 100%; height: 100%; background: rgba(0,0,0,0.5); cursor: pointer;';
      backgroundEl.className = 'b-modal-bg';
      centerEl.style.cssText = 'display: table-cell; vertical-align: middle;';
      centerEl.className = 'b-modal-align-middle';
      modalEl.style.cssText = 'cursor: auto;';
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
      $alignMiddle = $('.b-modal-align-middle');
      $modal = $('.b-modal');
      $closeBtn = $('.b-btn_close-modal');
    }

    // gut out the modal, then insert the close button and template
    $modal.empty();
    $modal.append($closeBtn);
    $modal.append(html);

    // TODO: add an ID to the modal and then do Element.scrollTop to make sure we always open at the top

    // only lock up the body/specified container if user doesn't specify not to with false
    if (overflowContainer) {
      scrollLock('lock');
    }

    // fire it up
    isAnimating = true;
    if (isMobileView()) {
      $container.hide().fadeIn(350, function () {
        isAnimating = false;
      });
      $alignMiddle.css({
        'position': 'absolute',
        'top': 0,
        'bottom': 0
      });
      $modal.css({
        'position': 'fixed',
        'top': 0,
        'bottom': 0,
        'overflow-y': 'scroll',
        'min-height': '100vh',
        'margin-left': '100%'
      }).animate({
        'margin-left': 0
      }, 350);
    } else {
      $container.hide().fadeIn(350, function () {
        isAnimating = false;
      });
      $modal.css({
        'width': 'auto',
        'min-height': ''
      });
    }

    if (afterOpenCallback !== null) {
      afterOpenCallback();
    }

    // preventDefault and stopPropagation
    return false;
  }; // openModal

  var closeModal = function () {
    isAnimating = true;
    // if it's a mobile modal, slide out the modal instead of just fading out
    if (isMobileView()) {
      $modal.animate({
        'margin-left': '100%'
      }, 350, function () {
        $container.fadeOut(400, function () {
          if (overflowContainer) {
            scrollLock('unlock');
          }
          isAnimating = false;
        });
      });
    } else {
      $container.fadeOut(400, function () {
        if (overflowContainer) {
          scrollLock('unlock');
        }
        isAnimating = false;
      });
    }

    if (afterCloseCallback !== null) {
      afterCloseCallback();
    }
  }; // closeModal

  var bindModal = function () {
    $(selector).on('click', function (e) {
      openModal();
      e.preventDefault();
    });
  }; // bindModal

  var isMobileView = function () {
    documentWidth = document.body.clientWidth;
    if (documentWidth <= responsiveWidth) {
      return true;
    }
    return false;
  }; // isMobileView

  var scrollLock = function (action) {
    var existingPaddingRight = parseInt($(overflowContainer).css('padding-right'));

    if (action === 'lock') {
      // lock up the scrolling on the body if there's a vertical scrollbar
      if (scrollbarWidth()) {
        $(overflowContainer).css({
          'overflow-y': 'hidden',
          'padding-right': existingPaddingRight + scrollbarWidth() + 'px' // fix the scrollbar from pushing the content
        });
      } else {
        $(overflowContainer).css({
          'overflow-y': 'hidden'
        });
      }
    } else if (action === 'unlock') {
      if (scrollbarWidth()) {
        // restore the scrollbar on callback
        $(overflowContainer).css({
          'overflow-y': '',
          'padding-right': ''
        });
      } else {
        $(overflowContainer).css({
          'overflow-y': ''
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

  var mobileToDesktop = function (e) {
    if (e.matches) {
      $modal.removeAttr('style').css({
        'position': '',
        'top': '',
        'bottom': ''
      });
      $alignMiddle.removeAttr('style').css({
        'display': 'table-cell',
        'vertical-align': 'middle'
      });
    }
  }; // mobileToDesktop

  var desktopToMobile = function (e) {
    if (e.matches) {
      $modal.removeAttr('style').css({
        'position': 'absolute',
        'top': 0,
        'bottom': 0
      });
      $alignMiddle.removeAttr('style');
    }
  }; // desktopToMobile

  var bind = function () {
    // bind close modal
    $('body').on('click', '.b-modal-bg, ' + closeBtn, function () {
      if (!isAnimating) {
        closeModal();
      }
      return false;
    });

    // prevent the clicks from bubbling up when clicking on the modal
    $('body').on('click', '.b-modal', function (e) {
      e.stopPropagation();
    });

    // bind the ESC button
    $(document).on('keyup', function (e) {
      if (e.keyCode === 27) {
        if (!isAnimating) {
          closeModal();
        }
      }
    });

    // from mobile to desktop
    mqlToDesktop.addListener(function (e) {
      mobileToDesktop(e);
    });

    // from desktop to mobile
    mqlToMobile.addListener(function (e) {
      desktopToMobile(e);
    });
  }; // bind

  $.fn.extend({
    modal: function (action, options) {
      options = $.extend({
        selector: this.selector,
        closeBtn: null,
        html: '<p>Import some sexy HTML by doing:</p> <pre style="font-size: 12px">$(\'selector\').modal(\'bind\', {<br>&nbsp;&nbsp;html: \'sexy HTML goes here\'<br>});</pre>',
        responsiveWidth: '768',
        overflowContainer: 'body',
        afterOpenCallback: null,
        afterCloseCallback: null,
      }, options || {}); // options

      selector = options.selector;
      closeBtn = options.closeBtn || closeBtn;
      html = options.html;
      responsiveWidth = options.responsiveWidth;
      overflowContainer = options.overflowContainer;
      afterOpenCallback = options.afterOpenCallback;
      afterCloseCallback = options.afterCloseCallback;

      mqlToDesktop = window.matchMedia('(min-width: ' + responsiveWidth + 'px)');
      mqlToMobile = window.matchMedia('(max-width: ' + responsiveWidth + 'px)');

      (function init() {
        switch (action) {
          case 'bind':
            bindModal();
            break;
          case 'open':
            openModal();
            break;
          case 'close':
            closeModal();
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
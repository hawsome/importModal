(function ($) {
  'use strict';
  var $container = null,
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
      mqlToMobile,
      currScrollPos,
      $bepWrapper = $('.b-bep-wrapper');

  var openModal = function () {
    var containerEl = document.createElement('div'),
        backgroundEl = document.createElement('div'),
        centerEl = document.createElement('div'),
        modalEl = document.createElement('div'),
        closeBtnEl = document.createElement('a');

    // if the modal doesn't exist, create it
    if (!$container) {
      containerEl.style.cssText = 'display: none; position: fixed; top: 0; right: 0; left: 0; bottom: 0; z-index: 999999; overflow-x: hidden; overflow-y: auto;';
      containerEl.className = 'b-modal-container';
      backgroundEl.style.cssText = 'display: table; position: absolute; top: 0; right: 0; bottom: 0; left: 0; table-layout: fixed; width: 100%; height: 100%; background: rgba(0,0,0,0.5); cursor: pointer;';
      backgroundEl.className = 'b-modal-bg';
      centerEl.style.cssText = 'display: table-cell; vertical-align: middle;';
      centerEl.className = 'b-modal-align-middle';
      modalEl.style.cssText = 'box-sizing: border-box; cursor: auto;';
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
    } else {
      $container.prependTo('body');
    }

    // gut out the modal, then insert the close button and template
    $modal.empty();
    $modal.append($closeBtn);
    $modal.append(html);

    // only lock up the body/specified container if user doesn't specify not to with false
    if (overflowContainer) {
      scrollLock('lock');
    }

    // fire it up
    isAnimating = true;
    if (isMobileView()) {
      $container.hide().fadeIn(350, function () {
        isAnimating = false;

        // hide the BEP and store the current scroll position
        setCurrScrollPos();
        $bepWrapper.hide();
      });
      $modal.css({
        'min-width': '100%',
        'min-height': '100vh',
        'margin-left': '100%'
      }).animate({
        'margin-left': 0
      }, 350);

      if (afterOpenCallback !== null) {
        afterOpenCallback();
      }
    } else {
      $container.hide().fadeIn(350, function () {
        isAnimating = false;
      });
      $modal.css({
        'width': 'auto',
        'min-height': ''
      });

      if (afterOpenCallback !== null) {
        afterOpenCallback();
      }
    }

    if (afterOpenCallback !== null) {
      afterOpenCallback();
    }

    // preventDefault and stopPropagation
    return false;
  }; // openModal

  var closeModal = function () {
    isAnimating = true;

    if (isMobileView()) { // if it's a mobile modal, slide out the modal instead of just fading out
      // restore the BEP and scroll position
      $bepWrapper.show();
      $(document).scrollTop(currScrollPos);

      $modal.animate({
        'margin-left': '100%'
      }, 350, function () {
        $container.fadeOut(400, function () {
          if (overflowContainer) {
            scrollLock('unlock');
          }
          if (afterCloseCallback !== null) {
            afterCloseCallback();
          }
          isAnimating = false;
          $(this).detach();
        });
      });
    } else { // if it's on desktop layout
      $container.fadeOut(400, function () {
        if (overflowContainer) {
          scrollLock('unlock');
        }
        if (afterCloseCallback !== null) {
          afterCloseCallback();
        }
        isAnimating = false;
        $(this).detach();
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

  var setCurrScrollPos = function () {
    currScrollPos = $(document).scrollTop();
  }; // setCurrScrollPos

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
          // 'position': 'fixed',
          'overflow': 'hidden',
          'padding-right': existingPaddingRight + scrollbarWidth() + 'px' // fix the scrollbar from pushing the content
        });
      } else {
        $(overflowContainer).css({
          'overflow': 'hidden'
        });
      }
    } else if (action === 'unlock') {
      if (scrollbarWidth()) {
        // restore the scrollbar on callback
        $(overflowContainer).css({
          'position': '',
          'overflow': '',
          'padding-right': ''
        });
      } else {
        $(overflowContainer).css({
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

  var mobileToDesktop = function () {
    $modal.removeAttr('style').css({
      'position': '',
      'top': '',
      'bottom': ''
    });
    $alignMiddle.removeAttr('style').css({
      'display': 'table-cell',
      'vertical-align': 'middle'
    });
  }; // mobileToDesktop

  var desktopToMobile = function () {
    $modal.removeAttr('style');
    $alignMiddle.removeAttr('style');
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

    // check responsive media query
    $(window).resize(function() {
      if (mqlToDesktop) {
        mobileToDesktop();
      } else if (mqlToMobile) {
        desktopToMobile();
      }
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

      console.log(Modernizr.mq);
      mqlToDesktop = Modernizr.mq('min-width: ' + responsiveWidth + 'px');
      mqlToMobile = Modernizr.mq('max-width: ' + responsiveWidth + 'px');

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
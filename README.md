importModal :dancers:
===========
Why? Because responsive, yo! :beginner:

##Version
1.2.3

##Tech
importModal requires jQuery to run

##Installation
Use Bower, son! Use the '--save' flag to add this baby to your dependencies.

```sh
bower install import-modal --save
```

##Usage
Standard binding:

```javascript
$('selector').modal('bind', { responsiveWidth: 320 });
```
Open modal:

```javascript
$.fn.modal('open');
```
Close modal:

```javascript
$.fn.modal('close');
```
Easy peasy!

##Default Options
```javascript
$.modal('open', {
  selector: this.selector, // the selector to bind
  closeBtn: '.b-btn_close-modal', // change this if you wanna use your own
  html: '<div>Awesome!</div>', // pass in a string of html right hurr
  responsiveWidth: '768', // this is the breakpoint for that responsive goodness
  overflowContainer: 'body' // this element's overscroll will be hidden when the modal is launched (prevents unnecessary scroll action on the background)
  afterOpenCallback: function () {
    // do cool shizzle after the modal opens
  },
  afterCloseCallback: function () {
    // do sweet shizzle after the modal is closed
  }
});
```

License
----

MIT
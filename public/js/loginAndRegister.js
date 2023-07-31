/*inspired by:-
https://dribbble.com/shots/3574886-Login-Screen-iOS
*/
var div1 = document.querySelector('form div.user-name'),
    div2 = document.querySelector('form div.password'),
    input1 = document.querySelector('input[type="text"]'),
    input2 = document.querySelector('input[type="password"]');
input1.addEventListener('focus', function () {
    'use strict';
    this.setAttribute('data-1', this.getAttribute('placeholder'));
    this.setAttribute('placeholder', '');
    div1.style.boxShadow = '0 1px 0 #40a9f8';
}, false);
input1.addEventListener('blur', function () {
    'use strict';
    this.setAttribute('placeholder', this.getAttribute('data-1'));
    div1.style.boxShadow = '0 1px 0 rgba(0,0,0,0.25)';
}, false);
input2.addEventListener('focus', function () {
    'use strict';
    this.setAttribute('data-1', this.getAttribute('placeholder'));
    this.setAttribute('placeholder', '');
    div2.style.boxShadow = '0 1px 0 #40a9f8';
}, false);
input2.addEventListener('blur', function () {
    'use strict';
    this.setAttribute('placeholder', this.getAttribute('data-1'));
    div2.style.boxShadow = '0 1px 0 rgba(0,0,0,0.25)';
}, false);

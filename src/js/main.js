/*jslint browser:true */
(function () {
    "use strict";

    // =============
    // = variables =
    // =============
    var hello = 'Hello',
        world = 'World',
        Helpers,
        setup;

    var console = (window.console = window.console || {});


    // ============================
    // = avoid console.log errors =
    // ============================

    if (typeof console === "undefined") {
        window.console = {
            log: function () {}
        };
    }

    // ==============================
    // = Useful functions & helpers =
    // ==============================

    Helpers = {

      scrollTop: function() {
        return $(document.body).animate({scrollTop: 0}, Math.min(250, $(document.body).scrollTop())).promise();
      },

      fade: function() {
        var $el = $('body > div.main');
        return Helpers.defer(function() {
          return $el[$el.is('.fade') ? 'removeClass' : 'addClass']('fade').delay(250).promise();
        });
      },

      defer: function(f) {
        var p = $.Deferred();
        setTimeout(function() {f().then(function(x) {p.resolve(x);});},0);
        return p;
      }
    };

    // ===================
    // = other functions =
    // ===================

    function helloWorld() {
        console.log(hello + ', ' + world + '!');
    }

    // ==================
    // = Pages setup    =
    // = Call Functions =
    // ==================

    setup = {
        // you need a main section with class .main and id as the page template
        // those pages specific codes will be triggered from this setup main function

        'index': function() {
            console.log('homepage exclusive functions here');
            helloWorld();
          //return $.when( $('#home #caroussel').catslider() )
        },

        init: function() {
            (this[$('body > div.main').attr('id')] || (function() {}))();
        }
    };

    // ===============================================================
    // = External pages (don't used HTML5 pushState for theses ones) =
    // ===============================================================

    var external = ['/blog', '/signin'];

    // =================
    // = Initial setup =
    // =================
    setup.init();


    // ===================================================
    // = Pretty page transitions if the browser supports
    // = HTML5 pushState
    // ===================================================

    if(Modernizr.history) {
      var load = function(href) {
        return Helpers.scrollTop()
          .then(function() {
            $('header nav a').removeClass('active');
            return Helpers.fade();
          })
          .then(function() {
            return $.get(href);
          })
          .then(function(html) {
            var $body = $($.parseHTML(html.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0])),
                $fragment = $body.filter('div.main');

            return {
                $el: $fragment, page: $fragment.attr('id'), active: $('nav a.active', $body.filter('header')).attr('href')
            };
          })
          .then(function(loaded) {
            return $('body > div.main').attr('data-to', loaded.page).delay(250).promise().then(
              function() {
                $('body > div.main').attr('id', loaded.page).html(loaded.$el.html()).removeAttr('data-to');
                $('header nav a[href="' + loaded.active + '"]').addClass('active');
                return loaded;
              }
            );
          })
          .then(function(loaded) {
            (setup[loaded.page] || (function() {}))();
            Helpers.fade();
            return loaded.page;
          });
      };

      var url = document.location.toString();

      // Intercept clicks on links
      $(document.body).on('click', '[href]', function(e) {

        var href = $(this).attr('href');

        if(!/https?:\/\//.test(href) || href.replace(/https?:\/\//, '').indexOf(document.location.host) !== 0) {

          history.pushState(null, null, href);

          for(var i=0; i<external.length; i++) {
            if(document.location.pathname.indexOf(external[i]) === 0) {
              history.pushState(null, null, url);
              return;
            }
          }

          url = document.location.toString();

          e.preventDefault();
          load(href);
        }

      });

      // ==========================
      // = Intercept form submits =
      // ==========================

      $(document.body).on('submit', 'form[method=GET]', function(e) {
        e.preventDefault();
        var action = $(this).attr('action'),
            data   = $(this).serialize(),
            href   = action + (action.indexOf('?') > -1 ? '&' : '?') + data;

        history.pushState(null, null, href);
        url = document.location.toString();

        load(href);
      });

      // Intercept back/forward
      $(window).on('popstate', function() {
        if(document.location.toString() !== url) {
          load(document.location.href);
        }
        url = document.location.toString();
      });
    }

}());
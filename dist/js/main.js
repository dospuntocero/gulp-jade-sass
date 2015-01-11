!function(){"use strict";function t(){r.log(o+", "+i+"!")}var n,e,o="Hello",i="World",r=window.console=window.console||{};"undefined"==typeof r&&(window.console={log:function(){}}),n={scrollTop:function(){return $(document.body).animate({scrollTop:0},Math.min(250,$(document.body).scrollTop())).promise()},fade:function(){var t=$("body > div.main");return n.defer(function(){return t[t.is(".fade")?"removeClass":"addClass"]("fade").delay(250).promise()})},defer:function(t){var n=$.Deferred();return setTimeout(function(){t().then(function(t){n.resolve(t)})},0),n}},e={index:function(){r.log("homepage exclusive functions here"),t()},init:function(){(this[$("body > div.main").attr("id")]||function(){})()}};var a=["/blog","/signin"];if(e.init(),Modernizr.history){var u=function(t){return n.scrollTop().then(function(){return $("header nav a").removeClass("active"),n.fade()}).then(function(){return $.get(t)}).then(function(t){var n=$($.parseHTML(t.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0])),e=n.filter("div.main");return{$el:e,page:e.attr("id"),active:$("nav a.active",n.filter("header")).attr("href")}}).then(function(t){return $("body > div.main").attr("data-to",t.page).delay(250).promise().then(function(){return $("body > div.main").attr("id",t.page).html(t.$el.html()).removeAttr("data-to"),$('header nav a[href="'+t.active+'"]').addClass("active"),t})}).then(function(t){return(e[t.page]||function(){})(),n.fade(),t.page})},c=document.location.toString();$(document.body).on("click","[href]",function(t){var n=$(this).attr("href");if(!/https?:\/\//.test(n)||0!==n.replace(/https?:\/\//,"").indexOf(document.location.host)){history.pushState(null,null,n);for(var e=0;e<a.length;e++)if(0===document.location.pathname.indexOf(a[e]))return history.pushState(null,null,c),void 0;c=document.location.toString(),t.preventDefault(),u(n)}}),$(document.body).on("submit","form[method=GET]",function(t){t.preventDefault();var n=$(this).attr("action"),e=$(this).serialize(),o=n+(n.indexOf("?")>-1?"&":"?")+e;history.pushState(null,null,o),c=document.location.toString(),u(o)}),$(window).on("popstate",function(){document.location.toString()!==c&&u(document.location.href),c=document.location.toString()})}}();=====
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
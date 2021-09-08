(function ($) {
  "use strict";
  Drupal.behaviors.vtf = {
    attach: function (context, settings) {
      if (settings["vtf"]) {
        for (var view in settings["vtf"]) {
          var form = $("input.vtf[value=\"" + view + "\"]").eq(0).closest("form").not(".vtf-form-processed");
          if (form.length > 0) {
            $(form).addClass("vtf-form-processed");
            $(form).find(".vtf-filter-widget").each(function (index, item) {
              $(item).addClass("visually-hidden");
            });
            var vtf = settings["vtf"][view];
            var view_el = $(".view.view-id-" + vtf.view_id + ".view-display-id-" + vtf.display_id);
            view_el.find("table.views-table").wrap("<div class=\"vtf-table-wrapper\"></div>");
            $(".vtf-filter-header", view_el).one("vtf-filter-header").each(function () {
              var filter = $(this).attr("filtername");
              var widget = $(".vtf-filter-widget[id^=\"filter-" + filter + "\"]", form);
              if (widget.length === 0) {
                widget = $("#filter-" + filter).eq(0).closest(".form-wrapper");
              }
              if (widget.length === 0) {
                widget = $("#filter-" + filter);
              }
              widget.css("position", "absolute");
              drupalSettings.vtf[view].widgets[filter] = widget;
              $("<span/>", {class: "vtf-button", html: vtf.text}).appendTo($(this));

              $(".vtf-button", this).click(function (e) {
                $(".vtf-button").not(this).removeClass("vtf-button-active");
                if ($(this).hasClass("vtf-button-active")) {
                  $(this).removeClass("vtf-button-active");
                } else {
                  $(this).addClass("vtf-button-active");
                }
                var widgets = drupalSettings.vtf[view].widgets;
                for (var name in widgets) {
                  if (name !== filter) {
                    widgets[name].addClass("visually-hidden");
                  } else {
                    if (widgets[filter].hasClass("visually-hidden")) {
                      var width = $(document).width(), mouseX = e.pageX, options = {
                        of: $(this),
                        collision: "fit",
                        my: "left top",
                        at: "right bottom",
                      };

                      if (mouseX > (width / 2)) {
                        options.my = "right top";
                        options.at = "left bottom";
                      }
                      widgets[filter].pageX = mouseX;

                      widgets[filter].removeClass("visually-hidden").position(options);
                    } else {
                      widgets[filter].addClass("visually-hidden");
                    }
                  }
                }
              });
            });
            $(".vtf-table-wrapper").on("scroll", function (e) {
              $(this).find(".vtf-button.vtf-button-active").each(function () {
                var filter = $(this).closest(".vtf-filter-header").attr("filtername");
                var options = {
                  of: $(this),
                  collision: "fit",
                  my: "left top",
                  at: "right bottom"
                };
                var mouseX = settings.vtf[view].widgets[filter].pageX;
                if (mouseX > ($(document).width() / 2)) {
                  options.my = "right top";
                  options.at = "left bottom";
                }
                var offset = this.offset();
                offset.top += this.outerHeight();
                offset.left += this.outerWidth() / 2 - $menu.outerWidth() / 2;
                $(this).css(offset);

                settings.vtf[view].widgets[filter].position(options);
              });
            });
          }
        }
      }
    }
    };

})(jQuery);

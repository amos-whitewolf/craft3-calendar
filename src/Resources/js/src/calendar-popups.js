"use strict";function _defineProperty(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function showEventCreator(e,t){eventCreatorShown||(eventCreatorShown=!0,$("<div />").qtip({content:{text:$("#event-creator"),title:Craft.t("calendar","New Event")},position:{my:"center",at:"center",target:$(window)},show:{ready:!0,modal:{on:!0,blur:!1}},hide:!1,style:{classes:"qtip-bootstrap dialogue",width:500},events:{render:function(a,r){var n=r.elements.content;$("ul.errors",n).empty();var l=e.utc().format("HHmmss"),i=t.utc().format("HHmmss"),d=!1;l===i&&"000000"===i&&(t.subtract(1,"seconds"),d=!0);var s=createDateAsUTC(e.toDate()),o=createDateAsUTC(t.toDate()),c=$("#event-creator"),p=$('input[name="startDate[date]"]',c),u=$('input[name="startDate[time]"]',c),m=$('input[name="endDate[date]"]',c),f=$('input[name="endDate[time]"]',c);c.addClass("shown"),p.datepicker("setDate",s),m.datepicker("setDate",o),u.timepicker("setTime",s),f.timepicker("setTime",o);var v=$("input[name=allDay]"),h=v.parents(".lightswitch:first");$("input",h).val(d?1:""),d?(h.data("lightswitch").turnOn(),$(".timewrapper",c).hide()):(h.data("lightswitch").turnOff(),$(".timewrapper",c).show()),setTimeout(function(){$("input[name=title]:first",n).val("").focus().bind("keypress",function(e){var t=e.which?e.which:e.keyCode;13===t&&$("button.submit",n).trigger("click")})},100);var C=u.timepicker("option","timeFormat"),b=C.replace("h","hh").replace("H","HH").replace("G","H").replace("g","h").replace("A","a").replace("i","mm");$("button.submit",n).unbind("click").click(function(e){var t=$(this),a=$("input[name=title]",n).val(),l=$("select[name=calendarId]",n).val(),i=moment(p.datepicker("getDate")),d=moment(u.val().replace(/(a|p)\.(m)\./gi,"$1$2"),b),s=moment(m.datepicker("getDate")),o=moment(f.val().replace(/(a|p)\.(m)\./gi,"$1$2"),b);t.prop("disabled",!0).addClass("disabled"),t.text(Craft.t("app","Saving...")),$.ajax({url:Craft.getCpUrl("calendar/events/api/create"),type:"post",dataType:"json",data:_defineProperty({startDate:i.format("YYYY-MM-DD")+" "+d.format("HH:mm:ss"),endDate:s.format("YYYY-MM-DD")+" "+o.format("HH:mm:ss"),allDay:v.val(),event:{title:a,calendarId:l}},Craft.csrfTokenName,Craft.csrfTokenValue),success:function(a){if(a.error)$("ul.errors",n).empty().append($("<li />",{text:a.error}));else if(a.event){var l=a.event;l.allDay&&(l.end=moment(l.end).add(2,"s").utc().format()),$calendar.fullCalendar("renderEvent",l),$calendar.fullCalendar("unselect"),r.hide(e)}t.prop("disabled",!1).removeClass("disabled"),t.text(Craft.t("app","Save"))},error:function(e){Craft.cp.displayNotification("error",JSON.parse(message)),t.prop("disabled",!1).removeClass("disabled"),t.text(Craft.t("app","Saving..."))}})}),$("button.delete",n).unbind("click").click(function(e){r.hide()})},hide:function(e,t){$("#event-creator").removeClass("shown").insertAfter($calendar),$calendar.fullCalendar("unselect"),eventCreatorShown=!1,t.destroy()}}}))}function buildEventPopup(e,t){if(e.calendar){var a=$("<div>",{"class":"buttons"}),r=$("<div>"),n=$("<div>",{"class":"calendar-data",html:'<span class="color-indicator" style="background-color: '+e.backgroundColor+';"></span> '+e.calendar.name}),l=moment(e.start),i=moment(e.end),d="dddd, MMMM D, YYYY";if(e.allDay)i.subtract(1,"days");else{var s="H:i"===calendarTimeFormat?"HH:mm":"h:mma";d=d+" [at] "+s}var o=$("<div>",{"class":"event-date-range separator",html:'<div style="white-space: nowrap;"><label>'+Craft.t("calendar","Starts")+":</label> "+l.format(d)+'</div><div style="white-space: nowrap;"><label>'+Craft.t("calendar","Ends")+":</label> "+i.format(d)+"</div>"}),c="";e.repeats&&(c=$("<div>",{"class":"event-repeats separator",html:"<label>"+Craft.t("calendar","Repeats")+":</label> "+e.readableRepeatRule})),e.editable&&(a.append($("<a>",{"class":"btn small submit",href:Craft.getCpUrl("calendar/events/"+e.id+(isMultiSite?"/"+e.site.handle:"")),text:Craft.t("calendar","Edit")})),a.append($("<a>",{"class":"btn small delete-event",href:Craft.getCpUrl("calendar/events/api/delete"),text:Craft.t("calendar","Delete"),data:{id:e.id}})),e.repeats&&a.append($("<a>",{"class":"btn small delete-event-occurrence",href:Craft.getCpUrl("calendar/events/api/delete-occurrence"),text:Craft.t("calendar","Delete occurrence"),data:{id:e.id,date:e.start.toISOString()}}))),t.qtip({content:{title:e.title,button:!0,text:r.add(n).add(o).add(c).add(a)},style:{classes:"qtip-bootstrap qtip-event",tip:{width:30,height:15}},position:{my:"right center",at:"left center",adjust:{method:"shift flip"}},show:{solo:!0,delay:500},hide:{fixed:!0,delay:300},events:{show:function(e,t){qTipsEnabled||e.preventDefault()},render:function(t,a){$("a.delete-event-occurrence",a.elements.content).click(function(e){var t=$(this).attr("href"),r=$(this).data("id"),n=$(this).data("date");return confirm(Craft.t("calendar","Are you sure?"))&&$.ajax({url:t,type:"post",dataType:"json",data:_defineProperty({eventId:r,date:n},Craft.csrfTokenName,Craft.csrfTokenValue),success:function(e){return e.error?void console.warn(e.error):($calendar.fullCalendar("refetchEvents"),void a.destroy())}}),!1}),$("a.delete-event",a.elements.content).click(function(t){var r=$(this).attr("href"),n=$(this).data("id");return confirm(Craft.t("calendar","Are you sure you want to delete this event?"))&&$.ajax({url:r,type:"post",dataType:"json",data:_defineProperty({eventId:n},Craft.csrfTokenName,Craft.csrfTokenValue),success:function(t){return t.error?void console.warn(t.error):($calendar.fullCalendar("removeEvents",e.id),void a.destroy())}}),!1})}}})}}var eventCreatorShown=!1,_$calendar$data=$calendar.data(),isMultiSite=_$calendar$data.isMultiSite,calendarTimeFormat=_$calendar$data.timeFormat,createDateAsUTC=function(e){return new Date(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate(),e.getUTCHours(),e.getUTCMinutes(),e.getUTCSeconds())};
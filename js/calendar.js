let Calendar = (model, options, date) => {
    this.Options = {
        NavShow: true,
        DateTimeShow: true,
        DatetimePicker: false,
    };

    if (options) {
        Object.keys(options).forEach((key) => {
            this.Options[key] = typeof options[key] === 'string' ? options[key].toLowerCase() : options[key];
        });
    }

    this.Model = JSON.parse(localStorage.getItem('Events')) || [];

    if (model) {
        this.Model = [...this.Model, ...model];
    }

    this.Model.forEach((element) => {
        if (typeof element.Date === 'string') {
            element.Date = new Date(element.Date);
        }
    });

    this.Today = new Date();

    this.Selected = this.Today;
    this.Today.Month = this.Today.getMonth();
    this.Today.Year = this.Today.getFullYear();

    if (date) {
        this.Selected = date;
    }

    this.Selected.Month = this.Selected.getMonth();
    this.Selected.Year = this.Selected.getFullYear();

    this.Selected.Days = new Date(this.Selected.Year, (this.Selected.Month + 1), 0).getDate();
    this.Selected.FirstDay = new Date(this.Selected.Year, (this.Selected.Month), 1).getDay();
    this.Selected.LastDay = new Date(this.Selected.Year, (this.Selected.Month + 1), 0).getDay();

    this.Prev = new Date(this.Selected.Year, (this.Selected.Month - 1), 1);

    if (this.Selected.Month === 0) {
        this.Prev = new Date(this.Selected.Year - 1, 11, 1);
    }

    this.Prev.Days = new Date(this.Prev.getFullYear(), (this.Prev.getMonth() + 1), 0).getDate();

    return this
};

let CreateCalendar = (calendar, element, adjuster) => {

    if (typeof adjuster !== 'undefined') {
        let newDate = new Date(calendar.Selected.Year, calendar.Selected.Month + adjuster, 1);
        calendar = Calendar(calendar.Model, calendar.Options, newDate);
        element.html('');
    } else {
        Object.keys(calendar.Options).forEach((key) => {
            typeof calendar.Options[key] !== 'function' &&
            typeof calendar.Options[key] !== 'object' &&
            calendar.Options[key] ? element.className += " " + key + "-" + calendar.Options[key] : 0;
        })
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


    if (calendar.Options.DatetimePicker) {
        let mainSection = '<div id="d-picker" class="calendar-main hidden datepicker"></div>';
        element.appendAfter(mainSection);
    } else {
        let mainSection = '<div class="calendar-main"></div>';
        element.append(mainSection);
    }

    let AddDateTime = () => {
        let datetime = '<div class="calendar-datetime"></div>';
        $('.calendar-main').append(datetime);


        if (calendar.Options.NavShow) {
            let calendarBack = '<div class="calendar-back calendar-navigation"><svg height="15" width="15" viewBox="0 0 75 100" fill="rgba(0, 0, 0, 0.5)"><polyline points="0, 50 75, 0 75, 100"></polyline></svg></div>'
            $('.calendar-datetime').append(calendarBack);
            $('.calendar-back').each((el) => {
                el.addEventListener('click', () => {
                    if (calendar.Options.DatetimePicker) {
                        $('#datepicker').next().remove();
                        CreateCalendar(calendar, element, -1);
                        $('#datepicker').next().removeClass('hidden');
                    } else {
                        CreateCalendar(calendar, element, -1)
                    }
                });
            });
        }

        // let today = document.createElement('div');
        // today.className += ' today';
        let today = '<div class="today"></div>';
        let month = '<div class="today-month" data-month="' + calendar.Selected.Month + '">' + calendar.Selected.Year + '</div>';
        let year = '<div class="today-year" data-year="' + calendar.Selected.Year + '">' + months[calendar.Selected.Month] + '</div>';
        $('.calendar-datetime').append(today);
        $('.today').append(month);
        $('.today').append(year);

        if (calendar.Options.NavShow) {
            let calendarForward = '<div class="calendar-forward calendar-navigation"><svg height="15" width="15" viewBox="0 0 75 100" fill="rgba(0, 0, 0, 0.5)"><polyline points="0, 0 75, 50 0, 100"></polyline></svg></div>';

            $('.calendar-datetime').append(calendarForward);
            $('.calendar-forward').each((el) => {
                el.addEventListener('click', () => {
                    if (calendar.Options.DatetimePicker) {
                        $('#datepicker').next().remove();
                        CreateCalendar(calendar, element, 1)
                        $('#datepicker').next().removeClass('hidden');
                    } else {
                        CreateCalendar(calendar, element, 1)
                    }
                });
            });
        }
    };

    let AddLabels = () => {
        let labels = '<ul class="calendar-labels"></ul>';
        $('.calendar-main').append(labels);
        const labelsList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        labelsList.forEach((label) => {
            let labelWrap = '<li class="calendar-label">' + label + '</li>';
            $('.calendar-labels').append(labelWrap);
        });
    };

    let AddDays = () => {
        let DayDigit = (digit, month, year, event = null, eventTitle = null) => {
            if (event !== null && eventTitle !== null) {
                return '<p class="calendar-digit event-day" id="' + digit + month + year + '" data-date="' + digit + '" data-month="' + month + '" data-year="' + year + '">' + digit + '<span class="calendar-event-title">' + eventTitle + '</span></p>';
            }

            return '<p class="calendar-digit" id="' + digit + month + year + '" data-date="' + digit + '" data-month="' + month + '" data-year="' + year + '">' + digit + '</p>';
        };

        let AttachDayEvent = (days) => {
            return days.each((day) => {
                day.addEventListener('click', () => {
                    let eventData = prompt('Enter event: ');
                    if (eventData) {
                        let year = day.getAttribute('data-year');
                        let month = day.getAttribute('data-month');
                        let date = day.getAttribute('data-date');

                        let eventDate = new Date(Date.UTC(year, month, date));

                        let event = {
                            Date: eventDate,
                            Title: eventData
                        };

                        if (event) {
                            day.className += ' event-day';
                            let eventTitle = document.createElement('span');
                            eventTitle.className += 'calendar-event-title';
                            eventTitle.innerHTML = event.Title;
                            day.appendChild(eventTitle);
                            this.Model.push(event);
                            localStorage.setItem('Events', JSON.stringify(this.Model));
                        }
                    }
                })
            })
        };

        let days = '<ul class="calendar-days"></ul>';
        $('.calendar-main').append(days);

        for (let i = 0; i < (calendar.Selected.FirstDay); i++) {
            let digit = DayDigit((calendar.Prev.Days - calendar.Selected.FirstDay) + (i + 1), calendar.Selected.Month - 1, calendar.Selected.Year);
            let day = '<li class="calendar-day previous-month">' + digit + '</li>';
            $('.calendar-days').append(day);
        }

        for (let i = 0; i < calendar.Selected.Days; i++) {
            let event = null;
            let eventTitle = null;
            for (let z = 0; z < calendar.Model.length; z++) {
                let eventDate = calendar.Model[z].Date;
                let toDate = new Date(Date.UTC(calendar.Selected.Year, calendar.Selected.Month, (i + 1)));

                if (eventDate.getTime() === toDate.getTime()) {
                    event = true;
                    eventTitle = calendar.Model[z].Title;
                }

            }
            let digit = DayDigit(i + 1, calendar.Selected.Month, calendar.Selected.Year, event, eventTitle);
            let day = '';
            if ((i + 1) === calendar.Today.getDate() &&
                calendar.Selected.Month === calendar.Today.Month &&
                calendar.Selected.Year === calendar.Today.Year) {
                day = '<li class="calendar-day current-month today">' + digit + '</li>';
            } else {
                day = '<li class="calendar-day current-month">' + digit + '</li>';
            }
            $('.calendar-days').append(day);
        }

        if (!calendar.Options.DatetimePicker) {
            AttachDayEvent($('.calendar-days .calendar-day.current-month p'));
        }

        let extraDaysInCalendar = 13;

        if ($('.calendar-days').length > 35) {
            extraDaysInCalendar = 6;
        } else if ($('.calendar-days').length < 29) {
            extraDaysInCalendar = 20;
        }

        for (let i = 0; i < (extraDaysInCalendar - calendar.Selected.LastDay); i++) {
            let digit = DayDigit(i + 1, calendar.Selected.Month + 1, calendar.Selected.Year);
            let day = '<li class="calendar-day next-month">' + digit + '</li>';
            $('.calendar-days').append(day);
        }
    };
    // let AddMonths = () => {
    //     let monthsWrap = document.createElement('ul');
    //     monthsWrap.className += 'months-list';
    //     months.forEach((month, index) => {
    //         let singleMonth = document.createElement('li');
    //         singleMonth.className += 'single-month';
    //         singleMonth.innerHTML = month;
    //         singleMonth.setAttribute('data-month', index);
    //         monthsWrap.appendChild(singleMonth);
    //     });
    //
    //     mainSection.appendChild(monthsWrap);
    // };

    if (calendar.Options.DateTimeShow) {
        AddDateTime();
    }

    AddLabels();
    AddDays();
};

let Initialize = (element, data, options) => {
    let calendarObject = Calendar(data, options);
    CreateCalendar(calendarObject, element);
};


// document.addEventListener("DOMContentLoaded", function() {
//     $('#datepicker').each((inputField) => {
//         inputField.addEventListener('click', () => {
//             $('#datepicker').next().removeClass('hidden');
//         })
//     });
//
//     // $('#datepicker').each((inputField) => {
//     //     inputField.addEventListener('blur', () => {
//     //         $('#datepicker').next().addClass('hidden');
//     //     });
//     // });
//
// });

// $('.datepicker').each((picker) => {
//     picker.addEventListener('change', (element) => {
//         $('.datepicker .calendar-day.current-month').each((picker) => {
//             console.log(picker);
//         })
//     })
// });

document.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'datepicker') {
            $(`#${e.target.id}`).next().removeClass('hidden');
        }
        if (e.target && e.target.className === 'calendar-digit' && e.target.parentNode.className === 'calendar-day current-month') {
            console.log(e.target.className);
            let date = e.target.getAttribute('data-date');
            let month = (parseInt(e.target.getAttribute('data-month')) + 1);
            let year = e.target.getAttribute('data-year');

            if (date.length === 1) {
                date = 0 + date;
            }

            month = month.toString();
            if (month.length === 1) {
                month = 0 + month;
            }

            $('#datepicker').elems[0].value = date + '-' + month + '-' + year;
            $('.datepicker').addClass('hidden');
        }
    }
);
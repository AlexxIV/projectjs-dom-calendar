let Calendar = (model, options, date) => {
    this.Options = {
        NavShow: true,
        DateTimeShow: true,
        DatetimePicker: false,
    };

    Object.keys(options).forEach((key) => {
        this.Options[key] = typeof options[key] === 'string' ? options[key].toLowerCase() : options[key];
    });

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
        element.innerHTML = '';
    } else {
        Object.keys(calendar.Options).forEach((key) => {
            typeof calendar.Options[key] !== 'function' &&
            typeof calendar.Options[key] !== 'object' &&
            calendar.Options[key] ? element.className += " " + key + "-" + calendar.Options[key] : 0;
        })
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let mainSection = document.createElement('div');
    mainSection.className += 'calendar-main';

    let AddDateTime = () => {
        let datetime = document.createElement('div');
        datetime.className += 'calendar-datetime';

        if (calendar.Options.NavShow) {
            let calendarBack = document.createElement('div');
            calendarBack.className += ' calendar-back calendar-navigation';
            calendarBack.addEventListener('click', () => {
                CreateCalendar(calendar, element, -1)
            });

            calendarBack.innerHTML = '<svg height="15" width="15" viewBox="0 0 75 100" fill="rgba(0, 0, 0, 0.5)"><polyline points="0, 50 75, 0 75, 100"></polyline></svg>';
            datetime.appendChild(calendarBack);
        }

        let today = document.createElement('div');
        today.className += ' today';
        today.innerHTML = months[calendar.Selected.Month] + ', ' + calendar.Selected.Year;
        datetime.appendChild(today);

        if (calendar.Options.NavShow && !calendar.Options.NavVerttical) {
            let calendarForward = document.createElement('div');
            calendarForward.className += 'calendar-forward calendar-navigation';
            calendarForward.addEventListener('click', () => {
                CreateCalendar(calendar, element, 1)
            });

            calendarForward.innerHTML = '<svg height="15" width="15" viewBox="0 0 75 100" fill="rgba(0, 0, 0, 0.5)"><polyline points="0, 0 75, 50 0, 100"></polyline></svg>'
            datetime.appendChild(calendarForward);
        }

        if (calendar.Options.DatetimeLocation) {
            document.getElementById(calendar.Options.DatetimeLocation).innerHTML = '';
            document.getElementById(calendar.Options.DatetimeLocation).appendChild(datetime);
        } else {
            mainSection.appendChild(datetime);
        }
    };

    let AddLabels = () => {
        let labels = document.createElement('ul');
        labels.className = 'calendar-labels';
        const labelsList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        labelsList.forEach((label) => {
            let labelWrap = document.createElement('li');
            labelWrap.className += 'calendar-label';
            labelWrap.innerHTML = label;
            labels.appendChild(labelWrap);
        });

        mainSection.appendChild(labels);
    };

    let AddDays = () => {
        let DayDigit = (digit) => {
            let digitWrap = document.createElement('p');
            digitWrap.className += 'calendar-digit';
            digitWrap.innerHTML += digit;
            return digitWrap;
        };

        let DayEvent = (day) => {
            return day.addEventListener('click', () => {
                let event = prompt('Enter event: ');

                if (event) {
                    day.className += ' event-day';
                    let eventTitle = document.createElement('span');
                    eventTitle.className += 'calendar-event-title';
                    eventTitle.innerHTML = event;
                    day.appendChild(eventTitle);
                }
            })
        };

        let days = document.createElement('ul');
        days.className += 'calendar-days';

        for (let i = 0; i < (calendar.Selected.FirstDay); i++) {
            let day = document.createElement('li');
            day.className += 'calendar-day previous-month';

            let digit = DayDigit((calendar.Prev.Days - calendar.Selected.FirstDay) + (i + 1));
            DayEvent(digit);
            day.appendChild(digit);
            days.appendChild(day);
        }

        for (let i = 0; i < calendar.Selected.Days; i++) {
            let day = document.createElement('li');
            day.className += 'calendar-day current-month';

            let digit = DayDigit(i + 1);

            for (let z = 0; z < calendar.Model.length; z++) {
                let eventDate = calendar.Model[z].Date;
                let toDate = new Date(calendar.Selected.Year, calendar.Selected.Month, (i + 1));

                if (eventDate.getTime() === toDate.getTime()) {
                    digit.className += ' event-day';

                    let eventTitle = document.createElement('span');
                    eventTitle.className += 'calendar-event-title';
                    eventTitle.innerHTML = calendar.Model[z].Title;
                    digit.appendChild(eventTitle);
                }

            }

            day.appendChild(digit);

            if ((i + 1) === calendar.Today.getDate() &&
                calendar.Selected.Month === calendar.Today.Month &&
                calendar.Selected.Year === calendar.Today.Year) {
                day.className += ' today';
            }

            days.appendChild(day);
        }

        let extraDaysInCalendar = 13;

        if (days.children.length > 35) {
            extraDaysInCalendar = 6;
        } else if (days.children.length < 29) {
            extraDaysInCalendar = 20;
        }

        for (let i = 0; i < (extraDaysInCalendar - calendar.Selected.LastDay); i++) {
            let day = document.createElement('li');
            day.className += 'calendar-day next-month';

            let digit = DayDigit(i + 1);
            day.appendChild(digit);

            days.appendChild(day);
        }

        mainSection.appendChild(days);
    };
    element.appendChild(mainSection);

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


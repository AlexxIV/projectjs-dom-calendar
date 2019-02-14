let localStorageEvents = [
    {'Date': new Date(2019, 1, 1), 'Title': 'Test1'},
    {'Date': new Date(2019, 2, 2), 'Title': 'Test2'},
    {'Date': new Date(2019, 3, 3), 'Title': 'Test3'},
];
let eventsPass = [
    {'Date': new Date(2019, 4, 4), 'Title': 'Test4'},
    {'Date': new Date(2019, 5, 5), 'Title': 'Test5'},
    {'Date': new Date(2019, 6, 6), 'Title': 'Test6'},
];

localStorage.setItem('Events', JSON.stringify(localStorageEvents));
let settings = {};
let element = document.getElementById('demo');
Initialize(element, eventsPass, settings);

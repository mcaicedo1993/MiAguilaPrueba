
console.log('huehuehue');

var constants = {
    city_selector_control: '#city_selector',
    status_selector_control: '#status_selector',
    grid: '#grid'
}

var data = {
    trips: []
}

var map = {
    map: null,
    markers: []
}

var methods = {
    init: function () {
        methods.initializeGrid();
    },
    loadInfo: function () {
        $.ajax({
            url: '/loadinfo',
            type: 'post',
            data: {
                'city': $(constants.city_selector_control).val(),
                'status': $(constants.status_selector_control).val()
            },
            success: function (result) {
                if (result) {
                    if (result.status = 'ok') {
                        data.trips = result.data;
                        $(constants.grid).jsGrid("option", "data", data.trips);

                    }
                    else {
                        alert('Falló algo');
                    }
                }
                else {
                    alert('Falló algo');
                }
            }
        });
    },
    printSelectedInfo: function (trip) {
        for (var i = 0; i < map.markers.length; i++) {
            var current_marker = map.markers[i];
            current_marker.setMap(null);
        }
        map.markers = [];

        var start_point = {
            lat: trip.start[1],
            lng: trip.start[0]
        };

        var end_point = {
            lat: trip.end[1],
            lng: trip.end[0]
        };

        var start_marker = new google.maps.Marker({
            position: start_point,
            map: map.map,
            label: 'Inicio'
        });
        map.markers.push(start_marker);

        var end_marker = new google.maps.Marker({
            position: end_point,
            map: map.map,
            label: 'Fin'
        });
        map.markers.push(end_marker);

        //if (data.trips && map.map) {
        //    for (var i = 0; i < data.trips.length; i++) {
        //        var trip = data.trips[i];
        //        var uuu = 1;
        //                //var marker = new google.maps.Marker({
        ////    position: uluru,
        ////    map: map
        ////});
        //    }
        //}
    },
    initMap: function () {
        var bogota = {
            lat: 4.613420,
            lng: -74.091562
        };

        map.map = new google.maps.Map(
            document.getElementById('map'), {
                zoom: 4,
                center: bogota
            });
        // The marker, positioned at Uluru
        //var marker = new google.maps.Marker({
        //    position: uluru,
        //    map: map
        //});
    },
    initializeGrid: function () {
        var db = {
            loadData: function (filter) {
                return $.grep(data.trips, function (client) {
                    return true;
                });
            },

            insertItem: function (insertingClient) { },
            updateItem: function (item) { },
            deleteItem: function (deletingClient) { }
        };

        $(constants.grid).jsGrid({

            width: "100%",
            noDataContent: "No hay viajes",
            filtering: false,
            inserting: false,
            editing: false,
            sorting: true,
            paging: true,
            pageIndex: 1,
            pageSize: 9,
            pageButtonCount: 15,
            pagerFormat: "Viajes: {first} {prev} {pages} {next} {last}    {pageIndex} de {pageCount}",
            pagePrevText: "Ant",
            pageNextText: "Siguiente ",
            pageFirstText: "1",
            pageLastText: " Último",
            pageNavigatorNextText: "...",
            pageNavigatorPrevText: "...",
            loadMessage: "Dame un minuto, estoy buscando",
            controller: db,
            fields: [
                { name: "passenger_fisrt_name", title: "Nombre", type: "text", width: 25, editing: false },
                { name: "passenger_last_name", title: "Apellido", type: "text", width: 25, editing: false },
                { name: "status", title: "Estado", type: "text", width: 25, editing: false },
                {
                    type: "control",
                    width: 25,
                    deleteButton: false,
                    editButton: false,
                    itemTemplate: function (value, item) {
                        var $result = jsGrid.fields.control.prototype.itemTemplate.apply(this, arguments);
                        var $CheckButton = $("<a>")
                            .text('Ver puntos')
                            .prop('href', '#')
                            .click(function (e) {
                                methods.printSelectedInfo(item);
                                e.stopPropagation();
                            });
                        return $result.add($CheckButton);
                    }
                }
            ]
        });
        $(constants.grid).jsGrid("option", "data", data.trips);
    }
}

methods.init();

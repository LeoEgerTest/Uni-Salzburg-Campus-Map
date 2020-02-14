 var map, view;

      require([
        "esri/Map",
        "esri/views/MapView",
        "esri/widgets/Search",
        "esri/widgets/LayerList",
        "esri/widgets/Expand",
        "esri/widgets/Locate",
        "esri/layers/FeatureLayer",
        "esri/views/layers/FeatureLayerView",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
        "esri/layers/GroupLayer",
        "esri/tasks/RouteTask",
        "esri/tasks/support/RouteParameters",
        "esri/tasks/support/FeatureSet",
        "esri/symbols/PictureMarkerSymbol",
        "esri/core/urlUtils",
        "dojo/on",
        "dojo/domReady!"
      ], function(Map, MapView, Search, LayerList,Expand,Locate, FeatureLayer, FeatureLayerView,
         Graphic,GraphicsLayer,GroupLayer,RouteTask, RouteParameters,FeatureSet,PictureMarkerSymbol,
         urlUtils, on) {

        //Layer renderers
        var footprintsRenderer = {
          type: "simple",
          symbol: {
              type: "simple-fill",
              color: [ 0,146,82 ],
              style:"solid",
              outline:{
                  color:"white",
                  width: 1
              }
          }
        };
        var stairsRenderer = {
          type: "simple",
          symbol: {
            type: "picture-marker",
            url: "https://spatialcontrol.de/leo/leo/campus/4/img/stairs2.png"
          }
        }
        var elevatorsRenderer = {
          type: "simple",
          symbol: {
            type: "picture-marker",
            url: "https://spatialcontrol.de/leo/leo/campus/4/img/elevator.png",
            color: [0,146,82],
            outline: {
              color: 'white'
            }
          }
        }

        //Layer declaration  
        var footprints = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/UniGebaeude/FeatureServer",
          title: "Building Footprints",
          outFields:"*",
          popupTemplate:{
              title: " {kName} " ,
              content: "Name: {kName} <br>" + "Area: {BEREICH} <br>" + "Adress: {ADRESSE} <br> <a href=www.google.de>test</button>"
          },
//          maxScale:5000,
          renderer: footprintsRenderer
        });
        var footprintsPoints = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/UniGebaeude_FeatureToPoint/FeatureServer",
          title: "Building Points",
          outFields:"*",
          popupTemplate:{
              title: " {kName} " ,
              content: "Name: {kName} <br>" + "Area: {BEREICH} <br>" + "Adress: {ADRESSE} <br> <a href=www.google.de>test</button>"
          },
          maxScale:5000,
          listMode:"hide"
        });
        var floorplans = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/UniBuildings/FeatureServer/2",
          title: "Building Floorplans",
          outFields:"*",
          minScale: 5000,
          popupTemplate:{
              title: "Roomcode: {roomCode} " ,
              content: "Name: {NAME} <br>" + "Roomtype: {roomType} <br>" + "Code: {roomCode}"
          }
        });



        //Layers for points of interest

        //renderers for stairs and elevators since there was no usable icon in arcgis
 //....

        // facility room pois
        var entrances = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/Points_of_Interest_clipped_10km/FeatureServer/1",
          title: "Entry to building",
          minScale: 3000
        })
        var libraries = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/Points_of_Interest_clipped_10km/FeatureServer/3",
          title: "Libraries",
          minScale: 3000
        })
        var toilets = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/Points_of_Interest_clipped_10km/FeatureServer/4",
          title: "Toilets",
          minScale: 3000
        })
        var toilets = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/Points_of_Interest_clipped_10km/FeatureServer/4",
          title: "Toilets",
          minScale: 3000
        })
        var stairs = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/Points_of_Interest_clipped_10km/FeatureServer/5",
          title: "Stairs",
          minScale: 3000,
          renderer: stairsRenderer
        })
        var elevators = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/Points_of_Interest_clipped_10km/FeatureServer/6",
          title: "Elevators",
          minScale: 3000,
          renderer: elevatorsRenderer
        })
      //traffic related pois

        var bicycle_parking = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/Points_of_Interest_clipped_10km/FeatureServer/8",
          title: "Bicycle parking",
          minScale: 3000
        })
        var parking_underground = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/Points_of_Interest_clipped_10km/FeatureServer/9",
          title: "Underground parking",
          minScale: 3000
        })
        var parking = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/Points_of_Interest_clipped_10km/FeatureServer/10",
          title: "Parking",
          minScale: 3000
        })
        var bus_stops = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/Points_of_Interest_clipped_10km/FeatureServer/11",
          title: "bus_stops",
          minScale: 3000
        })
        var railwaystations = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/Points_of_Interest_clipped_10km/FeatureServer/12",
          title: "raylway stations",
          minScale: 3000
        })
        var taxi = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/Points_of_Interest_clipped_10km/FeatureServer/13",
          title: "taxi",
          minScale: 3000
        })
        var fuel_station = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/Points_of_Interest_clipped_10km/FeatureServer/14",
          title: "Fuel stations",
          minScale: 3000
        })
        //consume related pois
        var beverages = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/Points_of_Interest_clipped_10km/FeatureServer/16",
          title: "Beverages",
          minScale: 3000,
          popupTemplate:{
            title: "Name: {name} " ,
            content: "Name: {name} <br>" + "Type: {fclass} <br>"
        }
        })
        var restaurants = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/Points_of_Interest_clipped_10km/FeatureServer/17",
          title: "Restaurants",
          minScale: 3000,
          popupTemplate:{
            title: "Name: {name} " ,
            content: "Name: {name} <br>" + "Type: {fclass} <br>"
        }
        })
        var shopping = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/Points_of_Interest_clipped_10km/FeatureServer/18",
          title: "Shopping",
          minScale: 3000,
          popupTemplate:{
            title: "Name: {name} " ,
            content: "Name: {name} <br>" + "Type: {fclass} <br>"
        }
        })
        var bankAtm = new FeatureLayer({
          url:"https://services.arcgis.com/Sf0q24s0oDKgX14j/arcgis/rest/services/Points_of_Interest_clipped_10km/FeatureServer/19",
          title: "banks and atms",
          minScale: 3000,
          popupTemplate:{
            title: "Name: {name} " ,
            content: "Name: {name} <br>" + "Type: {fclass} <br>"
        }
        })

            // The stops and route result will be stored in this layer
        var routeLayer = new GraphicsLayer({
              /* listMode: "hide", */
              title: "Route Layer"
        });

        //define GroupLayers

        var trafficLayer = new GroupLayer({
          title: "Traffic",
          visible: false,
          layers: [bicycle_parking,parking_underground,parking, bus_stops, railwaystations,taxi,fuel_station]
        });
        var publicInfrastructure = new GroupLayer({
          title: "Public Infrastructure",
          visible: false,
          layers: [beverages,restaurants,shopping,bankAtm]
        });
        var facilityRooms = new GroupLayer({
          title: "Room Info",
          visible: false,
          layers: [libraries,toilets,stairs,elevators]
        });
        var buildingDetails = new GroupLayer({
          title: "Building Details",
          visible: true,
          layers: [footprints,floorplans,footprintsPoints, entrances]
        });


        //Set up the map
        var map = new Map({
          basemap: "gray",
          layers: [routeLayer,buildingDetails,
           facilityRooms,publicInfrastructure,trafficLayer] //footprintsNear,
        });
        var view = new MapView({
          map: map,
          container: "viewDiv",
          zoom: 14,
          center: [13.036974,47.803741],//
          popup:{
              dockEnabled:true,
              collapsed:false
          }
        });
        view.ui.remove("zoom");
//        console.log(footprintsPoints);
//        view.when(function(){
//            view.goTo(footprintsPoints.fullExtent);
//        });
        //widgets

        var layerListSideBar = document.getElementById("layerlist");
        /* layerListSideBar.innerHTML=layerList.domNode; */

        var layerList = new LayerList({
            view:view,
            container: document.createElement("div")
           /* container: layerListSideBar */
        });
        /* layerListSideBar.innerHTML=layerList.domNode; */
        var search = new Search({
            view:view,
            container: document.createElement("div")
        });
        var searchExpand = new Expand({
            expandIconClass: "esri-icon-search",
            view: view,
            content: search.domNode
        });
        var locateWidget = new Locate({
            view:view
//            graphic: new Graphic({
//                symbol: { type: "simple-marker"}
//            })
        });
        var layerListExpand = new Expand({
            expandIconClass: "esri-icon-layer-list",
            view: view,
            content: layerList.domNode,
            expanded: false
        });

        //add widgets to the ui    
        view.ui.add(searchExpand,"top-right");
        view.ui.add(layerListExpand,"bottom-right");
        view.ui.add(locateWidget,"top-right");


        //handle the sidebar closer
        var sideBar = document.getElementById("sideBar");
        var sidebarX = document.getElementById("closeSidebar");


        var closed = 0;
        sidebarX.addEventListener("click",function(){
            if (closed == 0){
              sideBar.style.display="none";
              sidebarX.className="esri-icon-right-triangle-arrow"
              
            closed = 1;
          }else{
            sideBar.style.display="block";
            closed = 0;
            sidebarX.className="esri-icon-left-triangle-arrow"
          }
          
        })
        
        

        //do something when hovering over rooms
        view.on("pointer-move", function(event) {
            view.hitTest(event).then(function(response) {
                                                                            // check if a feature is returned from the floorplan layer
                                                                            // do something with the result graphic
              const graphic = response.results.filter(function(result) {
                return result.graphic.layer === floorplans;
              })[0].graphic;
              document.getElementById("info").style.display = "block";
              document.getElementById("info").innerHTML = "Room code: " +(graphic.attributes.roomCode);
            });
          });
        //do something when hovering over footprints
        view.on("pointer-move", function(event) {
            view.hitTest(event).then(function(response) {
                                                                            // check if a feature is returned from the footprints layer
                                                                            // do something with the result graphic
              const graphic = response.results.filter(function(result) {
                return result.graphic.layer === footprints;
              })[0].graphic;
              document.getElementById("info").style.display = "block";
              document.getElementById("info").innerHTML = "Faculty: "+ graphic.attributes.KNAME;// +(graphic.attributes.kName);
              
              //highlight the hovered feature
//              while (graphic !== []){
//                  view.whenLayerView(footprints).then(function(layerView){
//                        layerView.highlight(graphic);
//                        console.log("test");
//                    });
//              }
              
            });
          });
          
          //Save the target destination to a variable

          var navigationTarget;
          
          //query the uni building addresses from the featurelayer
//          var uniBuildings;
          var query = footprints.createQuery();
          var uniSelect = document.getElementById('uniSelect');
          query.where = "1=1";
          footprints.queryFeatures(query)
                  .then (function(response){
                var uniBuildings = response.features; 
                var i;
                var select;
                for (i=0; i < uniBuildings.length;i++){
                select +="<option value="+[i] + ">" + uniBuildings[i].attributes.ADRESSE + "</option>" ; 
                 //put the options in the uni building select
                 uniSelect.innerHTML = select;
                }
                document.getElementById('uniSelect').addEventListener("change",selectUni);
                function selectUni(){
                    view.goTo(uniBuildings[uniSelect.value]);
                    navigationTarget =  uniBuildings[uniSelect.value];
                }
            });
              
              
              //query the uni building addresses from the featurelayer
//          var uniBuildings;
          var query2 = footprints.createQuery();
          var districtSelect = document.getElementById('districtSelect');
          query.where = "1=1";
          footprints.queryFeatures(query)
                  .then (function(response){
                  
                var uniBuildings = response.features; 
        
                      
                    //put the options in the uni building select
//                document.getElementById("uniSelect").innerHTML = "<select><option value='test'>test</option></select>";

                var i;
                var select;
                for (i=0; i < uniBuildings.length;i++){
//                    console.log(uniBuildings[i].attributes);
//                    console.log(i);
                    select +="<option value="+[i] + ">" + uniBuildings[i].attributes.KNAME + "</option>" ; //"<option value=''>Choose Adress</option>\n\
                 //put the options in the uni building select
                 districtSelect.innerHTML = select;
                }
                
                
                //event listener for select
                districtSelect.addEventListener("change",selectDistrict);
                function selectDistrict(){
                    view.goTo(uniBuildings[districtSelect.value]);
                    navigationTarget =  uniBuildings[districtSelect.value];
//                    view.whenLayerView(footprints).then(function(layerView){
//                        
//                        layerView.highlight(uniBuildings[uniSelect.value]);
//                        console.log("test");
//                    });

                }
              });

            //Query the floorplans layer for the {roomCode}
          var queryRoom = floorplans.createQuery();
          
          var roomSelectSearch = document.getElementById('roomCodeSearch');

          roomSelectSearch.addEventListener("click", searchRoom);
          function searchRoom(){
            var roomSelect = document.getElementById('roomCode');
            queryRoom.where = "roomCode = '" + roomSelect.value + "'" ;//EBMÖEG0.15


            floorplans.queryFeatures(queryRoom)
            .then(function(response){
              var selectedRoom = response.features;
              console.log(selectedRoom);
              navigationTarget =  selectedRoom;
              view.goTo({   // for testing UNIPEG0.001
                target: selectedRoom,
                zoom: 20
              });
              console.log("tets");
              selectedRoom.highlight();
              
            })

            
          } 
            //Query the footprints layer for the tags {tag1, tag2 ...}
            var queryTag = footprints.createQuery();

            var tagSearch = document.getElementById('tagSearch');
  
            tagSearchBtn.addEventListener("click", searchTag);
            
            function searchTag(){
              
              var roomSelect = document.getElementById('searchTag');
              queryTag.where = "tag1 = '" + roomSelect.value + "' OR tag2 = '" +roomSelect.value + "'OR tag3 = '" +roomSelect.value + "'OR tag4 = '" + roomSelect.value +"' ";//nawi //"'"
              
              footprints.queryFeatures(queryTag)
              .then(function(response){
                var result = response.features;
                console.log(result);

  
  
                view.goTo({   // for testing UNIPEG0.001
                  target: result,
                  zoom: 18
                });
                result.highlight();
                
              })
  
              
            } 

     var navigationStart;       
        //get coordinates from locate widget
        locateWidget.on("locate",function(locateEvent){
          console.log(locateEvent.target.graphic);
          /* navigationStart = locateEvent.position.coords; */
          navigationStart = locateEvent.target.graphic;
      });

//////////////////////////////////////////////Routing 1. Try (Need arcgis online proxy. not available on uni account) 


    var routeFromLocation = document.getElementById("routeFromLocation");   
    var routeFromLocationInfo = document.getElementById("routeFromLocationInfo");       
    var routeTask = new RouteTask({
          url:
            "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World"
        });
        

    
    // Setup the route parameters
    var routeParams = new RouteParameters({
      stops: new FeatureSet(), //new FeatureSet(navigationStart, navigationTarget)
      outSpatialReference: {
        // autocasts as new SpatialReference()
        wkid: 3857
      }
    });
    
/////////////////////////////////////////////////////////////////////////
//routing service works online if the website is hosted online
/////////////////////////////////////////////////////////////////////////////above original code 


var stopSymbol = {
  type: "simple-marker",
  style: "cross",
  size: 15,
  color: "orange",
  outline: {
    width:2
  }
};

var routeSymbol = {
  type : "simple-line",
  color: [0,146,82,0.5],
  width:5
}

routeFromLocation.addEventListener("click", function(){


 routeLayer.removeAll();

    
    locateWidget.locate();

    locateWidget.on("locate", function(locateEvent){

        console.log("removeAll Graphics: " + routeLayer.graphics.length );
        routeLayer.graphics.removeAll();
        console.log("removeAll Graphics: " + routeLayer.graphics.length );
     
      navigationStart = locateEvent.target.graphic;
      
      var navigationStartStop = new Graphic({
        geometry: navigationStart.geometry
        //symbol: stopSymbol
      })

      if (navigationTarget === undefined){
        console.log("no target specified");
        routeFromLocationInfo.style.display="block";
      }else{
        routeFromLocationInfo.style.display="none";

        var navigationTargetStop = new Graphic({
          geometry: navigationTarget.geometry.extent.center,
          symbol: stopSymbol
        })
      console.log("route Parameters");
      console.log(routeParams);

      routeParams.stops.features.push(navigationStartStop);
      routeParams.stops.features.push(navigationTargetStop); 




      routeTask.solve(routeParams).then(showRoute);

      function showRoute(data) {
        console.log("Params:");
        console.log(routeParams);
        var routeResult = data.routeResults[0].route;

        routeResult.symbol = routeSymbol;
        
        routeLayer.add(routeResult); //
        view.goTo(routeResult.geometry);
        console.log("routeLayer added");
        console.log(routeResult);
      }

      }
      






    });
    
});



})
